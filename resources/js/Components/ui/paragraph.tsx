import { cn } from "@/Utils/utils";
import React from "react";

const Text = React.forwardRef<
    HTMLInputElement,
    React.HTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn(
            "text-base text-gray-500 dark:text-gray-50 text-pretty",
            className
        )}
        {...props}
    />
));

export { Text };
