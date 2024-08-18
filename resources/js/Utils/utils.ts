import React from "react";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

interface Attributes {
    [key: string]: any;
}

/**
 * Utiity function to add attributes recursively to all children. 
 */
function addAttributesToChildren(children: React.ReactNode, attributes: Attributes): React.ReactNode {
    return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            // Recursively add the attributes to all children
            const newChild = React.cloneElement(
                child,
                { ...attributes },
                addAttributesToChildren(child.props.children, attributes)
            );
            return newChild;
        }
        return child;
    });
};



export { cn, addAttributesToChildren }