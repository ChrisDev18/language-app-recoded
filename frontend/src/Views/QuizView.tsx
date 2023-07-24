import React, {useState} from 'react';
import '../Styles/QuizViewStyle.css';
import {Quiz_Args} from "../Models/Arguments";
import {QuizEntry} from "./QuizEntry";
import '../Styles/GlobalStyles.css';
import {Entry_Model, Quiz_Model, ToastModel} from "../Models/Models";
import LoadingOverlay from "./LoadingOverlay";
import Toast from "./Toast";

export default function QuizView({setMainContent, init_data = undefined, init_editMode = false}: Quiz_Args) {
    // if quiz empty (new), initialise it
    if (init_data === undefined) {
        init_data = {
            id: -1,
            owner_id: 1,
            title: "",
            description: "",
            entries: []
        }
        init_editMode = true;
    }

    // assign a state for the Quiz data model
    const [dataModel, setDataModel] = useState(init_data);
    const [originalQuiz, setOriginalQuiz] = useState(init_data);

    // assign loading state
    const [isLoading, setIsLoading] = useState(false);
    // assign toast opened state
    let property: ToastModel = {
        open: false,
        title: "Toast",
        description: "Description",
        type: "success"}
    const [toastProperty, setToastProperty] = React.useState(property);

    // assign states for whether the UI is in edit mode (and if the current data model is valid)
    const [editMode, setEditMode] = useState(init_editMode);
    const [serialIndex, setSerialIndex] = useState(-1);
    const [showErrors, setShowErrors] = useState(false);

    // sort entries, then update indexes, then generate a component for each entry
    const termsList = dataModel.entries
        .sort((a, b) => a.index-b.index)
        .map((entry, i) => {
            entry.index = i;
            return entry;
        }).map((entry) =>
        <QuizEntry key={entry.id} id={entry.id} dataModel={dataModel} setDataModel={setDataModel} editable={editMode}/>
    );

    function checkEntry(entry: Entry_Model): boolean {
        let isValid = true
        if (["", " "].includes(entry.a)) {
            isValid = false;
        }
        if (["", " "].includes(entry.b)) {
            isValid = false;
        }
        return isValid;
    }

    function checkValidity(): string[] {
        let errorArray = [];
        // check that title exists
        if (["", " "].includes(dataModel.title)) {
            errorArray.push("Your title is empty");
        }
        // check that there are at least 3 entries
        if (dataModel.entries.length < 3) {
            errorArray.push("You need at least 3 terms");
        }
        // check for errors in each entry
        dataModel.entries.forEach((entry: Entry_Model, index) => {
            if (! checkEntry(entry)) {
                errorArray.push(`Term ${index+1} is incomplete`)
            }
        });
        return errorArray;
    }

    function checkIfChanged(): boolean {
        let isEqual = require('lodash.isequal');
        return ! isEqual(dataModel, originalQuiz);
    }

    async function handleSave() {
        if (checkValidity().length === 0) {
            // when valid
            // TODO save quiz in database
            try {
                setIsLoading(true);
                let body: string = JSON.stringify(dataModel);
                // console.log(body);
                let response = await fetch(`http://127.0.0.1:5000/data/quiz`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'text/plain',
                        "Access-Control-Allow-Origin": "*"
                    },
                    body: body
                });

                if (response.ok) {
                    // get returned quiz and set it as the new model
                    let quiz: Quiz_Model = await response.json();
                    setOriginalQuiz(quiz);
                    setDataModel(quiz)

                    // show success toast
                    setToastProperty({
                        open: true,
                        title: "Quiz saved successfully",
                        description: "",
                        type: "success"
                    });
                    setEditMode(false)

                } else {
                    throw new Error("HTTP Response: " + response.status);
                }

            } catch(error) {
                console.error("Error saving data to API:", error)
                setToastProperty({
                    open: true,
                    title: "Could not save quiz",
                    description: "Error accessing API",
                    type: "error"
                });
                // console.log(toastProperty);
            } finally {
                setIsLoading(false);
            }

        } else {
            // when invalid
            alert(`Quiz has ${checkValidity().length} issues, please fix red terms`);
        }
    }

    function handleEdit() {
        setEditMode(true);
    }

    function handleDiscard() {
        let accepted: boolean = true;
        // check if there are any changes to discard
        if (checkIfChanged()) {
            // eslint-disable-next-line no-restricted-globals
            accepted = confirm("Are you sure you wish to discard your changes?");
        }

        if (accepted) {
            if (dataModel.id < 0) {
                setMainContent('home');
            } else {
                // TODO reset the entries
                setDataModel(originalQuiz);
                setEditMode(false);
            }
        } else {
            return;
        }
    }

    function handleUpdateTitle(e: React.ChangeEvent<HTMLInputElement>) {
        setDataModel({
            ...dataModel,
            title: e.target.value
        });
        checkValidity();
    }

    function handleUpdateDescription(e: React.ChangeEvent<HTMLInputElement>) {
        setDataModel({
            ...dataModel,
            description: e.target.value
        });
        checkValidity();
    }

    function handleAddEntry() {
        // check for empty terms before adding a term
        let canAdd = true;
        // dataModel.entries.forEach((entry: Entry_Model) => {
        //     if (! checkEntry(entry)) {
        //         alert("Please fill in all terms before adding another term")
        //         canAdd = false;
        //         return;
        //     }
        // });

        if (canAdd) {
            setDataModel({
                ...dataModel,
                entries: [
                    ...dataModel.entries, {
                        id: serialIndex,
                        a: "",
                        b: "",
                        pos: "NULL",
                        index: dataModel.entries.length+1
                    }
                ]
            });
            setSerialIndex(serialIndex - 1);
        }
    }

    function handleBack() {
        setMainContent("home");
    }

    // what to render when editing quiz
    if (editMode) {
        return (
            <div className={"QuizViewContainer"}>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

                <LoadingOverlay message={"Saving quiz"} active={isLoading} />
                <Toast properties={toastProperty} setProperties={setToastProperty} />

                <div className={"TopBar"}>
                    <div className={"QuizInfo"}>
                        <input id={"TitleInput"}
                               className={"SectionHeader" + (["", " "].includes(dataModel.title) ? " error" : "")}
                               onInput={handleUpdateTitle}
                               value={dataModel.title}
                               placeholder={"Give your quiz a title"}/>
                        <input id={"DescriptionInput"}
                               className={"SectionInfo"}
                               onInput={handleUpdateDescription}
                               value={dataModel.description}
                               placeholder={"What's this quiz about?"}/>
                    </div>

                    <div id={"QuizRight"}>
                        {checkIfChanged() ? <p id={"SaveState"}>Unsaved changes</p> : null}
                        <button type={"button"} disabled={!(checkValidity().length===0) || !checkIfChanged()} onClick={handleSave}>Save</button>
                        <button type={"button"} id={"DiscardButton"} onClick={handleDiscard}>{checkIfChanged() ? "Discard" : "Back"}</button>
                    </div>
                </div>

                <div id={"center"}>
                    <div id={"entryList"}>
                        {termsList.length === 0 ? <p className={"Background"}>This quiz has no terms, press the button below to add a term</p> : termsList}
                    </div>
                </div>

                <div className={(checkValidity().length===0) ? "StatusBar" : "StatusBar error"}
                     onMouseOver={() => setShowErrors(true)}
                     onMouseLeave={() => setShowErrors(false)}>
                    <button id={"addButton"}
                            className={"Main"}
                            type={"button"}
                            onClick={handleAddEntry}>
                        <span>+</span>
                    </button>

                    {(checkValidity().length===0) ? "Your quiz is ready to save!" :
                        (checkValidity().length===1) ? `There is ${checkValidity().length} thing you need to do` :
                            `There are ${checkValidity().length} things you need to do`}

                    {showErrors ? <div>{checkValidity().map(error => <p>{error}</p>)}</div> : ""}

                </div>
            </div>
        );

    // what to render when viewing quiz
    } else {
        return (
            <div className="QuizViewContainer">
                <LoadingOverlay message={"Saving quiz"} active={isLoading} />
                <Toast properties={toastProperty} setProperties={setToastProperty} />
                <div className={"QuizTopBar"}>
                    <div id={"QuizLeft"}>
                        <button onClick={handleBack} type={"button"}>
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div className={"QuizInfo"}>
                            <h1 className={"SectionHeader"}>{dataModel.title}</h1>
                            <p className={"SectionInfo"}>{dataModel.description}</p>
                        </div>
                    </div>
                    <button onClick={handleEdit} type={"button"}>Edit Quiz</button>
                </div>

                <div id={"center"}>
                    <div id={"entryList"}>
                        {termsList}
                    </div>
                </div>

                <div className={"StatusBar"}>
                    {dataModel.entries.length} term(s)
                </div>
            </div>
        );
    }
}