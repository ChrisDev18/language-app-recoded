import * as React from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import '../Styles/ToastStyle.css';
import {ToastArgs} from "../Models/Arguments";

export default function Toast({properties, setProperties}: ToastArgs) {
    const timerRef = React.useRef(0);

    React.useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    return (
        <RadixToast.Provider swipeDirection="right">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

            {/*<button*/}
            {/*    className="Button large violet"*/}
            {/*    onClick={() => {*/}
            {/*        setOpen(false);*/}
            {/*        window.clearTimeout(timerRef.current);*/}
            {/*        timerRef.current = window.setTimeout(() => {*/}
            {/*            setOpen(true);*/}
            {/*        }, 100);*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Open toast*/}
            {/*</button>*/}

            <RadixToast.Root className={"ToastRoot " + properties.type}
                             open={properties.open}
                             onOpenChange={(new_open) => {
                                 setProperties({
                                     ...properties,
                                     open: new_open
                                 });
                             }}
                             duration={4000}>
                <span className="material-symbols-outlined Icon">{properties.type === "error" ? "error" : "done"}</span>
                <div id={"TextArea"}>
                    <RadixToast.Title className="ToastTitle">{properties.title}</RadixToast.Title>
                    <RadixToast.Description className="ToastDescription">{properties.description}</RadixToast.Description>
                </div>
                <RadixToast.Action className="ToastAction" asChild altText="Dismiss alert">
                    <button className="Button">Okay</button>
                </RadixToast.Action>
            </RadixToast.Root>
            <RadixToast.Viewport className="ToastViewport" />
        </RadixToast.Provider>
    );
};