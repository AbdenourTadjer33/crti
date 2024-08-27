import React from "react";
import * as Tooltip from "./tooltip";
import { Info } from "lucide-react";

interface LabelInfoProps {
    children: React.ReactNode;
    className?: string;
}

const LabelInfo: React.FC<LabelInfoProps> = ({ className, children }) => {
    return (
        <Tooltip.TooltipProvider>
            <Tooltip.Tooltip>
                <Tooltip.TooltipTrigger>
                    <Info className="shrink-0 h-4 w-4 mr-1" />
                </Tooltip.TooltipTrigger>
                <Tooltip.TooltipContent className={className}>
                    {children}
                </Tooltip.TooltipContent>
            </Tooltip.Tooltip>
        </Tooltip.TooltipProvider>
    );
};

export { LabelInfo };
