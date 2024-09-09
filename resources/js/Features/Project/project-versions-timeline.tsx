import { Text } from "@/Components/ui/paragraph";
import { Project } from "@/types/project";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";
import ProjectDetails from "./ProjectDetails";
import { Button } from "@/Components/ui/button";
import { cn } from "@/Utils/utils";

interface Props {
    versions: {
        name: string;
        reason: string;
        creator: Project["creator"];
        isSuggested: boolean;
        isFirstVersion: boolean;
        createdAt: string;
    }[];
    project: any;
}

const ProjectVersionsTimeline: React.FC<Props> = ({ versions, project }) => {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
        <ol className="relative border-s border-gray-200 dark:border-gray-700 space-y-10">
            {versions.map((version, idx) => (
                <li key={idx} className="ms-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>

                    <Text className="mb-1 text-sm">
                        {version.isFirstVersion
                            ? "Créé par"
                            : version.isSuggested
                            ? "Suggéré par"
                            : "Mis à jour par"}{" "}
                        <strong>{version.creator.name}</strong>{" "}
                        <time className="text-sm font-normal leading-none text-gray- dark:text-gray-500">
                            {formatDistanceToNow(version.createdAt, {
                                addSuffix: true,
                                locale: fr,
                            })}
                        </time>
                    </Text>

                    <div className="space-y-1 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {version.name}
                        </h3>

                        {version.reason && (
                            <blockquote className="text-base italic font-normal text-gray-500 dark:text-gray-400">
                                "{version.reason}"
                            </blockquote>
                        )}
                    </div>

                    <div className="relative">
                        <ProjectDetails
                            project={project}
                            className={cn(
                                isVisible ? "max-h-96 overflow-hidden" : ""
                            )}
                        />
                        <div className="inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-white pt-32 pb-8 pointer-events-none dark:from-slate-900 absolute">
                            <Button
                                type="button"
                                className="relative pointer-events-auto"
                                onClick={() => setIsVisible(!isVisible)}
                            >
                                Afficher tous le projet
                            </Button>
                        </div>
                    </div>
                </li>
            ))}
        </ol>
    );
};

export default ProjectVersionsTimeline;
