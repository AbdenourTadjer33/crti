import React from "react";
import { cn } from "@/Utils/utils";

interface InputErrorProps extends React.HTMLAttributes<HTMLDivElement> {
    message?: string;
}

const InputError: React.FC<InputErrorProps> = ({
    message,
    className,
    ...props
}) => {
    return (
        <div
            className={cn("sm:text-base text-sm text-red-500", className)}
            {...props}
        >
            {message}
        </div>
    );
};

export { InputError };
