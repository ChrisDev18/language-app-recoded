import {LoadingOverlayArgs} from "../Models/Arguments";
import React from "react";
import '../Styles/LoadingOverlayStyle.css';

export default function LoadingOverlay({active, message = "Loading" }: LoadingOverlayArgs) {
    return (
        <div className={"LoadOverlay " + active.toString()}>

            <div className={"MessageBox"}>
                <div className={"loading-spinner"}></div>

                <div id={"LoadingText"}>
                    <p>{message}</p>
                    <p>Please wait</p>
                </div>
            </div>

        </div>
    );
}