import React from "react";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { Badge } from "@/Components/ui/badge";
import dayjs from "dayjs";
import * as Card from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Project } from "@/types/project";
import { cn } from "@/Utils/utils";

interface ProjectDetailsProps {
    project: Project;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
    const [isVisible, setIsVisible] = React.useState(false);

    return (
        <div className="relative">
            <Card.Card
                className={cn(isVisible ? "max-h-[38rem] overflow-hidden" : "")}
            >
                <Card.CardHeader className="sm:p-6 p-4">
                    <Card.CardTitle className="sm:text-2xl text-xl">
                        {project.name}
                    </Card.CardTitle>
                    <Card.CardSubTitle className="sm:text-xl text-lg">
                        {project.nature}
                    </Card.CardSubTitle>
                    <div className="flex items-center justify-between">
                        <Text className="text-sm">{`Code: ${project.code}`}</Text>
                        <Badge variant="indigo">{project.status}</Badge>
                    </div>
                    <div>
                        <Text className="text-sm">{project.division.name}</Text>
                    </div>
                </Card.CardHeader>
                <Card.CardContent className="sm:p-6 p-4 pt-0 sm:pt-0 space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                        <Heading level={6}>Domaines</Heading>
                        <div className="flex flex-wrap items-center gap-1 5">
                            {project.domains.map((domain, idx) => (
                                <Badge key={idx} variant="blue">
                                    {domain}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Heading level={6}>Chronologie</Heading>
                        <div className="text-gray-600">
                            {`Du ${dayjs(project.timeline.from).format(
                                "DD MMM YYYY"
                            )} au ${dayjs(project.timeline.to).format(
                                "DD MMM YYYY"
                            )}`}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Heading level={6}>
                            Description succincte du projet
                        </Heading>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: project.description,
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Heading level={6}>Objectifs du projet</Heading>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: project.goals,
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Heading level={6}>
                            Méthodologies pour la mise en œuvre du projet
                        </Heading>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: project.methodology,
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Heading level={6}>Tâches</Heading>

                        <div className="space-y-4">
                            {project.tasks.map((task, idx) => (
                                <Card.Card key={idx}>
                                    <Card.CardHeader className="p-4 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <Card.CardTitle className="text-base">
                                                {task.name}
                                            </Card.CardTitle>
                                            <Badge>{task.priority}</Badge>
                                        </div>
                                        <Card.CardSubTitle className="text-sm text-gray-600 font-normal">
                                            {`Du ${dayjs(
                                                task.timeline.from
                                            ).format("DD MMM YYYY")} au ${dayjs(
                                                task.timeline.to
                                            ).format("DD MMM YYYY")}`}
                                        </Card.CardSubTitle>
                                    </Card.CardHeader>
                                    <Card.CardContent className="p-4 pt-0 space-y-2">
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: task.description,
                                            }}
                                        />

                                        <div className="space-y-2">
                                            <Heading level={6}>
                                                Membres assignés:
                                            </Heading>
                                            <ul className="list-disc pl-5">
                                                {task.users.map((user) => (
                                                    <li key={user.uuid}>
                                                        {user.name} (
                                                        {user.email})
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Card.CardContent>
                                </Card.Card>
                            ))}
                        </div>
                    </div>
                </Card.CardContent>
            </Card.Card>

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
    );
};

export default ProjectDetails;
