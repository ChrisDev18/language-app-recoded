import random

import psycopg2
from flask import jsonify, request
from psycopg2._psycopg import cursor, connection

from app import app, getEntriesDB


class Test:
    def __init__(self, quiz_id, length=0):
        if length < 0:
            raise Exception("A quiz length < 0 is not accepted")

        global session
        # declare class attributes
        self.questions: list[dict]
        self.length: int = length
        self.index = 0

        # get entries from database
        conn: connection
        entries: list[dict]
        with psycopg2.connect(host="localhost",
                              database="language_app",
                              user="language_admin",
                              password="password") as conn:
            cur: cursor
            with conn.cursor() as cur:
                entries = getEntriesDB(quiz_id, cur)

        # assign questions from entries retrieved from DB
        self.questions = [dict(entry, **{'mistakes': 0}) for entry in entries]
        print(self.questions)

        # randomise the questions
        random.shuffle(self.questions)
        if self.length != 0:
            return

        # if test is longer than the quiz, add more repeated terms
        # if test is shorter, leave extra terms in otherwise program will not know which terms weren't asked
        diff = length - len(self.questions)
        if diff > 0:
            extra_questions = random.choices(self.questions, k=diff)
            self.questions += extra_questions

    def get_next(self):
        next_question = self.questions[self.index]
        self.index += 1
        return next_question

    def mark(self, attempt, direction):
        if direction == 0:
            correct = self.questions[self.index]["a"]
        elif direction == 1:
            correct = self.questions[self.index]["b"]
        else:
            raise Exception("Direction argument must be 1 or 0, %d is not accepted" % direction)

        if attempt == correct:
            response = jsonify({"isCorrect": True})
        else:
            response = jsonify({"isCorrect": False})

        return response


class TestManager:
    def __init__(self):
        self._run_increment: int = 0
        self.tests: dict[Test] = {}

    def add_test(self, test: Test) -> int:
        self._run_increment += 1
        self.tests = dict(self.tests, **{self._run_increment: test})
        return self._run_increment

    def get_test(self, test_id) -> Test:
        return self.tests.get(test_id, None)


@app.route('/function/quiz/<int:quiz_id>', methods=['POST'])
def runQuiz(quiz_id: int):  # begins a new run and produces a new run_id
    global session
    test = Test(quiz_id)
    test_id = session.add_test(test)
    return jsonify(test_id)


@app.route('/function/quiz/<int:test_id>', methods=['GET'])
def getNextQuestion(test_id: int):  # sends the next question from run model
    global session
    test = session.get_test(test_id)
    next_question = test.get_next()
    return jsonify(next_question)


@app.route('/function/quiz/<int:test_id>', methods=['POST'])
def submitAnswer(test_id: int):  # receives answer, updates the run model, sends whether it's correct
    global session
    test = session.get_test(test_id)

    body = request.get_json()
    print("Body from submitAnswer:", body)

    is_correct = test.mark(body)
    return jsonify(is_correct)


global session
session = TestManager()
