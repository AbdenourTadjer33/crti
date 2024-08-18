import React from "react";
import { cn } from "@/Utils/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    size?: "sm" | "base" | "lg" | "xl";
}

const Avatar: React.FC<AvatarProps> = ({ name, size = "base", className }) => {
    const initials = [];

    for (let i = 0; i < Math.min(name.length, 2); i++) {
        initials.push(name[i].charAt(0));
    }

    const currentSize = {
        sm: "w-8 h-8",
        base: "w-10 h-10",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    }[size];

    const currentTextSize = {
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
    }[size];

    return (
        <div
            className={cn(
                "inline-flex items-center justify-center overflow-hidden bg-gray-100 rounded-full dark:bg-gray-500 px-3 py-2 border-2 dark:border-gray-600 text-gray-500 hover:text-gray-700 focus:outline-none transition ease-in-out duration-150",
                currentSize,
                className
            )}
        >
            <span
                className={`font-semibold text-gray-600 dark:text-gray-300 select-none cursor-pointer ${currentTextSize}`}
            >
                {initials.join("").toUpperCase()}
            </span>
        </div>
    );
};

export default Avatar;
