import {Home_Args} from "../Models/Arguments";
import {QuizInstance} from "./QuizInstance";
import React, {useState} from "react";
import '../Styles/HomeViewStyle.css';
import {Quiz_Model, ToastModel} from "../Models/Models";
import LoadingOverlay from "./LoadingOverlay";
import Toast from "./Toast";

export default function HomeView({accountData, setAccountData, setQuiz, setMainContent}: Home_Args) {
    // assign loading state
    const [isLoading, setIsLoading] = useState(false);
    // assign toast opened state
    let property: ToastModel = {
        open: false,
        title: "Toast",
        description: "Description",
        type: "success"}
    const [toastProperty, setToastProperty] = React.useState(property);

    const quizList = accountData.quizzes
        .map((quiz) =>
            <QuizInstance key={quiz.id} quiz={quiz} setQuiz={setQuiz} setMainContent={setMainContent}/>
        );

    async function getQuizzes() {
        try {
            setIsLoading(true);
            // console.log(body);
            let response = await fetch(`http://127.0.0.1:5000/data/quiz?account=${accountData.id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'text/plain'
                }
            });

            if (response.ok) {
                // get returned quiz and set it as the new model
                let quizzes: Quiz_Model[] = await response.json();

                setAccountData({
                    ...accountData,
                    quizzes: quizzes
                });

                console.log(accountData);

                // show success toast
                setToastProperty({
                    open: true,
                    title: "Quizzes retrieved successfully",
                    description: "",
                    type: "success"
                });

            } else {
                throw new Error("HTTP Response: " + response.status);
            }

        } catch(error) {
            console.error("Error retrieving data from API:", error)
            setToastProperty({
                open: true,
                title: "Could not find your quizzes",
                description: "Error retrieving data from API",
                type: "error"
            });

        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className={"HomeViewContainer"}>
            <LoadingOverlay message={"Loading your quizzes"} active={isLoading} />
            <Toast properties={toastProperty} setProperties={setToastProperty} />
            <div className={"TopBar"}>
                <h1>Quizzes</h1>
                <button type={"button"} onClick={getQuizzes}>Refresh Quizzes</button>
                <div>
                    <p id={"ProfileName"}>{accountData.name}</p>
                </div>
            </div>
            <div className={"QuizLayout"}>
                {quizList}
            </div>
        </div>
    );
}