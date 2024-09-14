import Breadcrumb from "@/Components/common/breadcrumb";
import AuthLayout from "@/Layouts/AuthLayout";
import { Permission, Role } from "@/types";
import { Head } from "@inertiajs/react";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { FormWrapper } from "@/Components/ui/form";
import { PermissionContext } from "@/Contexts/Manage/Role/PermissionContext";
import EditForm from "@/Features/Manage/Role/EditForm";
import { House } from "lucide-react";

const breadcrumbs = [
    { href: route("app"), label: <House className="h-5 w-5 " /> },
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
        <div className="space-y-4">
            <Head title="Edit role" />
            <Breadcrumb items={breadcrumbs} />

            <div className="space-y-2">
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
    );
};

// @ts-ignore
Edit.layout = (page) => <AuthLayout children={page} />;

export default Edit;
