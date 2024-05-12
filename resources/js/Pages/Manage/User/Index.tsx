import React from "react";
import {Head, Link} from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Features/Breadcrumb/Breadcrumb";
import Table from "@/Features/Manage/User/Table";
import {User} from "@/types";
import {Heading} from "@/Components/ui/heading";
import {Text} from "@/Components/ui/paragraph";
import {Button} from "@/Components/ui/button";
import {MdAdd, MdHome} from "react-icons/md";
import {route} from "@/Utils/helper";

const breadcrumbs = [
    {href: route('app'), label: <MdHome className="w-6 h-6"/>},
    {href: route('manage.index'), label: "Centres d'administration"},
    {label: "Gestion d'utilisateurs"}
];

const Index: React.FC<{ users: any }> = ({users}) => {
    return (
        <AuthLayout>
            <Head title="Gestion d'utilisateur"/>

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs}/>

                <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            Gestion d'utilisateurs
                        </Heading>

                        <Text>
                            Votre modèle de tableau de bord de gestion d'accées.
                        </Text>
                    </div>

                    <Button asChild>
                        <Link href={route('manage.user.create')}>
                            <MdAdd className="w-4 h-4 mr-2"/>Ajouter
                        </Link>
                    </Button>
                </div>

                <Table users={users.data}/>
            </div>
        </AuthLayout>
    );
};

export default Index;
