import React from 'react';
import * as ContextMenu from '@radix-ui/react-context-menu';
import '../Styles/ContextMenuStyle.css';

export default function ContextMenuDemo({children, content}: { children: any, content: {text: string, action: any}[]}) {

  return (
    <ContextMenu.Root>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
      <ContextMenu.Trigger className="ContextMenuTrigger">{children}</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="ContextMenuContent" alignOffset={5}>
            {content.map((item) =>
                <ContextMenu.Item className="ContextMenuItem" onSelect={item.action} >{item.text}</ContextMenu.Item>
            )}
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
};