import * as React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { MdHome } from "react-icons/md";
import { useEventListener } from "@/Hooks/use-event-listener";
import ConfirmNewProjectCreation from "@/Features/Project/ConfirmNewProjectCreation";
import { ArrowRightCircle } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/Components/ui/toggle-group";
import { TableWraper } from "@/Components/ui/table";
import * as Select from "@/Components/ui/select";

const breadcrumbs = [
    { href: route("app"), label: <MdHome className="w-5 h-5" /> },
    { label: "Projets" },
];

const filterOptions = [
    {
        label: "Tous les projets",
        value: "all",
    },
    {
        label: "En examen",
        value: "review",
    },
    {
        label: "En instance",
        value: "pending",
    },
    {
        label: "Suspendu",
        value: "suspended",
    },
    {
        label: "Rejeté",
        value: "rejected",
    },
    {
        label: "Achevé",
        value: "completed",
    },
];

type ProjectStatus =
    | "creation"
    | "new"
    | "review"
    | "pending"
    | "suspended"
    | "rejected"
    | "completed";

type BaseProject = {
    id: number;
    code: string;
    status: ProjectStatus;
    created_at: string;
    updated_at: string;
};

interface ProjectIndexProps {
    myProjects?: BaseProject[];
    onProjects?: BaseProject[];
    divisionProjects?: BaseProject[];
}

const Index: React.FC<ProjectIndexProps> = ({
    myProjects = [],
    onProjects = [],
    divisionProjects = [],
}) => {
    const [filterOption, setFilterOption] = React.useState<string[]>([]);
    const projectInCreation = React.useMemo(
        () => myProjects?.filter((p) => p.status === "creation") || [],
        [myProjects]
    );
    const userProject = React.useMemo(
        () => myProjects?.filter((p) => p.status !== "creation") || [],
        [myProjects]
    );


    useEventListener("focus", function () {
        router.reload({
            only: ["myProjects"],
        });
    });

    return (
        <AuthLayout>
            <Head title="Projets" />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} MAX_ITEMS={2} />

                <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            Projets
                        </Heading>

                        <Text className={"max-w-7xl"}>
                            Votre modèle de tableau de bord de gestion d'accées.
                        </Text>
                    </div>

                    <ConfirmNewProjectCreation />
                </div>

                <TableWraper className="space-y-4 sm:space-y-6 p-4">
                    <div className="flex justify-between items-center">
                        <ToggleGroup
                            type="multiple"
                            className="justify-start gap-2 -m-2"
                            value={filterOption}
                            onValueChange={(values) => setFilterOption(values)}
                        >
                            {filterOptions.map((option, idx) => (
                                <ToggleGroupItem key={idx} value={option.value}>
                                    {option.label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>

                        <Select.Select>
                            <Select.SelectTrigger className="max-w-sm">
                                <Select.SelectValue placeholder="time interval" />
                            </Select.SelectTrigger>
                            <Select.SelectContent></Select.SelectContent>
                        </Select.Select>
                    </div>

                    <div className="space-y-2">
                        <Heading level={4} className="font-medium">
                            Projet en cours de création
                        </Heading>
                        <ul className="flex items-center gap-4 overflow-auto">
                            {projectInCreation.map(({id, code, status, created_at, updated_at}) => (
                                <li key={id} className="shrink-0">
                                    <div className="w-full max-w-sm p-4 border rounded shadow flex items-center justify-between">
                                        <div className="">
                                            <Text>id: {id}</Text>
                                            <Text>code: {code}</Text>
                                            <Text>
                                                status: {status}
                                            </Text>
                                            <Text>
                                                créer le: {created_at}
                                            </Text>
                                            <Text>
                                                dernier modification:{" "}
                                                {updated_at}
                                            </Text>
                                        </div>

                                        <Link
                                            href={route(
                                                "project.version.create",
                                                code
                                            )}
                                            className="text-gray-700"
                                        >
                                            <ArrowRightCircle className="h-6 w-6" />
                                        </Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <Heading level={4} className="font-medium">
                            Projets créés par vous
                        </Heading>
                        <ul className="flex items-center gap-4 overflow-auto">
                            {userProject.map((project, idx) => (
                                <li key={idx} className="shrink-0">
                                    <div className="w-full max-w-sm p-4 border rounded shadow">
                                        <Text>id: {project.id}</Text>
                                        <Text>code: {project.code}</Text>
                                        <Text>status: {project.status}</Text>
                                        <Text>
                                            créer le: {project.created_at}
                                        </Text>
                                        <Text>
                                            dernier modification:{" "}
                                            {project.updated_at}
                                        </Text>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <Heading level={4} className="font-medium">
                            Projets dont vous êtes membre
                        </Heading>
                        <ul className="flex items-center gap-4 overflow-auto">
                            {onProjects.map((project, idx) => (
                                <li key={idx} className="shrink-0">
                                    <div className="w-full max-w-sm p-4 border rounded shadow">
                                        <Text>id: {project.id}</Text>
                                        <Text>code: {project.code}</Text>
                                        <Text>status: {project.status}</Text>
                                        <Text>
                                            créer le: {project.created_at}
                                        </Text>
                                        <Text>
                                            dernier modification:{" "}
                                            {project.updated_at}
                                        </Text>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <Heading level={4} className="font-medium">
                            Projets de la même division
                        </Heading>
                        <ul className="flex items-center gap-4 overflow-auto">
                            {onProjects.map((project, idx) => (
                                <li key={idx} className="shrink-0">
                                    <div className="w-full max-w-sm p-4 border rounded shadow">
                                        <Text>id: {project.id}</Text>
                                        <Text>code: {project.code}</Text>
                                        <Text>status: {project.status}</Text>
                                        <Text>
                                            créer le: {project.created_at}
                                        </Text>
                                        <Text>
                                            dernier modification:{" "}
                                            {project.updated_at}
                                        </Text>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </TableWraper>
            </div>
        </AuthLayout>
    );
};

export default Index;
