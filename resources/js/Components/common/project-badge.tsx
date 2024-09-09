import React from "react";
import { Badge, badgeVariants } from "../ui/badge";
import { Project } from "@/types/project";
import { VariantProps } from "class-variance-authority";

interface ProjectBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: Project["_status"];
    size?: VariantProps<typeof badgeVariants>["size"];
}

const variants: Record<
    Project["_status"],
    VariantProps<typeof badgeVariants>["variant"]
> = {
    creation: "dark",
    new: "blue",
    review: "yellow",
    pending: "purple",
    suspended: "orange",
    rejected: "red",
    completed: "green",
};

const ProjectBadge: React.FC<ProjectBadgeProps> = ({
    status,
    className,
    ...props
}) => {
    return (
        <Badge variant={variants[status]} className={className} {...props} />
    );
};

export default ProjectBadge;
