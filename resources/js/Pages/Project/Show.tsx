import Breadcrumb from "@/Components/Breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import AuthLayout from "@/Layouts/AuthLayout";
import { Project } from "@/types/project";
import { Head, usePage } from "@inertiajs/react";
import React from "react";
import { MdHome } from "react-icons/md";

interface ProjectShowProps {
    project: Project;
}

const Show: React.FC<ProjectShowProps> = ({ project }) => {
    const breadcrumbs = React.useMemo(
        () => [
            { href: route("app"), label: <MdHome className="h-5 w-5" /> },
            { href: route("project.index"), label: "Projets" },
            { label: project.name },
        ],
        []
    );
    
    return (
        <AuthLayout>
            <Head title={project.name} />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} />

                <div className="space-y-2">
                    <Heading level={3}>{project.name}</Heading>

                    <Text className="max-w-7xl">
                        Votre modèle de tableau de bord de gestion d'accées.
                    </Text>
                </div>
            </div>

            <pre>{JSON.stringify(usePage().props, null, 2)}</pre>
        </AuthLayout>
    );
};

export default Show;
