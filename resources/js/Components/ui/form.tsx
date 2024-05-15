import React from "react";
import { cn } from "@/Utils/utils";

interface FormWrapperProps extends React.FormHTMLAttributes<HTMLFormElement> {
    className?: string;
}

const FormWrapper = React.forwardRef<HTMLFormElement, FormWrapperProps>(
    ({ className, onSubmit, ...props }, ref) => {
        const submit = (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (onSubmit) onSubmit(event);
        };

        return (
            <form
                ref={ref}
                className={cn(
                    "bg-white dark:bg-gray-800/30 p-4 border dark:border-gray-700 rounded-lg shadow-lg",
                    className
                )}
                onSubmit={submit}
                {...props}
            />
        );
    }
);

FormWrapper.displayName = "FormWrapper";

export { FormWrapper };
