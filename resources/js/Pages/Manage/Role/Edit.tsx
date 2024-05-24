import Breadcrumb from "@/Features/Breadcrumb/Breadcrumb";
import AuthLayout from "@/Layouts/AuthLayout";
import { Permission, Role } from "@/types";
import { Head } from "@inertiajs/react";
import { MdHome } from "react-icons/md";

import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { FormWrapper } from "@/Components/ui/form";
import { PermissionContext } from "@/Contexts/Manage/Role/PermissionContext";
import EditForm from "@/Features/Manage/Role/EditForm";

const breadcrumbs = [
    { href: route("app"), label: <MdHome /> },
    { href: route("manage.index"), label: "Centres d'administrations" },
    { href: route("manage.role.index"), label: "Role & permissions" },
    { label: "Edit role" },
];

const Edit = ({
    role,
    permissions,
}: {
    role: Role;
    permissions: Permission[];
}) => {
    return (
        <AuthLayout>
            <Head title="Edit role" />

            <div className="space-y-2">
                <Breadcrumb items={breadcrumbs} />

                <div>
                    <Heading level={3} className="font-medium">
                        Edit role
                    </Heading>

                    <Text>
                        Votre modèle de tableau de bord de gestion d'accées.
                    </Text>
                </div>

                <FormWrapper>
                    <PermissionContext.Provider value={{ permissions }}>
                        <EditForm role={role} />
                    </PermissionContext.Provider>
                </FormWrapper>
            </div>
        </AuthLayout>
    );
};

export default Edit;
