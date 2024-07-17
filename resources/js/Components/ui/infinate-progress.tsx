import React from "react";
import { cn } from "@/Utils/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {}

const Progress: React.FC<ProgressProps> = ({ className }) => (
    <div
        className={cn(
            "w-full h-full animate-infinite-progress origin-left",
            className
        )}
    />
);

export { Progress };
