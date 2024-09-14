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
import ProjectVersionsTimeline from "@/Features/Project/project-versions-timeline";

const ConfirmNewVersionCreation = React.lazy(
    () => import("@/Features/Project/ConfirmNewVersionCreation")
);
interface ProjectShowProps {
    project: Project;
    canCreateNewVersion: boolean;
    previousVersions?: {
        name: string;
        reason: string;
        creator: Project["creator"];
        isSuggested: boolean;
        isFirstVersion: boolean;
        createdAt: string;
    }[];
}

const Show: React.FC<ProjectShowProps> = ({
    project,
    canCreateNewVersion,
    previousVersions,
}) => {
    const breadcrumbs = React.useMemo(
        () => [
            { href: route("app"), label: <House className="h-5 w-5" /> },
            { href: route("project.index"), label: "Projets" },
            { label: project.name },
        ],
        []
    );
    const [confirmModal, setConfirmModal] = React.useState(false);

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

            {/* <ol className="relative border-s border-gray-200 dark:border-gray-700">
                <li className="mb-10 ms-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                        February 2022
                    </time>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Application UI code in Tailwind CSS
                    </h3>
                    <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                        Get access to over 20+ pages including a dashboard
                        layout, charts, kanban board, calendar, and pre-order
                        E-commerce & Marketing pages.
                    </p>
                    <a
                        href="#"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                        Learn more{" "}
                        <svg
                            className="w-3 h-3 ms-2 rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                        </svg>
                    </a>
                </li>
                <li className="mb-10 ms-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                        March 2022
                    </time>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Marketing UI design in Figma
                    </h3>
                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                        All of the pages and components are first designed in
                        Figma and we keep a parity between the two versions even
                        as we update the project.
                    </p>
                </li>
                <li className="ms-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                        April 2022
                    </time>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        E-Commerce UI code in Tailwind CSS
                    </h3>
                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Get started with dozens of web components and
                        interactive elements built on top of Tailwind CSS.
                    </p>
                </li>
            </ol> */}

            {previousVersions && (
                <ProjectVersionsTimeline
                    versions={previousVersions}
                    project={project}
                />
            )}

            {/* <pre>{JSON.stringify(previousVersions, null, 2)}</pre> */}

            {/* <ProjectDetails project={project} /> */}
        </div>
    );
};

// @ts-ignore
Show.layout = (page) => <AuthLayout children={page} />;

export default Show;
