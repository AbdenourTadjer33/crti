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
import ProjectBadge from "@/Components/common/project-badge";

interface ProjectDetailsProps {
    project: Project;
    className?: string;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
    project,
    className,
}) => {
    return (
        <Card.Card className={className}>
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
                <div className="flex md:flex-row flex-col md:items-center md:justify-between md:gap-4 gap-2">
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

                    <ProjectBadge
                        status={project._status}
                        size="sm"
                        className="self-end whitespace-nowrap"
                    >
                        {project.status}
                    </ProjectBadge>
                </div>
            </Card.CardHeader>
            <Card.CardContent className="sm:p-6 p-4 pt-0 sm:pt-0 space-y-4 sm:space-y-6">
                <div className="space-y-2">
                    <Heading level={6}>Domaines</Heading>

                    <div className="flex flex-wrap items-center gap-1">
                        {project.domains.map((domain, idx) => (
                            <Badge key={idx} variant="indigo" size="xs">
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
                        )} au ${format(project.timeline.to, "dd MMMM yyy")}`}
                    </div>
                </div>

                <div className="flex md:flex-row flex-col md:items-start gap-4">
                    <Card.Card className="flex-1 md:max-w-md w-full">
                        <Card.CardHeader>
                            <Card.CardTitle className="sm:text-2xl text-xl">
                                Membres du l'équipe de projet
                            </Card.CardTitle>
                            <Card.CardDescription>
                                Les membres du projet.
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
                                                    project.creator.uuid && (
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
                    <Heading level={6}>Description succincte du projet</Heading>
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
                        Matériel existant pouvant être utilisé dans l'exécution
                        du projet.
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
                            Matière première, composants et petits équipements à
                            acquérir par le partenaire socio-économique
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
                        <Heading level={6}>Produit livrable du projet</Heading>
                        <ul className="list-disc list-inside">
                            {project.deliverables.map((deliverable, idx) => (
                                <li key={idx}>{deliverable}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="inline-flex items-center gap-2">
                        <Heading level={6} className="font-medium">
                            Montant Globale estimé pour la réalisation du projet
                        </Heading>
                        <span className="text-gray-800 text-2xl">
                            {currencyFormat(project.estimated_amount)}
                        </span>
                    </div>
                </Card.Card>
            </Card.CardContent>
        </Card.Card>
    );
};

export default ProjectDetails;
