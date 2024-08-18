import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import ConfirmNewProjectCreation from "@/Features/Project/ConfirmNewProjectCreation";
import {
    ArrowRightCircle,
    ChevronDown,
    GitMerge,
    House,
    Search,
} from "lucide-react";
import { TableWrapper } from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import dayjs from "dayjs";
import { BaseProject, Project } from "@/types/project";
import Avatar from "@/Components/Avatar";
import { Card } from "@/Components/ui/card";

const breadcrumbs = [
    { href: route("app"), label: <House className="w-5 h-5" /> },
    { label: "Projets" },
];

interface ProjectIndexProps {
    userDivisions?: [];
    data: {
        projectInCreation: BaseProject[];
        projects: Project[];
    };
}

const Index: React.FC<ProjectIndexProps> = ({ userDivisions, data }) => {
    const { projectInCreation, projects } = React.useMemo(() => {
        return {
            projectInCreation: data.projectInCreation,
            projects: data.projects,
        };
    }, [data]);

    return (
        <AuthLayout>
            <Head title="Projets" />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} MAX_ITEMS={2} />

                <div className="space-y-2">
                    <Heading level={3} className="font-medium">
                        Projets
                    </Heading>

                    <Text className="text-sm sm:text-base">
                        Découvrez et gérez l'ensemble des projets en cours et
                        terminés. Accédez aux détails de chaque projet, suivez
                        les progrès, et collaborez avec les membres de votre
                        équipe pour atteindre les objectifs fixés. Cette page
                        vous offre une vue d'ensemble claire et structurée de
                        tous les projets associés à votre division ou
                        organisation
                    </Text>
                </div>

                <TableWrapper className="shadow-none p-2 overflow-x-auto snap-mandatory snap-x scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thin">
                    <ul className="flex gap-2">
                        <li className="shrink-0 w-full max-w-xs snap-center">
                            <ConfirmNewProjectCreation
                                onTriggerPressed={() =>
                                    userDivisions ||
                                    router.reload({ only: ["userDivisions"] })
                                }
                                divisions={userDivisions}
                            />
                        </li>

                        {projectInCreation.map((project, idx) => (
                            <li key={idx} className="shrink-0 snap-center">
                                <ProjectInCreationCard project={project} />
                            </li>
                        ))}
                    </ul>
                </TableWrapper>

                {!!projects.length && (
                    <>
                        <div className="flex items-center justify-stretch md:justify-between gap-2">
                            <div className="relative flex-1 lg:max-w-lg ">
                                <Input
                                    className="pl-10 w-full"
                                    placeholder="Filtrer les Projets..."
                                />
                                <Search className="h-5 w-5 absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                            </div>

                            <div className="flex items-center gap-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        className="hidden lg:flex"
                                        asChild
                                    >
                                        <Button
                                            variant="outline"
                                            className="justify-between gap-4"
                                        >
                                            Sort by activity
                                            <ChevronDown className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent></DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <ul className="flex items-center justify-start flex-wrap gap-3">
                            {projects.map((project, idx) => (
                                <li key={idx}>
                                    <ProjectCard project={project} />
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </AuthLayout>
    );
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const { code, status, name, nature, division, members, createdAt } =
        project;

    const [relativeTime, setRelativeTime] = React.useState(
        dayjs(createdAt).fromNow()
    );

    React.useEffect(() => {
        const updateRelativeTime = () => {
            setRelativeTime(dayjs(project.createdAt).fromNow());
        };

        const resourceCreatedAt = dayjs(project.createdAt);

        const interval = setInterval(() => {
            updateRelativeTime();

            const now = dayjs();
            const isWithinOneHour = now.diff(resourceCreatedAt, "hour") < 1;

            if (!isWithinOneHour) {
                clearInterval(interval);
            }
        }, 60000);

        // Initial update
        updateRelativeTime();

        return () => clearInterval(interval);
    }, []);

    const href = route("project.show", code);
    return (
        <Link
            href={href}
            className="bg-white p-4 rounded shadow border hover:border-gray-300 transition-colors duration-100 flex items-center justify-between gap-4"
        >
            <div>
                <div className="space-y-1">
                    <Text className="text-gray-800 text-lg font-medium">
                        {name}
                    </Text>

                    <Text>{nature}</Text>
                </div>

                <div className="mt-2.5 flex -space-x-1.5">
                    {members.map((member) => (
                        <Avatar
                            key={member.uuid}
                            name={member.name}
                            size="sm"
                        />
                    ))}
                </div>
                <Text className="mt-2.5 inline-flex items-center text-sm">
                    Créer {relativeTime}
                    <GitMerge className="shrink-0 mx-1 h-4 w-4 text-gray-700" />
                    <Badge variant="blue">{division.name}</Badge>
                </Text>
            </div>
            <Button
                variant="ghost"
                className="transition hover:text-primary-700 duration-150 ease-in"
            >
                <ArrowRightCircle className="h-6 w-6" />
            </Button>
        </Link>
    );
};

const ProjectInCreationCard: React.FC<{ project: BaseProject }> = ({
    project,
}) => {
    const { code, status, division, createdAt, updatedAt } = project;
    const href = route("project.version.create", code);

    const [relativeTime, setRelativeTime] = React.useState(
        dayjs(project.createdAt).fromNow()
    );

    React.useEffect(() => {
        const updateRelativeTime = () => {
            setRelativeTime(dayjs(project.createdAt).fromNow());
        };

        const resourceCreatedAt = dayjs(project.createdAt);

        const interval = setInterval(() => {
            updateRelativeTime();

            const now = dayjs();
            const isWithinOneHour = now.diff(resourceCreatedAt, "hour") < 1;

            if (!isWithinOneHour) {
                clearInterval(interval);
            }
        }, 60000);

        // Initial update
        updateRelativeTime();

        return () => clearInterval(interval);
    }, []);

    return (
        <Link href={href}>
            <Card className="p-4 space-y-1 transition-all hover:border-primary-700 border-2 hover:bg-gray-50 duration-150">
                <div className="flex items-center justify-between gap-4">
                    <Text className="text-sm">{`Code: ${project.code}`}</Text>

                    <Badge>{project.status}</Badge>
                </div>
                <div className="flex items-center gap-0.5">
                    <GitMerge className="mx-1 h-4 w-4 text-gray-700" />
                    <Badge variant="blue" className="whitespace-nowrap">
                        {project.division.name}
                    </Badge>
                </div>
                <Text>{`Créer ${relativeTime}`}</Text>
            </Card>
        </Link>
    );

    return (
        <Link
            href={href}
            className="bg-white h-full p-4 rounded shadow border hover:border-gray-300 transition-colors duration-100 flex items-center justify-between"
        >
            <div className="space-y-1">
                <Text>#{code}</Text>
                <Text className="inline-flex items-center gap-1.5">
                    Status: <Badge>{status}</Badge>
                </Text>
                <Text className="inline-flex items-center text-sm">
                    Créer {relativeTime}
                    <GitMerge className="mx-1 h-4 w-4 text-gray-700" />
                    <Badge variant="blue">{division.name}</Badge>
                </Text>
            </div>
            <Button
                variant="ghost"
                className="transition hover:text-primary-700 duration-150 ease-in"
            >
                <ArrowRightCircle className="h-6 w-6" />
            </Button>
        </Link>
    );
};

export default Index;
