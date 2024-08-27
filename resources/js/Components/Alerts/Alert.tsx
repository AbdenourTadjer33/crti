import { cn } from "@/Utils/utils";
import React from "react";

interface Props extends React.HTMLAttributes<HTMLOrSVGElement> {}

export const SuccessCheckAlert: React.FC<Props> = ({ className, ...props }) => {
    const cssStyles = `
        .path {
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
        }
        .path.circle {
            animation: dash 0.9s ease-in-out;
        }
        .path.line {
            stroke-dashoffset: 1000;
            animation: dash 0.9s 0.35s ease-in-out forwards;
        }
        .path.check {
            stroke-dashoffset: -100;
            animation: dash-check 0.9s 0.35s ease-in-out forwards;
        }

        @keyframes dash {
            0% {
                stroke-dashoffset: 1000;
            }
            100% {
                stroke-dashoffset: 0;
            }
        }
        @keyframes dash-check {
            0% {
                stroke-dashoffset: -100;
            }
            100% {
                stroke-dashoffset: 900;
            }
        }
    `;

    return (
        <svg
            className={cn("w-[100px] block mx-auto", className)}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 130.2 130.2"
            style={{ animation: "dash 0.9s ease-in-out" }}
            {...props}
        >
            <style>{cssStyles}</style>
            <circle
                className="path circle"
                fill="none"
                stroke="#73AF55"
                strokeWidth="6"
                strokeMiterlimit="10"
                cx="65.1"
                cy="65.1"
                r="62.1"
            />
            <polyline
                className="path check"
                fill="none"
                stroke="#73AF55"
                strokeWidth="6"
                strokeLinecap="round"
                strokeMiterlimit="10"
                points="100.2,40.2 51.5,88.8 29.8,67.5 "
            />
        </svg>
    );
};
