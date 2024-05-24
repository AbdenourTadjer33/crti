import React from "react";
import { Head, Link } from "@inertiajs/react";

import AuthLayout from "@/Layouts/AuthLayout";
import { MdHome } from "react-icons/md";
import Breadcrumb from "@/Features/Breadcrumb/Breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { Button } from "@/Components/ui/button";
import { MdAdd } from "react-icons/md";
import Table from "@/Features/Manage/Unit/Table";
import { Pagination, Unit } from "@/types";

const breadcrumbs = [
    { href: route("app"), label: <MdHome className="w-6 h-6" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    { label: "Gestion d'unité" },
];

const Index: React.FC<{ units: Pagination<Unit> }> = ({ units }) => {
    return (
        <AuthLayout>
            <Head title="Gestion d'unité" />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} />

                <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            Gestion d'unité
                        </Heading>

                        <Text className={"max-w-7xl"}>
                            Votre modèle de tableau de bord de gestion d'accées.
                        </Text>
                    </div>

                    <Button asChild>
                        <Link href={route("manage.unit.create")}>
                            <MdAdd className="w-4 h-4 mr-2" />
                            Ajouter
                        </Link>
                    </Button>
                </div>

                <Table units={units} />
            </div>
        </AuthLayout>
    );
};

export default Index;
