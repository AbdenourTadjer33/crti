import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import WorkspaceLayout from "@/Layouts/workspace-layout";
import { Head, usePage } from "@inertiajs/react";
import Breadcrumb from "@/Components/common/breadcrumb";
import { House } from "lucide-react";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";

const Project: React.FC<any> = ({ project }) => {
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
            <div className="space-y-2">
                <Heading level={3} className="font-medium">
                    {project.name}
                </Heading>

                <Text>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Repellat itaque sit maxime qui? Vitae eos assumenda
                    voluptatem cum aspernatur error culpa aperiam deleniti,
                    pariatur sit enim odit maiores fugiat. Libero nemo quidem
                    aliquam. Placeat, neque! Omnis, et aliquid.
                </Text>
            </div>
            <pre>{JSON.stringify(usePage().props, null, 2)}</pre>
            DISPLAY PROJECT STATISTICS
            <br />
            USER THAT HAVE ACCESS CAN SUGGEST NEW VERSIONS HERE
            <pre>{JSON.stringify(project, null, 2)}</pre>
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
