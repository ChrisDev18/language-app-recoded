import React from "react";
import {Entry_Args, POS} from "../Models/Arguments";
import '../Styles/GlobalStyles.css';
import '../Styles/QuizEntryStyle.css';
import {PARTS_OF_SPEECH} from "../Models/data";
import {Entry_Model} from "../Models/Models";

export function QuizEntry({dataModel, setDataModel, id, editable = true}: Entry_Args) {
    // define method to get Entry from data model
    const getEntry = (): Entry_Model => dataModel.entries.find((entry: Entry_Model) => entry.id === id);
    if (getEntry() === undefined) {
        console.error("Cannot find current entry");
    }

    const checkEntry = () => ! (["", " "].includes(getEntry().a) || ["", " "].includes(getEntry().b));

    const posOptions = PARTS_OF_SPEECH.map(pos => <option value={pos.id}>{pos.name}</option>)

    function getPosName(givenPOS: POS) {
        let foundPOS = PARTS_OF_SPEECH.find(
            (eachPOS: {id: POS, name: string}) => eachPOS.id === givenPOS
        );
        if (foundPOS === undefined) {
            console.error("Could not find POS name in data")
            return undefined;
        } else {
            return foundPOS.name
        }
    }

    function handleUpdateA(e: React.ChangeEvent<HTMLInputElement>) {
        setDataModel({
            ...dataModel,
            entries: dataModel.entries.map((entry: Entry_Model) => {
                if (entry.id === id) {
                    return {
                        ...entry,
                        a: e.target.value
                    };
                } else {
                    return entry;
                }
            })
        });
    }

    function handleUpdateB(e: React.ChangeEvent<HTMLInputElement>) {
        setDataModel({
            ...dataModel,
            entries: dataModel.entries.map((entry: Entry_Model) => {
                if (entry.id === id) {
                    return {
                        ...entry,
                        b: e.target.value
                    };
                } else {
                    return entry;
                }
            })
        });
    }

    function handleUpdatePOS(e: React.ChangeEvent<HTMLSelectElement>) {
        setDataModel({
            ...dataModel,
            entries: dataModel.entries.map((entry: Entry_Model) => {
                if (entry.id === id) {
                    return {
                        ...entry,
                        pos: e.target.selectedOptions[0].value
                    };
                } else {
                    return entry;
                }
            })
        });
    }

    function handleDelete() {
        let accepted: boolean = true;

        const entry = getEntry();
        if (!(entry.a === "" && entry.b === "")) {
            // eslint-disable-next-line no-restricted-globals
            accepted = confirm("Are you sure you wish to delete this entry?");
        }

        if (accepted) {
            setDataModel({
                ...dataModel,
                entries: dataModel.entries.filter((entry: Entry_Model) => entry.id !== id)
            })
        } else {
            return;
        }
    }

    function defineError(errorValues: string[], givenValue: string) {
        if (errorValues.includes(givenValue)) {
            return " error";
        } else {
            return "";
        }
    }

    if (editable) {
        return (
            <div className={checkEntry() ? "QuizEntry" : "QuizEntry error"}>
                <p>{getEntry().index + 1}</p>
                <input className={defineError(["", " "], getEntry().a)} onInput={handleUpdateA} value={getEntry().a} placeholder={"foreign term"}/>
                <input className={defineError(["", " "], getEntry().b)} onInput={handleUpdateB} value={getEntry().b} placeholder={"translation"}/>
                <select onChange={handleUpdatePOS} value={getEntry().pos}>
                    {posOptions}
                </select>
                <button id={"DeleteTerm"} onClick={handleDelete} title="Delete term">—</button>
            </div>
    )
    } else {
        return (
            <div className={"QuizEntry view"}>
                <p>{getEntry().index + 1}</p>
                <div id={"QuizEntry_right"}>
                    <div id={"EntryDetails"}>
                        <p id={"entryA"}>{getEntry().a}</p>
                        <p id={"pos"}>{getEntry().pos === "NULL" ? "": getPosName(getEntry().pos)}</p>
                    </div>
                    <p id={"entryB"}>{getEntry().b}</p>

                </div>
            </div>
    )
    }
}