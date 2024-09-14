import { cn } from "@/Utils/utils";
import React from "react";
import ReadMore, { ReadMoreProps } from "./read-more";

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {}

interface ColumnProps extends React.HTMLAttributes<HTMLDivElement> {}

interface ColumnTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

interface CardDescriptionProps extends ReadMoreProps {}

const KanbanLayout: React.FC<LayoutProps> = ({ className, ...props }) => (
    <div
        className={cn(
            "flex justify-start items-start px-4 space-x-2.5",
            className
        )}
        {...props}
    />
);

const KanbanColumn: React.FC<ColumnProps> = ({ className, ...props }) => (
    <div className={cn("min-w-[28rem]", className)} {...props} />
);

const KanbanColumnTitle: React.FC<ColumnTitleProps> = ({
    className,
    ...props
}) => (
    <h5
        className={cn("text-base font-medium text-gray-800", className)}
        {...props}
    />
);

const KanbanCard: React.FC<CardProps> = ({ className, ...props }) => (
    <div
        className={cn("bg-white rounded-lg shadow-md p-4", className)}
        {...props}
    />
);

const KanbanCardTitle: React.FC<CardTitleProps> = ({ className, ...props }) => (
    <h2
        className={cn(
            "md:text-lg text-base font-medium text-gray-800",
            className
        )}
        {...props}
    />
);

const KanbanCardDescription: React.FC<CardDescriptionProps> = ({
    readLessText = "Lire moins",
    readMoreText = "Lire plus",
    charLimit = 125,
    ...props
}) => (
    <ReadMore
        readMoreText={readMoreText}
        readLessText={readLessText}
        charLimit={charLimit}
        {...props}
    />
);

export {
    KanbanLayout,
    KanbanColumn,
    KanbanColumnTitle,
    KanbanCard,
    KanbanCardTitle,
    KanbanCardDescription,
};
