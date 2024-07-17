import React from "react";
import { OnValueChange } from "../../core/field";
import { cn } from "@/Utils/utils";

interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    value?: string;
    onValueChange?: OnValueChange;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, value, onValueChange, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none  focus:ring-primary-600 focus:border-primary-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:placeholder:text-gray-400 dark:focus:ring-primary-500",
                    className
                )}
                ref={ref}
                value={value}
                onChange={(e) => onValueChange && onValueChange(e.target.value)}
                {...props}
            />
        );
    }
);

export { type TextareaProps, Textarea };
