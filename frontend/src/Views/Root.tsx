import HomeView from "./HomeView";
import React, {useState} from "react";
import '../Styles/RootStyle.css';
import {account} from "../Models/data";
import QuizView from "./QuizView";

export default function Root() {
    const [mainContent, setMainContent] = useState('home');
    const [quiz, setQuiz] = useState(undefined);
    const [accountData, setAccountData] = useState(account);

    return (
        <div className={"RootContainer"}>
            <div className={"SideBar"}>
                {/*<p>Sidebar</p>*/}
            </div>
            <>
                {
                    (mainContent === 'home') ?
                    <HomeView setMainContent={setMainContent} setQuiz={setQuiz} accountData={accountData} setAccountData={setAccountData} />
                    : <QuizView setMainContent={setMainContent} init_data={quiz} />
                }
            </>
        </div>
    );
}