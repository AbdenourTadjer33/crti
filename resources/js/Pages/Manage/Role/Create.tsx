import { Head } from "@inertiajs/react";
import CreateForm from "@/Features/Manage/Role/CreateForm";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Features/Breadcrumb/Breadcrumb";

import { MdHome } from "react-icons/md";
import { PermissionContext } from "@/Contexts/Manage/Role/PermissionContext";
import { Permission } from "@/types";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { FormWrapper } from "@/Components/ui/form";

const breadcrumbs = [
    { href: route("app"), label: <MdHome className="w-6 h-6" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    { href: route("manage.role.index"), label: "Roles & permissions" },
    { label: "Créer role" },
];

const Create = ({ permissions }: { permissions: Permission[] }) => {
    return (
        <AuthLayout>
            <Head title="Créer role" />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} />

                <div>
                    <Heading level={3} className="font-medium">
                        Créer un nouveau role
                    </Heading>

                    <Text>
                        Votre modèle de tableau de bord de gestion d'accées.
                    </Text>
                </div>

                <FormWrapper>
                    <PermissionContext.Provider value={{ permissions }}>
                        <CreateForm />
                    </PermissionContext.Provider>
                </FormWrapper>
            </div>
        </AuthLayout>
    );
};

export default Create;
