import React from "react";
import { fr } from "date-fns/locale";
import { formatDistanceToNow } from "date-fns";
import { Link } from "@inertiajs/react";
import { Text } from "@/Components/ui/paragraph";
import { Badge } from "@/Components/ui/badge";
import { Dot, GitMerge } from "lucide-react";
import { Project } from "@/types/project";
import UserAvatar from "@/Components/common/user-hover-avatar";
import { Heading } from "@/Components/ui/heading";
import {  buttonVariants } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const {
        code,
        status,
        name,
        nature,
        unit,
        division,
        members,
        creator,
        createdAt,
    } = project;
    const href = route("project.show", code);

    return (
        <Card className="group sm:p-4 p-3 bg-white rounded-lg border-2 border-gray-200 text-gray-950 transition-all duration-150">
            <div className="flex items-center justify-between">
                <Text className="sm:text-sm text-xs inline-flex items-center">
                    <span className="font-medium">{unit.abbr}</span>
                    <GitMerge className="h-4 w-4 mx-1.5 text-gray-800" />
                    <span className="font-medium">{division.abbr}</span>
                    <Dot className="h-6 w-6 text-gray-800" />
                    <span className="font-medium">{code}</span>
                </Text>

                <Badge className="sm:text-sm text-xs">{status}</Badge>
            </div>

            <div className="mt-2">
                <Heading level={2} className="font-medium md:text-lg text-base">
                    {name}
                </Heading>
                <Text className="text-sm">{nature}</Text>
            </div>

            <div className="flex -space-x-1.5 mt-4">
                {members.map((member) => (
                    <UserAvatar
                        key={member.uuid}
                        user={member}
                        className={
                            creator.uuid === member.uuid
                                ? "*:!border-primary-700/75"
                                : undefined
                        }
                    />
                ))}
            </div>

            <div className="flex items-end justify-between">
                <Text className="inline-flex items-center text-sm">
                    {formatDistanceToNow(createdAt, {
                        addSuffix: true,
                        locale: fr,
                    })}
                </Text>
                <div className="space-x-2">
                    <Link
                        href={href}
                        className={buttonVariants({ variant: "primary" })}
                    >
                        Voir
                    </Link>
                </div>
            </div>
        </Card>
    );
};

export default ProjectCard;
