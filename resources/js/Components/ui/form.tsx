import React from "react";
import { cn } from "@/Utils/utils";

const FormWrapper = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "bg-white dark:bg-gray-800/30 p-4 border dark:border-gray-700 rounded-lg shadow-lg",
            className
        )}
        {...props}
    />
));

FormWrapper.displayName = "FormWrapper";

export { FormWrapper };
