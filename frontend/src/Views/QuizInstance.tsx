import React from "react";
import {Quiz_Instance_Args} from "../Models/Arguments";
import '../Styles/GlobalStyles.css';
import '../Styles/QuizInstanceStyle.css';

export function QuizInstance({quiz, setQuiz, setMainContent}: Quiz_Instance_Args) {
    const ContentRows = quiz.entries
        .sort((a, b) => a.index-b.index)
        .slice(0,2)
        .map((entry) =>
        <div className={"Row"}>
            <p>{entry.a}</p>
            <p>{entry.b}</p>
        </div>
    )

    function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        // TODO get the related quiz from pressed quiz button
        setQuiz(quiz);
        setMainContent('quiz');
    }

    return (
            <button className={"QuizInstance"} type={"button"} onClick={handleClick}>
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
    );
}