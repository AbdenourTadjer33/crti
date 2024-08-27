import React from "react";
import { Head } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { House } from "lucide-react";
import { UserCard } from "@/Features/Manage/User/UserCard";


const Show: React.FC<any> = ({ user }) => {
    const breadcrumbs = [
        { href: route("app"), label: <House className="w-6 h-6" /> },
        { href: route("manage.index"), label: "Centres d'administration" },
        { href: route("manage.user.index"), label: "Gestion des utilisateurs" },
        {
            label: user.name,
        },
    ];
    return (
        <AuthLayout>
            <Head title="Gestion d'utilisateur" />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} />

                <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            { user.name }
                        </Heading>

                        <Text className="sm:text-base text-sm">
                            Consultez les informations complètes sur l'utilisateur {" "}
                            <span className=" font-medium">{user.name}</span>.
                            Vous pouvez voir les détails et accéder aux
                            options pour le modifier ou le supprimer.
                        </Text>
                    </div>
                </div>
                <UserCard user={user}/>
            </div>
            <pre>{JSON.stringify({ user }, null, 2)}</pre>
        </AuthLayout>
    );
};

export default Show;
