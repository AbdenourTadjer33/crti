import { cn } from "@/Utils/utils";
import { OnValueChange } from "../../core/field";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value?: string;
    onValueChange?: OnValueChange;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, onValueChange, value, ...props }, ref) => (
        <input
            ref={ref}
            type={type}
            className={cn(
                "flex h-10 w-full rounded-md border border-gray-300 bg-white text-gray-950 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:outline-none focus:ring-primary-600 focus:border-primary-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:dark:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder:text-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500",
                className
            )}
            value={value}
            onChange={(e) => onValueChange && onValueChange(e.target.value)}
            {...props}
        />
    )
);

export {
    type InputProps,
    Input
}