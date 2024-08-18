import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/Utils/utils";
// ring-offset-white focus:ring-1 focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500
const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90",
                primary: "text-white bg-primary-600 hover:bg-primary-700 dark:text-gray-50 dark:bg-primary-800 hover:bg-primary-800/90",
                secondary: "bg-gray-100 text-gray-900 hover:bg-gray-100/50 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/50",
                destructive: "bg-red-500 text-gray-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-gray-50 dark:hover:bg-red-900/90",
                outline: "border border-gray-300 bg-white hover:text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:text-gray-50 ",
                ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
                link: "text-primary-900 underline-offset-4 hover:underline dark:text-gray-50 ring-0 focus:ring-0",
                warning: "bg-yellow-400 text-white hover:bg-yellow-500",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

const ButtonGroup = ({ className, ...props }: ButtonGroupProps) => {
    return (
        <div
            className={cn(
                "flex items-center *:rounded-none divide-gray-400 divide-x rounded-md overflow-hidden",
                className
            )}
            {...props}
        />
    );
};

export { Button, buttonVariants, ButtonGroup };
