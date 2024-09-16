import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import ProjectDetails from "@/Features/Project/ProjectDetails";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { Project } from "@/types/project";
import { Head, router } from "@inertiajs/react";
import { ArrowRight, ChevronUp, House, LoaderCircle } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/Utils/utils";
import { useUpdateEffect } from "@/Hooks/use-update-effect";
import { Badge } from "@/Components/ui/badge";
import * as Tooltip from "@/Components/ui/tooltip";

const ConfirmNewVersionCreation = React.lazy(
    () => import("@/Features/Project/ConfirmNewVersionCreation")
);
interface ProjectShowProps {
    canCreateNewVersion: boolean;
    versions: {
        id: string;
        name: string;
        reason: string;
        creator: Project["creator"];
        isFirstVersion: boolean;
        isSuggested: boolean;
        isMain: boolean;
        data: Project;
        createdAt: string;
    }[];
    previousVersion: {
        id: string;
        data: Project;
    };
}

const Show: React.FC<ProjectShowProps> = ({
    canCreateNewVersion,
    versions,
    previousVersion,
}) => {
    const [previousVersions, setPreviousVersions] = React.useState<
        Record<string, any>
    >({});

    const project = React.useMemo(() => {
        return versions.find((v) => v.isMain)!.data;
    }, [versions]);

    const [visible, setVisible] = React.useState<Record<string, true>>(() =>
        versions.length === 1 ? { [versions[0].id]: true } : {}
    );

    const breadcrumbs = React.useMemo(
        () => [
            { href: route("app"), label: <House className="h-5 w-5" /> },
            { href: route("project.index"), label: "Projets" },
            { label: project.name },
        ],
        []
    );

    const [confirmModal, setConfirmModal] = React.useState(false);
    const [progressing, setProgressing] = React.useState(false);

    useUpdateEffect(() => {
        if (!previousVersion) return;

        setPreviousVersions((prev) => ({
            ...prev,
            [previousVersion.id]: previousVersion.data,
        }));
    }, [previousVersion]);
    return (
        <div className="space-y-4">
            <Head title={project.name} />
            <Breadcrumb items={breadcrumbs} />

            <div className="flex md:flex-row flex-col md:items-center items-stretch justify-between gap-4">
                <div className="space-y-2">
                    <Heading level={3}>{project.name}</Heading>

                    <Text className="sm:text-base text-sm">
                        Consultez les détails complets de projet{" "}
                        <span className="font-medium">{project.name}</span>.
                    </Text>
                </div>

                {canCreateNewVersion && (
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
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-between">
                                <span className="text-2xl font-bold">
                                    {version.name}
                                </span>
                                {version.isMain ? (
                                    <Badge
                                        variant="green"
                                        className="text-lg font-semibold"
                                    >
                                        Majeure
                                    </Badge>
                                ) : null}
                            </h3>

                            {version.reason && (
                                <blockquote className="text-base italic font-normal text-gray-500 dark:text-gray-400">
                                    "{version.reason}"
                                </blockquote>
                            )}
                        </div>

                        <div className="relative">
                            {version.isMain ? (
                                <ProjectDetails
                                    project={project}
                                    className={
                                        !visible?.[version.id]
                                            ? "max-h-96 overflow-hidden"
                                            : ""
                                    }
                                />
                            ) : previousVersions?.[version.id] !== undefined ? (
                                <ProjectDetails
                                    project={previousVersions?.[version.id]}
                                    className={cn(
                                        !visible?.[version.id]
                                            ? "max-h-96 overflow-hidden"
                                            : "",
                                        "opacity-75"
                                    )}
                                />
                            ) : (
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        router.reload({
                                            only: ["previousVersion"],
                                            data: {
                                                version: version.id,
                                            },
                                            onBefore: () =>
                                                setProgressing(true),
                                            onFinish: () =>
                                                setProgressing(false),
                                        });

                                        setVisible({
                                            [version.id]: true,
                                        });
                                    }}
                                >
                                    Consulter
                                    {progressing ? (
                                        <LoaderCircle className="shrink-0 h-4 w-4 ms-2 animate-spin" />
                                    ) : (
                                        <ArrowRight className="shrink-0 h-4 w-4 ms-2" />
                                    )}
                                </Button>
                            )}

                            {versions.length > 1 &&
                                (version.isMain ||
                                    previousVersions?.[version.id]) && (
                                    <div
                                        className={cn(
                                            "absolute inset-x-0 -bottom-5 flex justify-center",
                                            !visible[version.id] ? "" : ""
                                        )}
                                    >
                                        <Tooltip.TooltipProvider>
                                            <Tooltip.Tooltip>
                                                <Tooltip.TooltipTrigger asChild>
                                                    <Button
                                                        type="button"
                                                        variant="primary"
                                                        size="sm"
                                                        className="group relative pointer-events-auto"
                                                        onClick={() =>
                                                            !visible[version.id]
                                                                ? setVisible({
                                                                      [version.id]:
                                                                          true,
                                                                  })
                                                                : setVisible({})
                                                        }
                                                    >
                                                        <ChevronUp
                                                            className={cn(
                                                                "h-6 w-6 group",
                                                                !visible[
                                                                    version.id
                                                                ]
                                                                    ? "rotate-180"
                                                                    : ""
                                                            )}
                                                        />
                                                    </Button>
                                                </Tooltip.TooltipTrigger>
                                                <Tooltip.TooltipContent>
                                                    {visible[version.id]
                                                        ? "Afficher moins"
                                                        : "Afficher plus"}
                                                </Tooltip.TooltipContent>
                                            </Tooltip.Tooltip>
                                        </Tooltip.TooltipProvider>
                                    </div>
                                )}
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
};

// @ts-ignore
Show.layout = (page) => <AuthLayout children={page} />;

export default Show;
