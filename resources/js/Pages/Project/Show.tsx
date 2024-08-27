import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import ProjectDetails from "@/Features/Project/ProjectDetails";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { Project } from "@/types/project";
import { Head } from "@inertiajs/react";
import { House } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton";

const ConfirmNewVersionCreation = React.lazy(
    () => import("@/Features/Project/ConfirmNewVersionCreation")
);
const VersionInCreation = React.lazy(
    () => import("@/Features/Project/VersionInCreation")
);

interface ProjectShowProps {
    project: Project;
    canCreateNewVersion: boolean;
    versionInCreation?: { id: number; reason: string; createdAt: string };
}

const Show: React.FC<ProjectShowProps> = ({
    project,
    canCreateNewVersion,
    versionInCreation,
}) => {
    const breadcrumbs = React.useMemo(
        () => [
            { href: route("app"), label: <House className="h-5 w-5" /> },
            { href: route("project.index"), label: "Projets" },
            { label: project.name },
        ],
        []
    );

    const displayAddNewVersionBtn = React.useMemo<boolean>(() => {
        return !versionInCreation && canCreateNewVersion;
    }, [versionInCreation]);

    const [confirmModal, setConfirmModal] = React.useState(false);

    return (
        <>
            <Head title={project.name} />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} />

                <div className="flex md:flex-row flex-col md:items-center items-stretch justify-between gap-4">
                    <div className="space-y-2">
                        <Heading level={3}>{project.name}</Heading>

                        <Text className="sm:text-base text-sm">
                            Consultez les détails complets de projet{" "}
                            <span className="font-medium">{project.name}</span>.
                        </Text>
                    </div>

                    {displayAddNewVersionBtn && (
                        <Button onClick={() => setConfirmModal(true)}>
                            Proposer une nouvelle version
                        </Button>
                    )}

                    {confirmModal && (
                        <React.Suspense>
                            <ConfirmNewVersionCreation
                                open={confirmModal}
                                setOpen={setConfirmModal}
                            />
                        </React.Suspense>
                    )}
                </div>

                {versionInCreation && (
                    <React.Suspense
                        fallback={
                            <Skeleton className="bg-gray-200 h-24 w-full" />
                        }
                    >
                        <VersionInCreation version={versionInCreation} />
                    </React.Suspense>
                )}

                <ProjectDetails project={project} />
            </div>
        </>
    );
};

// @ts-ignore
Show.layout = (page) => {
    return <AuthLayout children={page} />;
};

export default Show;
