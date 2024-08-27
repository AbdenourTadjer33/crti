import { cn } from "@/Utils/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva("font-medium rounded px-2.5 py-0.5", {
    variants: {
        variant: {
            blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            dark: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
            red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
            purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
        },
        size: {
            default: "text-xs",
            sm: "text-sm",
        },
    },
    defaultVariants: {
        variant: "dark",
        size: "default",
    },
});

interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
    return (
        <span
            className={cn(badgeVariants({ variant, size }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
