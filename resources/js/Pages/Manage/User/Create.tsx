import React from "react";
import Breadcrumb from "@/Features/Breadcrumb/Breadcrumb";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head } from "@inertiajs/react";
import { MdHome } from "react-icons/md";
import { route } from "@/Utils/helper";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { FormWrapper } from "@/Components/ui/form";
import CreateForm from "@/Features/Manage/User/CreateForm";
import { Permission, Role } from "@/types";

const breadcrumbs = [
    { href: route("app"), label: <MdHome className="w-6 h-6" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    { href: route("manage.user.index"), label: "Gestion d'utilisateurs" },
    { label: "Créer utilisateur" },
];

const Create: React.FC<{
    permissions: Permission[];
    roles: Role[];
    universities: { id: number; name: string }[];
}> = ({ permissions, roles, universities }) => {
    return (
        <AuthLayout>
            <Head title="Créer utilisateur" />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} />

                <div>
                    <Heading level={3} className="font-medium">
                        Créer utilisateur
                    </Heading>

                    <Text>
                        Votre modèle de tableau de bord de gestion d'accées.
                    </Text>
                </div>
                <FormWrapper>
                    <CreateForm />
                </FormWrapper>
            </div>
        </AuthLayout>
    );
};

export default Create;
