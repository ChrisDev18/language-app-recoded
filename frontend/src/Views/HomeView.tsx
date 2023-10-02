import {Home_Args} from "../Models/Arguments";
import {QuizInstance} from "./QuizInstance";
import React, {useState} from "react";
import '../Styles/HomeViewStyle.css';
import {Quiz_Model, ToastModel} from "../Models/Models";
import LoadingOverlay from "./LoadingOverlay";
import Toast from "./Toast";
import Avatar from "./Avatar";
import Tooltip from "./Tooltip";

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
            <QuizInstance key={quiz.id} quiz={quiz} setQuiz={setQuiz} setMainContent={setMainContent} getQuizzes={getQuizzes} setToastProperty={setToastProperty}/>
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

    function handleCreateQuizClicked() {
        setQuiz(undefined)
        setMainContent('quiz')
    }


    return (
        <div id={"Home"}>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
            <LoadingOverlay message={"Loading your quizzes"} active={isLoading} />
            <Toast properties={toastProperty} setProperties={setToastProperty} />

            <div id={"Home-Topbar"}>
                <h1>Quizzes</h1>

                <div id={"Home-Profile"}>
                    <Tooltip text={"Get quizzes from database"} side={"bottom"} delayDuration={200}>
                        <button className={"Symbol"} type={"button"} onClick={getQuizzes}>
                            <span className="material-symbols-rounded">
                                refresh
                            </span>
                        </button>
                    </Tooltip>
                    <p id={"Home-Profile-Name"}>{accountData.name}</p>
                    <Avatar id={"Home-Profile-Picture"}
                            fallback={accountData.name[0]}
                            alt={accountData.name}/>
                </div>
            </div>

            <div id={"Home-Quizzes"}>

                <div id={"Home-Quizzes-List-Wrapper"}>
                    <div id={"Home-Quizzes-List"}>
                        {quizList.length > 0 ? quizList :
                            <p className={"Background"}>You have no quizzes<br/>Try refreshing to update, or make a quiz with the button below</p>}
                    </div>
                </div>


                <Tooltip text={"Create new quiz"} side={"left"} delayDuration={200}>
                    <button id={"Home-Quizzes-NewQuiz"} className={"Main Symbol"} type={"button"} onClick={handleCreateQuizClicked}>
                        <span className="material-symbols-rounded">
                            add
                        </span>
                    </button>
                </Tooltip>

            </div>

        </div>
    );
}