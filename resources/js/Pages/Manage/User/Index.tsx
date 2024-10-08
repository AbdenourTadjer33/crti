import { Head, Link } from "@inertiajs/react";
import { Pagination, User } from "@/types";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Button } from "@/Components/ui/button";
import { Heading } from "@/Components/ui/heading";
import React from "react";
import Table from "@/Features/Manage/User/Table";
import { Text } from "@/Components/ui/paragraph";
import { House, Plus } from "lucide-react";

const breadcrumbs = [
    { href: route("app"), label: <House className="w-6 h-6" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    { label: "Gestion d'utilisateurs" },
];

const Index: React.FC<{ users: Pagination<User>, newUsers:any }> = ({ users, newUsers }) => {
    return (
        <>
            <Head title="Gestion d'utilisateur" />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} />

                <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            Gestion d'utilisateurs
                        </Heading>

                        <Text>
                            Voici la liste des utilisateurs. Vous pouvez
                            ajouter, modifier ou supprimer un utilisateur, gérer
                            ses permissions d'accès ainsi que leur affectation.{" "}
                        </Text>
                    </div>

                    <Button asChild>
                        <Link href={route("manage.user.create")}>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter
                        </Link>
                    </Button>
                </div>

                <Table users={users} newUsers={newUsers} />
            </div>
        </>
    );
};

// @ts-ignore
Index.layout = (page) => <AuthLayout children={page} />;

export default Index;
