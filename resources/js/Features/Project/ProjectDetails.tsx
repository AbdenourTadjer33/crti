import React from "react";
import { Project } from "@/types/project";
import * as Card from "@/Components/ui/card";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { Badge } from "@/Components/ui/badge";
import { Dot, GitMerge } from "lucide-react";
import { format } from "date-fns";
import { currencyFormat } from "@/Utils/helper";
import * as Tooltip from "@/Components/ui/tooltip";
import { Editor } from "@/Components/Editor";
import { TaskTable } from "./TaskTable";
import UserAvatar from "@/Components/common/user-hover-avatar";
import { ResourceTable } from "./ResourceTable";

interface ProjectDetailsProps {
    project: Project;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
    return (
        <div className="relative">
            <Card.Card>
                <Card.CardHeader className="sm:p-6 p-4">
                    <Text className="text-sm inline-flex items-center">
                        <span className="font-medium">{project.unit.abbr}</span>
                        <GitMerge className="h-4 w-4 mx-1.5 text-gray-800" />
                        <span className="font-medium">
                            <span className="font-medium">
                                <span className="block sm:hidden">
                                    {project.division.abbr}
                                </span>
                                <span className="hidden sm:block">
                                    {project.division.name}
                                </span>
                            </span>
                        </span>
                        <Dot className="h-6 w-6 text-gray-800" />
                        <span className="font-medium">{project.code}</span>
                    </Text>
                    <div className="flex md:flex-row flex-col md:items-center md:justify-between items-end md:gap-4 gap-2">
                        <div>
                            <Tooltip.TooltipProvider>
                                <Tooltip.Tooltip>
                                    <Tooltip.TooltipTrigger asChild>
                                        <Card.CardTitle className="sm:text-2xl text-xl">
                                            {project.name}
                                        </Card.CardTitle>
                                    </Tooltip.TooltipTrigger>
                                    <Tooltip.TooltipContent>
                                        Titre de projet
                                    </Tooltip.TooltipContent>
                                </Tooltip.Tooltip>
                            </Tooltip.TooltipProvider>

                            <Tooltip.TooltipProvider>
                                <Tooltip.Tooltip>
                                    <Tooltip.TooltipTrigger asChild>
                                        <Card.CardSubTitle className="sm:text-xl text-lg">
                                            {project.nature}
                                        </Card.CardSubTitle>
                                    </Tooltip.TooltipTrigger>
                                    <Tooltip.TooltipContent>
                                        Nature de projet
                                    </Tooltip.TooltipContent>
                                </Tooltip.Tooltip>
                            </Tooltip.TooltipProvider>
                        </div>

                        <Badge
                            variant="indigo"
                            size="sm"
                            className=" whitespace-nowrap"
                        >
                            {project.status}
                        </Badge>
                    </div>
                </Card.CardHeader>
                <Card.CardContent className="sm:p-6 p-4 pt-0 sm:pt-0 space-y-4 sm:space-y-6">
                    <div className="space-y-2">
                        <Heading level={6}>Domaines</Heading>

                        <div className="flex flex-wrap items-center gap-1">
                            {project.domains.map((domain, idx) => (
                                <Badge key={idx} variant="blue" size="sm">
                                    {domain}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Heading level={6}>Chronologie</Heading>

                        <div className="text-gray-600">
                            {`Du ${format(
                                project.timeline.from,
                                "dd MMMM yyy"
                            )} au ${format(
                                project.timeline.to,
                                "dd MMMM yyy"
                            )}`}
                        </div>
                    </div>

                    <div className="flex md:flex-row flex-col md:items-start gap-4">
                        <Card.Card className="flex-1 md:max-w-md w-full">
                            <Card.CardHeader>
                                <Card.CardTitle className="sm:text-2xl text-xl">
                                    Membres de l'équipe de projet
                                </Card.CardTitle>
                                <Card.CardDescription>
                                    Les membres de projet.
                                </Card.CardDescription>
                            </Card.CardHeader>
                            <Card.CardContent className="grid gap-6">
                                {project.members.map((member) => (
                                    <div
                                        key={member.uuid}
                                        className="flex items-center justify-between space-x-4"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <UserAvatar user={member} />
                                            <div>
                                                <p className="text-sm font-medium leading-none">
                                                    {member.name}{" "}
                                                    {member.uuid ===
                                                        project.creator
                                                            .uuid && (
                                                        <span className="font-semibold">
                                                            (Porteur de projet)
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {member.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Card.CardContent>
                        </Card.Card>

                        {project.partner && (
                            <Card.Card className="flex-1 md:max-w-md w-full">
                                <Card.CardHeader>
                                    <Card.CardTitle className="sm:text-2xl text-xl">
                                        Partenaire socio-économique
                                    </Card.CardTitle>
                                    <Card.CardDescription>
                                        Information sur le partenaire
                                        socio-économique
                                    </Card.CardDescription>
                                </Card.CardHeader>
                                <Card.CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <Text>
                                            Organisation:{" "}
                                            <span className="text-gray-800 font-medium">
                                                {project.partner.organisation}
                                            </span>
                                        </Text>
                                        <Text>
                                            Secteur:{" "}
                                            <span className="text-gray-800 font-medium">
                                                {project.partner.sector}
                                            </span>
                                        </Text>
                                    </div>
                                    <div className="space-y-1">
                                        <Text>
                                            Nom du contact:{" "}
                                            <span className="text-gray-800 font-medium">
                                                {project.partner.contact_name}
                                            </span>
                                        </Text>
                                        <Text>
                                            Post du contact:{" "}
                                            <span className="text-gray-800 font-medium">
                                                {project.partner.contact_post}
                                            </span>
                                        </Text>
                                        <Text>
                                            N° téléphone:{" "}
                                            <span className="text-gray-800 font-medium">
                                                {project.partner.contact_phone}
                                            </span>
                                        </Text>
                                        <Text>
                                            Adresse e-mail:{" "}
                                            <span className="text-gray-800 font-medium">
                                                {project.partner.contact_email}
                                            </span>
                                        </Text>
                                    </div>
                                </Card.CardContent>
                            </Card.Card>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Heading level={6}>
                            Description succincte du projet
                        </Heading>
                        <Editor
                            autofocus={false}
                            editable={false}
                            content={project.description}
                            classNames={{ content: "resize-none" }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Heading level={6}>Objectifs du projet</Heading>
                        <Editor
                            autofocus={false}
                            content={project.goals}
                            editable={false}
                            classNames={{ content: "resize-none" }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Heading level={6}>
                            Méthodologies pour la mise en œuvre du projet
                        </Heading>
                        <Editor
                            autofocus={false}
                            content={project.methodology}
                            editable={false}
                            classNames={{ content: "resize-none" }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Heading level={6}>Tâches</Heading>
                        <TaskTable tasks={project.tasks} />
                    </div>

                    <div className="space-y-2">
                        <Heading level={6}>
                            Matériel existant pouvant être utilisé dans
                            l'exécution du projet.
                        </Heading>

                        <pre>
                            {/* {JSON.stringify(project.existingResources, null, 2)} */}
                        </pre>
                    </div>

                    <div className="space-y-2">
                        <Heading level={6}>
                            Matière première, composants et petits équipements à
                            acquérir par le CRTI
                        </Heading>

                        <ResourceTable
                            resources={project.requestedResources.filter(
                                (r) => r.by_crti
                            )}
                        />
                    </div>

                    {project.partner && (
                        <div className="space-y-2">
                            <Heading level={6}>
                                Matière première, composants et petits
                                équipements à acquérir par le partenaire
                                socio-économique
                            </Heading>

                            <ResourceTable
                                resources={project.requestedResources.filter(
                                    (r) => !r.by_crti
                                )}
                            />
                        </div>
                    )}

                    <Card.Card className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Heading level={6}>
                                Produit livrable du projet
                            </Heading>
                            <ul className="list-disc list-inside">
                                {project.deliverables.map(
                                    (deliverable, idx) => (
                                        <li key={idx}>{deliverable}</li>
                                    )
                                )}
                            </ul>
                        </div>
                        <div className="inline-flex items-center gap-2">
                            <Heading level={6} className="font-medium">
                                Montant Globale estimé pour la réalisation du
                                projet
                            </Heading>
                            <span className="text-gray-800 text-2xl">
                                {currencyFormat(project.estimated_amount)}
                            </span>
                        </div>
                    </Card.Card>
                </Card.CardContent>
            </Card.Card>

            {/* <div className="inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-white pt-32 pb-8 pointer-events-none dark:from-slate-900 absolute">
                <Button
                    type="button"
                    className="relative pointer-events-auto"
                    onClick={() => setIsVisible(!isVisible)}
                >
                    Afficher tous le projet
                </Button>
            </div> */}
        </div>
    );
};

export default ProjectDetails;

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
