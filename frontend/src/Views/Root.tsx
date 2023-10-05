import HomeView from "./HomeView";
import React, {useState} from "react";
import '../Styles/RootStyle.css';
import {account} from "../Models/data";
import QuizView from "./QuizView";
import Toast from "./Toast";
import {ToastModel} from "../Models/Models";

export default function Root() {
    const [mainContent, setMainContent] = useState('home');
    const [quiz, setQuiz] = useState(undefined);
    const [accountData, setAccountData] = useState(account);

    // assign toast opened state
    let property: ToastModel = {
        open: false,
        title: "Toast",
        description: "Description",
        type: "success"}
    const [toastProperty, setToastProperty] = React.useState(property);

    let theme;
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    if (prefersDarkScheme.matches) {
        theme = "dark-theme";
    } else {
        theme = "";
    }

    return (
        <div className={"RootContainer " +  theme}>
            <div className={"SideBar"}>
                {/*<p>Sidebar</p>*/}
            </div>
            <Toast properties={toastProperty} setProperties={setToastProperty} />
            <>
                {
                    (mainContent === 'home') ?
                    <HomeView setMainContent={setMainContent} setQuiz={setQuiz} accountData={accountData} setAccountData={setAccountData} setToastProperty={setToastProperty}/>
                    : <QuizView setMainContent={setMainContent} init_data={quiz}  setToastProperty={setToastProperty}/>
                }
            </>
        </div>
    );
}