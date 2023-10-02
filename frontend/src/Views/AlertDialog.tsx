import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import '../Styles/AlertDialogStyle.css';

export default function AlertDialogDemo({children, onConfirm, description, alert, confirmText}:
                                            {children?: any, onConfirm: any, description: string, alert: string, confirmText: string}) {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
                {children}
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className="AlertDialogOverlay" />
                <AlertDialog.Content className="AlertDialogContent">
                <AlertDialog.Title className="AlertDialogTitle">{alert}</AlertDialog.Title>
                <AlertDialog.Description className="AlertDialogDescription">
                    {description}
                </AlertDialog.Description>
                <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
                    <AlertDialog.Cancel asChild>
                        <button className="Button mauve">Cancel</button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                        <button className="Button red" onClick={onConfirm}>{confirmText}</button>
                    </AlertDialog.Action>
                </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}