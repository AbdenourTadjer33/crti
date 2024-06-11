import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/Utils/utils";
import { FaSpinner } from "react-icons/fa";

const spinnerVariants = cva(
    "inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600",
    {
        variants: {
            variant: {
                blue: "fill-blue-600",
                secondary: "fill-gray-600 dark:fill-gray-300",
                red: "fill-red-600",
                primary: "fill-primary-600",
            },
            size: {
                default: "h-5 w-5",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "blue",
            size: "default",
        },
    }
);

export interface SpinnerProps extends React.SVGAttributes<HTMLOrSVGElement>,
    VariantProps<typeof spinnerVariants> {

}

const Spinner = React.forwardRef<
    HTMLButtonElement, SpinnerProps>(
        ({ className, variant, size, ...props }, ref) => {
            return <FaSpinner className={cn(spinnerVariants({ variant, size, className }))} {...props} />
        })

export { Spinner }