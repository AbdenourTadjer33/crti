import React from "react";
import { Head, router } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { House } from "lucide-react";
import { TableWrapper } from "@/Components/ui/table";
import { BaseProject, Project } from "@/types/project";
import { Skeleton } from "@/Components/ui/skeleton";

const ConfirmNewProjectCreation = React.lazy(
    () => import("@/Features/Project/ConfirmNewProjectCreation")
);
const ProjectInCreationCard = React.lazy(
    () => import("@/Features/Project/ProjectInCreationCard")
);

const DataView = React.lazy(() => import("@/Features/Project/data-view"));

const breadcrumbs = [
    { href: route("app"), label: <House className="h-5 w-5" /> },
    { label: "Projets" },
];

interface ProjectIndexProps {
    userDivisions?: [];
    projectsInCreation: BaseProject[];
    projects: Project[];
    canCreateProjects: boolean;
}

const Index: React.FC<ProjectIndexProps> = ({
    projects,
    projectsInCreation,
    userDivisions,
    canCreateProjects,
}) => {
    const displayCreationProjectSection = React.useMemo(
        () => projectsInCreation?.length || canCreateProjects,
        [projectsInCreation, canCreateProjects]
    );

    const displayMainProjectSection = React.useMemo(
        () => !!projects.length,
        []
    );

    return (
        <div className="space-y-4">
            <Head title="Projets" />
            <Breadcrumb items={breadcrumbs} MAX_ITEMS={2} />

            <div className="space-y-2">
                <Heading level={3} className="font-medium">
                    Projets
                </Heading>

                <Text className="text-sm sm:text-base">
                    Découvrez l'ensemble des projets en cours et terminés.
                    Accédez aux détails de chaque projet, suivez les progrès, et
                    collaborez avec les membres de votre équipe pour atteindre
                    les objectifs fixés. Cette page vous offre une vue
                    d'ensemble claire et structurée de tous les projets associés
                    à votre division ou organisation
                </Text>
            </div>

            {displayCreationProjectSection && (
                <TableWrapper className="shadow-none p-2 overflow-x-auto snap-mandatory snap-x scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thin">
                    <ul className="flex gap-2 min-h-24">
                        {canCreateProjects && (
                            <li className="shrink-0 w-full max-w-xs snap-center">
                                <React.Suspense
                                    fallback={
                                        <Skeleton className="h-full w-full" />
                                    }
                                >
                                    <ConfirmNewProjectCreation
                                        onTriggerPressed={() =>
                                            userDivisions ||
                                            router.reload({
                                                only: ["userDivisions"],
                                            })
                                        }
                                        divisions={userDivisions}
                                    />
                                </React.Suspense>
                            </li>
                        )}

                        {projectsInCreation?.map((project, idx) => (
                            <li
                                key={idx}
                                className="shrink-0 block h-full w-full max-w-sm snap-center"
                            >
                                <React.Suspense
                                    fallback={
                                        <Skeleton className="flex w-full h-24" />
                                    }
                                >
                                    <ProjectInCreationCard project={project} />
                                </React.Suspense>
                            </li>
                        ))}
                    </ul>
                </TableWrapper>
            )}

            {displayMainProjectSection && (
                <React.Suspense
                    fallback={
                        <>
                            <div className="h-10 flex justify-between *:!bg-gray-200">
                                <Skeleton className="w-full max-w-lg" />
                                <Skeleton className="w-full max-w-xs" />
                            </div>
                            <div className="grid grid-cols-3 gap-4 *:!bg-gray-200">
                                <Skeleton className="w-full h-28" />
                                <Skeleton className="w-full h-28" />
                                <Skeleton className="w-full h-28" />
                                <Skeleton className="w-full h-28" />
                                <Skeleton className="w-full h-28" />
                                <Skeleton className="w-full h-28" />
                                <Skeleton className="w-full h-28" />
                                <Skeleton className="w-full h-28" />
                            </div>
                        </>
                    }
                >
                    <DataView projects={projects} />
                </React.Suspense>
            )}
        </div>
    );
};

// @ts-ignore
Index.layout = (page) =>  <AuthLayout children={page} />

export default Index;
