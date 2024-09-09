import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head } from "@inertiajs/react";
import { House } from "lucide-react";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import Table from "@/Features/Manage/project/table";

const breadcrumbs = [
    { href: route("app"), label: <House className="h-5 w-5" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    { label: "Gestion des projets" },
];

const Index: React.FC<any> = ({projects}) => {
    return (
        <div className="space-y-4">
            <Head title="Gestion des projets" />
            <Breadcrumb items={breadcrumbs} />

            <div className="space-y-2">
                <Heading level={3} className="font-medium">
                    Gestion des projets
                </Heading>

                <Text className="text-sm sm:text-base">
                    Votre modèle de tableau de bord de gestion d'accées.
                </Text>
            </div>

            {/* <pre>{JSON.stringify(projects.data, null, 2)}</pre> */}
            <Table projects={projects} />
        </div>
    );
};

// @ts-ignore
Index.layout = (page) => <AuthLayout children={page} />;

export default Index;
