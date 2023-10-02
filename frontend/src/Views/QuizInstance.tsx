import React from "react";
import {Quiz_Instance_Args} from "../Models/Arguments";
import '../Styles/GlobalStyles.css';
import '../Styles/QuizInstanceStyle.css';
import {ContextMenu} from "@radix-ui/react-context-menu";
import ContextMenuDemo from "./ContextMenu";
import {Quiz_Model} from "../Models/Models";

export function QuizInstance({quiz, setQuiz, setMainContent, getQuizzes, setToastProperty}: Quiz_Instance_Args) {
    const ContentRows = quiz.entries
        .sort((a, b) => a.index-b.index)
        .slice(0,2)
        .map((entry) =>
        <div className={"Row"}>
            <p>{entry.a}</p>
            <p>{entry.b}</p>
        </div>
    )

    function handleOpen(e: React.MouseEvent<HTMLButtonElement>) {
        // TODO get the related quiz from pressed quiz button
        setQuiz(quiz);
        setMainContent('quiz');
    }

    async function handleDelete() {
        try {
            // @ts-ignore
            let response = await fetch(`http://127.0.0.1:5000/data/quiz/${quiz.id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'text/plain',
                    "Access-Control-Allow-Origin": "*"
                },
            });

            if (response.ok) {
                // update the quiz list
                await getQuizzes()

                // show success toast
                setToastProperty({
                    open: true,
                    title: "Quiz deleted successfully",
                    description: "",
                    type: "success"
                });
            } else {
                throw new Error("HTTP Response: " + response.status);
            }
        } catch (error) {
            console.error("Error retrieving data from API:", error)
            setToastProperty({
                open: true,
                title: "Could not delete your quizzes",
                description: "Error accessing data from API",
                type: "error"
            });

        }
    }


    return (
        <ContextMenuDemo content={[
            {text: "Open quiz", action: handleOpen},
            {text: "Delete quiz", action: handleDelete}
        ]}>
            <button className={"QuizInstance"} type={"button"} onClick={handleOpen}>
                <div id={"Content"}>
                    <p id={"Title"}>{quiz.title}</p>
                    <div id={"EntryPeek"}>
                        {ContentRows}
                    </div>
                </div>

                <div id={"BottomBar"}>
                    <p id={"Tags"}>{quiz.entries.length} entries</p>
                </div>
            </button>
        </ContextMenuDemo>
    );
}