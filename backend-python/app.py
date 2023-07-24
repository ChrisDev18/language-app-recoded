from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import psycopg2
from psycopg2._psycopg import connection, cursor
import json


app = Flask(__name__)
CORS(app)


# account routes
@app.route('/data/account', methods=['GET'])
def getAccounts():  # gets all accounts

    conn: connection
    with psycopg2.connect(host="localhost",
                          database="language_app",
                          user="language_admin",
                          password="password") as conn:
        cur: cursor
        with conn.cursor() as cur:
            selection = ["account_id", "name", "username", "creation_date"]
            cur.execute("SELECT account_id, name, username, creation_date FROM account")

            rows = cur.fetchall()

            # form dictionary from rows
            accounts = []

            if rows:
                for row in rows:
                    account: dict = {}
                    for i, val in enumerate(selection):
                        account.update({val: row[i]})

                    # serialize date
                    account["creation_date"] = account["creation_date"].strftime("%Y-%m-%d")
                    accounts.append(account)

            # form json HTTP response
            response = jsonify(accounts)
            response.headers.add('Access-Control-Allow-Origin', '*')

    return response


@app.route('/data/account/<int:account_id>', methods=['GET'])
def getAccount(account_id: int):  # gets account from account_id
    """Retrieves an Account from the database in JSON format.
    Parameters
    ----------
    account_id : int
        The id to identify which account to retrieve
    """
    conn: connection
    with psycopg2.connect(host="localhost",
                          database="language_app",
                          user="language_admin",
                          password="password") as conn:
        cur: cursor
        with conn.cursor() as cur:
            selection = ["account_id", "name", "username", "creation_date"]
            query = "SELECT account_id, name, username, creation_date FROM account WHERE account_id = %s"
            cur.execute(query, (account_id,))

            row = cur.fetchone()
            print(row)

            # form dictionary from row
            account: dict = {}
            if row:
                for i, val in enumerate(selection):
                    account.update({val: row[i]})

                # serialize date
                account["creation_date"] = account["creation_date"].strftime("%Y-%m-%d")

            # form json HTTP response
            response = jsonify(account)
            response.headers.add('Access-Control-Allow-Origin', '*')

    return response


# quiz routes
@app.route('/data/quiz', methods=['GET'])
def getQuizzes():  # gets all quizzes
    """Retrieves several Quizzes from the database in JSON format."""

    # get the given account_id filter (if any)
    account_id: int | None = request.args.get('account', default=None, type=int)

    conn: connection
    with psycopg2.connect(host="localhost",
                          database="language_app",
                          user="language_admin",
                          password="password") as conn:
        cur: cursor
        with conn.cursor() as cur:
            # retrieve quizzes from database
            quizzes: [dict] = getQuizzesDB(account_id, cur)

            # get the entries for each quiz
            for i, quiz in enumerate(quizzes):
                entries: [dict] = getEntriesDB(quiz["id"], cur)
                quizzes[i]["entries"] = entries

            # form json HTTP response
            response = jsonify(quizzes)
            response.headers.add('Access-Control-Allow-Origin', '*')

    return response


@app.route('/data/quiz/<int:quiz_id>', methods=['GET'])
def getQuiz(quiz_id: int):  # gets quiz from id
    """Retrieves a Quiz from the database in JSON format.
    Parameters
    ----------
    quiz_id : int
        The id to identify which quiz to retrieve
    """
    conn: connection
    with psycopg2.connect(host="localhost",
                          database="language_app",
                          user="language_admin",
                          password="password") as conn:
        cur: cursor
        with conn.cursor() as cur:
            # get the quiz from the database
            quiz: dict = getQuizDB(quiz_id, cur)

            # get the relevant entries from the database
            entries: [dict] = getEntriesDB(quiz_id, cur)
            quiz["entries"] = entries

            # form json HTTP response
            response = jsonify(quiz)
            # response.headers.add('Access-Control-Allow-Origin', '*')

    return response


@app.route('/data/quiz', methods=['PUT'])
def saveQuiz():
    """Saves a Quiz (given in an HTTP request body) to the database."""

    # get data from body
    quiz_data: dict = request.get_json(force=True)
    print("Given quiz: ", quiz_data)

    conn: connection
    with psycopg2.connect(host="localhost",
                          database="language_app",
                          user="language_admin",
                          password="password") as conn:

        cur: cursor
        # begin transaction
        with conn.cursor() as cur:

            updatedQuiz = saveQuizDB(quiz_data, cur)
            updatedEntries = saveEntriesDB(quiz_data["entries"], quiz_data["id"], cur)
            new_ids = list(map(lambda entry: entry["id"], updatedEntries))
            print(new_ids)
            deleteOldEntries(quiz_data["id"], new_ids, cur)

            updatedQuiz["entries"] = updatedEntries

            print(updatedQuiz)

            # form json HTTP response
            response = jsonify(updatedQuiz)
            # response.headers.add('Access-Control-Allow-Origin', '*')
            # response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
            # response.headers.add('Access-Control-Allow-Methods', 'PUT')
            # response.headers.add("Connection", "keep-alive")

    return response


# # @app.route('/data/quiz/<string:val>', methods=['PUT'])
# def saveNewQuiz(val: str):  # saves quiz without an id
#
#     if val != "new":
#         raise Exception("Invalid route given")
#
#     # get data from body
#     quiz_data: dict = request.get_json(force=True)
#     print(quiz_data)
#
#     conn: connection
#     with psycopg2.connect(host="localhost",
#                           database="language_app",
#                           user="language_admin",
#                           password="password") as conn:
#         cur: cursor
#         with conn.cursor() as cur:
#
#             selection = ["quiz_id"]
#             cur.execute("INSERT INTO quiz (owner_id, title, description) VALUES (%s, %s, %s) RETURNING quiz_id",
#                         (quiz_data["owner_id"], quiz_data["title"], quiz_data["description"]))
#
#             row = cur.fetchone()
#
#             # form dictionary from rows
#             data = []
#             if row:
#                 quizData: dict = {}
#                 for i, val in enumerate(selection):
#                     quizData.update({val: row[i]})
#                 data.append(quizData)
#
#             # convert to json
#             json_row = json.dumps(data, indent=4)
#
#     return json_row


# entry routes
@app.route('/data/entry', methods=['GET'])
def getEntries():  # gets all entries
    # get the given quiz_id filter (if any)
    quiz_id: int = request.args.get('quiz', default=None, type=int)

    conn: connection
    with psycopg2.connect(host="localhost",
                          database="language_app",
                          user="language_admin",
                          password="password") as conn:
        cur: cursor
        with conn.cursor() as cur:
            # get entries from database
            entries = getEntriesDB(quiz_id, cur)

            # convert to json
            json_entries = json.dumps(entries, indent=4)

    return json_entries


@app.route('/data/entry/<int:entry_id>', methods=['PUT'])
def saveEntry(entry_id: int):  # saves entry given an id

    # get data from body
    entry_data: dict = request.get_json(force=True)
    print(entry_data)

    if ("entry_id" in entry_data.keys()) and (entry_data["entry_id"] != entry_id):
        raise Exception("Given quiz_id does not match the one in the given data")

    conn: connection
    with psycopg2.connect(host="localhost",
                          database="language_app",
                          user="language_admin",
                          password="password") as conn:
        cur: cursor
        with conn.cursor() as cur:
            query = ''' INSERT INTO entry (entry_id, term_a, term_b, pos, parent_id, index)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ON CONFLICT (entry_id) DO UPDATE
                        SET term_a = EXCLUDED.term_a, term_b = EXCLUDED.term_b, pos = EXCLUDED.pos,
                        parent_id = EXCLUDED.parent_id, index = EXCLUDED.index'''
            cur.execute(query, (entry_id, entry_data["term_a"], entry_data["term_b"], entry_data["pos"], entry_data["parent_id"], entry_data["index"]))


def getQuizDB(quiz_id: int, cur: cursor):
    """Retrieves quiz data from the Quiz table in the database
    Parameters
    ----------
    quiz_id : int
        The id to identify which quiz to retrieve
    cur : cursor
        The cursor used to access the database
    """

    selection = ["id", "owner_id", "title", "description"]
    cur.execute("SELECT quiz_id, owner_id, title, description FROM quiz WHERE quiz_id = %s", (quiz_id,))
    row = cur.fetchone()
    print(row)
    # form dictionary from rows
    quiz: dict = {}

    if row:
        for i, val in enumerate(selection):
            quiz.update({val: row[i]})

    return quiz


def getQuizzesDB(account_id: int | None, cur: cursor):
    """Retrieves quiz data from the Quiz table in the database for several quizzes
    Parameters
    ----------
    account_id : int | None
        The id to identify which quiz to retrieve. If no id is given, the filter is not applied
    cur : cursor
        The cursor used to access the database
    """

    selection = ["id", "owner_id", "title", "description"]

    if account_id:
        cur.execute("SELECT quiz_id, owner_id, title, description FROM quiz WHERE owner_id = %s", (account_id,))
    else:
        cur.execute("SELECT quiz_id, owner_id, title, description FROM quiz")
    rows = cur.fetchall()

    # form dictionary from rows
    quizzes: [dict] = []

    if rows:
        for row in rows:
            quizData: dict = {}
            for i, val in enumerate(selection):
                quizData.update({val: row[i]})
            quizzes.append(quizData)

    return quizzes


def saveQuizDB(quiz: dict, cur: cursor):
    """Saves Quiz data to the Quiz table in the database
        Parameters
        ----------
        quiz : dict
            The quiz to save to the database
        cur : cursor
            The cursor used to access the database
        """
    print("Saving to Quiz table")

    if quiz["id"] > 0:
        cur.execute("INSERT INTO quiz (quiz_id, owner_id, title, description) VALUES (%s, %s, %s, %s)"
                    + " ON CONFLICT (quiz_id) DO"
                    + " UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description RETURNING quiz_id",
                    (quiz["id"], quiz["owner_id"], quiz["title"], quiz["description"]))
    else:
        cur.execute("INSERT INTO quiz (owner_id, title, description) VALUES (%s, %s, %s) RETURNING quiz_id",
                    (quiz["owner_id"], quiz["title"], quiz["description"]))

    row = cur.fetchone()

    # form dictionary from rows
    updatedQuiz = quiz
    new_id: int = row[0]
    updatedQuiz["id"] = new_id

    print("Updated Quiz: ", updatedQuiz)
    return updatedQuiz


def getEntriesDB(quiz_id: int, cur: cursor):
    """Retrieves Entries belonging to one quiz from the Entry table in the database
    Parameters
    ----------
    quiz_id : int
        Determines the quiz whose entries to retrieve
    cur : cursor
        The cursor used to access the database
    """

    selection = ["id", "parent_id", "a", "b", "pos", "index"]

    if quiz_id:
        cur.execute("SELECT entry_id, parent_id, term_a, term_b, pos, index FROM entry WHERE parent_id = %s",
                    (quiz_id,))
    else:
        cur.execute("SELECT entry_id, parent_id, term_a, term_b, pos, index FROM entry")

    rows = cur.fetchall()
    print(rows)

    # form dictionary from rows
    entries: [dict] = []

    if rows:
        for row in rows:
            entry: dict = {}
            for i, val in enumerate(selection):
                entry.update({val: row[i]})
            entries.append(entry)

    return entries


def saveEntriesDB(entries: [dict], quiz_id, cur: cursor) -> dict:
    """Saves Entries from same quiz to the Entry table in the database

    NOTE: This function only adds/updates values. As there may be old values in the database, deleteOldEntries()
    should be used afterward to clean up old entries.

    Parameters
    ----------
    entries : [dict]
        The entries to save to the database
    quiz_id : int
        The quiz they all belong to
    cur : cursor
        The cursor used to access the database
    """

    print("Saving to Entries table")

    entryIDs: [str] = []
    updatedEntries = entries

    # insert/update the rows received from UI
    for i, entry in enumerate(entries):
        # when entry_id has a real id (already exists in db)
        if entry["id"] > 0:
            query = ''' INSERT INTO entry (entry_id, term_a, term_b, pos, parent_id, index)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ON CONFLICT (entry_id) DO UPDATE
                        SET term_a = EXCLUDED.term_a, term_b = EXCLUDED.term_b, pos = EXCLUDED.pos, parent_id = EXCLUDED.parent_id, index = EXCLUDED.index
                        RETURNING entry_id'''
            cur.execute(query, (entry["id"], entry["a"], entry["b"], entry["pos"], quiz_id, entry["index"]))

        # when entry_id has a false id (is a new entry)
        else:
            query = ''' INSERT INTO entry (term_a, term_b, pos, parent_id, index)
                        VALUES (%s, %s, %s, %s, %s)
                        RETURNING entry_id'''
            cur.execute(query, (entry["a"], entry["b"], entry["pos"], quiz_id, entry["index"]))

        # get id and append to list of IDs
        row = cur.fetchone()
        new_id: int = row[0]

        print("Entry added in DB: ", new_id)
        updatedEntries[i]["id"] = new_id
        entryIDs.append(new_id)

    print("Updated Entries: ", updatedEntries)

    return updatedEntries


def deleteOldEntries(quiz_id: int, current_ids: [int], cur: cursor):
    """Deletes old entries from the database
    Parameters
    ----------
    quiz_id : int
        The quiz to clean up
    current_ids : tuple[int]
        The entries that shouldn't be removed
    cur : cursor
        The cursor used to access the database
    """
    # delete the rows which no longer exist
    print("\nRemoving Entries of given Quiz that were deleted by user from DB:")
    query = "DELETE FROM entry WHERE parent_id = %s AND NOT (entry_id = ANY(%s))"
    cur.execute(query, (quiz_id, current_ids))
    print("\nEntries removed")


if __name__ == '__main__':
    app.run()
