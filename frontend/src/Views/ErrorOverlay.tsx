import {LoadingOverlayArgs} from "../Models/Arguments";
import React from "react";
import '../Styles/ErrorOverlayStyle.css';

export default function ErrorOverlay({active, message = "A critical error has occurred" }: LoadingOverlayArgs) {
    return (
        <div className={"ErrorOverlay " + active.toString()}>

            <div className={"MessageBox"}>
                <div>Error icon</div>

                <div id={"ErrorText"}>
                    <p>{message}</p>
                    <p>Try refreshing the page</p>
                </div>
            </div>

        </div>
    );
}