import React from "react";
import { Permission, Role } from "@/types";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import CreateForm from "@/Features/Manage/User/CreateForm";
import { Head } from "@inertiajs/react";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { House } from "lucide-react";

const breadcrumbs = [
    { href: route("app"), label: <House className="w-5 h-5" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    { href: route("manage.user.index"), label: "Gestion d'utilisateurs" },
    { label: "Créer utilisateur" },
];

const Create: React.FC<{
    permissions: Permission[];
    roles: Role[];
    universities: { id: number; name: string }[];
    units: [];
    divisions: [];
    boards: [];
}> = ({units}) => {
    return (
        <div className="space-y-4">
            <Head title="Créer utilisateur" />

            <Breadcrumb items={breadcrumbs} />

            <div>
                <Heading level={3} className="font-medium">
                    Créer utilisateur
                </Heading>

                <Text>
                    Votre modèle de tableau de bord de gestion d'accées.
                </Text>
            </div>

            <CreateForm units={units} />
        </div>
    );
};

// @ts-ignore
Create.layout = (page) => <AuthLayout children={page} />;

export default Create;
