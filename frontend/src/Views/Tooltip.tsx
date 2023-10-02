import React from 'react';
// @ts-ignore
import * as RadixTooltip from '@radix-ui/react-tooltip';
import '../Styles/TooltipStyle.css';

export default function Tooltip({children, text, delayDuration=200, side=undefined}:
                                        {children?: any, text: string, delayDuration?: number, side?: any}) {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration} skipDelayDuration={0} disableHoverableContent={true}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
            {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content className="TooltipContent" sideOffset={5} side={side}>
              {text}
            <RadixTooltip.Arrow className="TooltipArrow" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}