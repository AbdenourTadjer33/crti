import React from "react";
import dayjs from "dayjs";
import * as Card from "@/Components/ui/card";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Project } from "@/types/project";
import { cn } from "@/Utils/utils";
import { Dot, GitMerge } from "lucide-react";

interface ProjectDetailsProps {
    project: Project;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
    const [isVisible, setIsVisible] = React.useState(true);

    // return (
    //     <div className="p-6 bg-white rounded-lg shadow-md">
    //         {/* Header Section */}
    //         <div className="mb-6">
    //             <h1 className="text-3xl font-bold text-gray-800">
    //                 {project.name}
    //             </h1>
    //             <div className="flex items-center justify-between mt-2">
    //                 <span className="text-sm text-gray-500">{`Code: ${project.code}`}</span>
    //                 <span
    //                     className={`text-sm font-semibold px-2 py-1 rounded ${
    //                         project.status === "Nouveau projet"
    //                             ? "bg-green-100 text-green-600"
    //                             : "bg-gray-100 text-gray-600"
    //                     }`}
    //                 >
    //                     {project.status}
    //                 </span>
    //             </div>
    //             <div className="text-sm text-gray-500 mt-1">
    //                 {project.division.name}
    //             </div>
    //         </div>

    //         {/* Overview Section */}
    //         <div className="mb-6">
    //             <h2 className="text-lg font-semibold text-gray-700">
    //                 Nature du projet
    //             </h2>
    //             <p className="text-gray-600">{project.nature}</p>
    //             <div className="mt-4">
    //                 <h3 className="text-sm font-semibold text-gray-700">
    //                     Domaines
    //                 </h3>
    //                 <div className="flex flex-wrap gap-2 mt-2">
    //                     {project.domains.map((domain, index) => (
    //                         <span
    //                             key={index}
    //                             className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded"
    //                         >
    //                             {domain}
    //                         </span>
    //                     ))}
    //                 </div>
    //             </div>
    //         </div>

    //         {/* Timeline Section */}
    //         <div className="mb-6">
    //             <h2 className="text-lg font-semibold text-gray-700">
    //                 Chronologie
    //             </h2>
    //             <div className="text-gray-600">{`Du ${dayjs(
    //                 project.timeline.from
    //             ).format("DD MMM YYYY")} au ${dayjs(project.timeline.to).format(
    //                 "DD MMM YYYY"
    //             )}`}</div>
    //         </div>

    //         {/* Members Section */}
    //         <div className="mb-6">
    //             <h2 className="text-lg font-semibold text-gray-700">
    //                 Membres du projet
    //             </h2>
    //             <div className="mt-4">
    //                 <div className="text-sm text-gray-600 mb-2">
    //                     <span className="font-semibold">Créateur: </span>
    //                     {project.creator.name} ({project.creator.email})
    //                 </div>
    //                 <div className="grid grid-cols-2 gap-4">
    //                     {project.members.map((member) => (
    //                         <div
    //                             key={member.uuid}
    //                             className="text-sm text-gray-600"
    //                         >
    //                             {member.name} ({member.email})
    //                         </div>
    //                     ))}
    //                 </div>
    //             </div>
    //         </div>

    //         {/* Tasks Section */}
    //         <div className="mb-6">
    //             <h2 className="text-lg font-semibold text-gray-700">Tâches</h2>
    //             <div className="space-y-4 mt-4">
    //                 {project.tasks.map((task, index) => (
    //                     <div key={index} className="p-4 border rounded-lg">
    //                         <div className="flex justify-between items-center">
    //                             <h3 className="text-gray-800 font-semibold">
    //                                 {task.name}
    //                             </h3>
    //                             <span
    //                                 className={`text-xs px-2 py-1 rounded ${
    //                                     task.priority === "Haute"
    //                                         ? "bg-red-100 text-red-600"
    //                                         : task.priority === "Moyenne"
    //                                         ? "bg-yellow-100 text-yellow-600"
    //                                         : "bg-green-100 text-green-600"
    //                                 }`}
    //                             >
    //                                 {task.priority}
    //                             </span>
    //                         </div>
    //                         <div className="text-sm text-gray-600 mt-1">
    //                             {`Du ${dayjs(task.timeline.from).format(
    //                                 "DD MMM YYYY"
    //                             )} au ${dayjs(task.timeline.to).format(
    //                                 "DD MMM YYYY"
    //                             )}`}
    //                         </div>
    //                         <div
    //                             className="text-gray-700 mt-2"
    //                             dangerouslySetInnerHTML={{
    //                                 __html: task.description,
    //                             }}
    //                         />
    //                         <div className="mt-2 text-sm text-gray-600">
    //                             <h4 className="font-semibold">
    //                                 Membres assignés:
    //                             </h4>
    //                             <ul className="list-disc pl-5 mt-1">
    //                                 {task.users.map((user) => (
    //                                     <li key={user.uuid}>
    //                                         {user.name} ({user.email})
    //                                     </li>
    //                                 ))}
    //                             </ul>
    //                         </div>
    //                     </div>
    //                 ))}
    //             </div>
    //         </div>

    //         {/* Footer Section */}
    //         <div className="text-sm text-gray-500 mt-6">
    //             <p>{`Créé le: ${dayjs(project.createdAt).format(
    //                 "DD MMM YYYY"
    //             )}`}</p>
    //             <p>{`Mis à jour le: ${dayjs(project.updatedAt).format(
    //                 "DD MMM YYYY"
    //             )}`}</p>
    //         </div>
    //     </div>
    // );

    return (
        <div className="relative">
            <Card.Card
                className={cn(isVisible ? "max-h-[38rem] overflow-hidden" : "")}
            >
                <Card.CardHeader className="sm:p-6 p-4">
                    <Text className="text-sm inline-flex items-center">
                        <span className="font-medium">{project.unit.abbr}</span>
                        <GitMerge className="h-4 w-4 mx-1 text-gray-800" />
                        <span className="font-medium">
                            {project.division.name}
                        </span>
                        <Dot className="h-6 w-6 mx-1 text-gray-800" />
                        <span className="font-medium">{project.code}</span>
                    </Text>
                    <div className="flex items-center justify-between">
                        <div>
                            <Card.CardTitle className="sm:text-2xl text-xl">
                                {project.name}
                            </Card.CardTitle>
                            <Card.CardSubTitle className="sm:text-xl text-lg">
                                {project.nature}
                            </Card.CardSubTitle>
                        </div>
                        <Badge variant="indigo">{project.status}</Badge>
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
                        <Heading level={6}>Members de projet</Heading>
                        <div className="text-sm text-gray-600 mb-2">
                            <span className="font-semibold">Créateur: </span>
                            {project.creator.name} ({project.creator.email})
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {project.members.map((member) => (
                                <div
                                    key={member.uuid}
                                    className="text-sm text-gray-600"
                                >
                                    {member.name} ({member.email})
                                </div>
                            ))}
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
