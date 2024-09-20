import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import WorkspaceLayout from "@/Layouts/workspace-layout";
import { Head } from "@inertiajs/react";
import Breadcrumb from "@/Components/common/breadcrumb";
import { House } from "lucide-react";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import * as Card from "@/Components/ui/card";
import ProjectBadge from "@/Components/common/project-badge";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";
import UserAvatar from "@/Components/common/user-hover-avatar";

const Project: React.FC<any> = ({ project, metrics }) => {
    const breadcrumbs = React.useMemo(
        () => [
            { href: route("app"), label: <House className="h-5 w-5" /> },
            { href: route("workspace.index"), label: "Espace de travail" },
            { label: project.name },
        ],
        []
    );

    return (
        <div className="space-y-4">
            <Head title={project.name} />
            <Breadcrumb items={breadcrumbs} />

            <Heading level={3} className="font-medium">
                {project.name}
            </Heading>

            <Card.Card>
                <Card.CardHeader className="flex flex-row items-center justify-between">
                    <Card.CardTitle>
                        Informations générales sur le projet
                    </Card.CardTitle>
                    <ProjectBadge status={project._status}>
                        {project.status}
                    </ProjectBadge>
                </Card.CardHeader>
                <Card.CardContent className="flex 2xl:flex-row flex-col justify-between gap-4">
                    <div className="flex flex-col gap-2.5">
                        <p>
                            Nature: <strong>{project.nature}</strong>
                        </p>

                        <p className="inline-flex items-center gap-2">
                            Domaines:{" "}
                            {project.domains.map((domain, idx) => (
                                <Badge key={idx} variant="indigo" size="sm">
                                    {domain}
                                </Badge>
                            ))}
                        </p>

                        <p>
                            Chronologie:{" "}
                            <strong>
                                {`Du ${format(
                                    project.timeline.from,
                                    "dd MMMM yyy"
                                )} au ${format(
                                    project.timeline.to,
                                    "dd MMMM yyy"
                                )}`}
                            </strong>
                        </p>

                        <p className="mt-auto">
                            Créer le{" "}
                            <strong>
                                {format(project.createdAt, "dd MMMM yyy")}
                            </strong>
                        </p>
                    </div>

                    <div className="flex lg:flex-row flex-col items-start gap-4">
                        <Card.Card>
                            <Card.CardHeader>
                                <Card.CardTitle className="sm:text-2xl text-xl">
                                    Membres de l'équipe du projet
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
                </Card.CardContent>
            </Card.Card>

            <div className="p-4 bg-white shadow-lg rounded-lg">
                <h2 className="text-xl font-semibold mb-4">
                    Métriques du projet
                </h2>
                <div className="grid grid-cols-4 gap-4">
                    {/* Task Completion */}
                    <div className="p-4 border rounded-lg text-center">
                        <h3 className="text-lg font-bold">
                            Achèvement des tâches
                        </h3>
                        <p className="text-3xl text-green-500">
                            {metrics.tasks.taskCompletionRate}%
                        </p>
                        <p className="text-sm">
                            Complété {metrics.tasks.doneTasks} /{" "}
                            {metrics.tasks.totalTasks}
                        </p>
                    </div>

                    {/* Timeline Progress */}
                    <div className="p-4 border rounded-lg text-center">
                        <h3 className="text-lg font-bold">
                            Chronologie du projet
                        </h3>
                        <p className="text-3xl text-blue-500">
                            {metrics.project.completionPercentage}%
                        </p>
                        <p className="text-sm">Progression temporelle</p>
                    </div>

                    {/* Pending Tasks */}
                    <div className="p-4 border rounded-lg text-center">
                        <h3 className="text-lg font-bold">Tâches en attente</h3>
                        <p className="text-3xl text-yellow-500">
                            {metrics.tasks.progressTasks}
                        </p>
                        <p className="text-sm">Tâches en cours</p>
                    </div>

                    {/* Team Contributions */}
                    <div className="p-4 border rounded-lg text-center">
                        <h3 className="text-lg font-bold">
                            Team Contributions
                        </h3>
                        <ul className="text-sm">
                            {/* {metrics.teamContributions.map((member) => (
                                <li key={member.member}>
                                    {member.member}: {member.tasksCompleted}{" "}
                                    tasks
                                </li>
                            ))} */}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// @ts-ignore
Project.layout = (page) => (
    <AuthLayout>
        <WorkspaceLayout children={page} />
    </AuthLayout>
);

export default Project;
