import React from 'react';
import * as RadixAvatar from '@radix-ui/react-avatar';
import '../Styles/AvatarStyle.css';

export default function Avatar({id, img="", fallback, alt}:
                                {id: string, img?: string, fallback: string, alt: string}) {
    return (
        <RadixAvatar.Root id={id} className="AvatarRoot">
            <RadixAvatar.Image
                className="AvatarImage"
                src={img}
                alt={alt}
            />
            <RadixAvatar.Fallback className="AvatarFallback">
                {fallback}
            </RadixAvatar.Fallback>
        </RadixAvatar.Root>
    )
}