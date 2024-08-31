import React from "react";
import {Head, Link} from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import Table from "@/Features/Manage/Role/Table";
import {Role} from "@/types";
import {Heading} from "@/Components/ui/heading";
import {Text} from "@/Components/ui/paragraph";
import {Button} from "@/Components/ui/button";
import { House, Plus } from "lucide-react";

const breadcrumbs = [
    {href: route("app"), label: <House className="w-5 h-5"/>},
    {href: route("manage.index"), label: "Centres d'administration"},
    {label: "Roles & permissions"},
];

const Index: React.FC<{ roles: Role[] }> = ({roles}) => {

    return (
        <AuthLayout>
            <Head title="Gestion de role et permission"/>

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs}/>

                <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            Gestion de role et permission
                        </Heading>

                        <Text className={"max-w-7xl"}>
                            Votre modèle de tableau de bord de gestion d'accées.
                        </Text>
                    </div>

                    <Button asChild>
                        <Link href={route('manage.role.create')}>
                            <Plus className="w-4 h-4 mr-2"/>Ajouter
                        </Link>
                    </Button>
                </div>

                <Table roles={roles}/>
            </div>
        </AuthLayout>
    );
};

export default Index;
