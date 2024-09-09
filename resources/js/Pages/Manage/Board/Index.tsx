import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { Button } from "@/Components/ui/button";
import { Board, Pagination } from "@/types";
import { Plus, House } from "lucide-react";
import Table from "@/Features/Manage/Board/Table";

const breadcrumbs = [
    { href: route("app"), label: <House className="w-5 h-5" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    { label: "Gestion des conseils scientifique" },
];

const Index: React.FC<{ boards: Pagination<Board> }> = ({ boards }) => {
    return (
        <div className="space-y-4">
            <Head title="Gestion des conseils scientifique" />

            <Breadcrumb items={breadcrumbs} />

            <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                <div className="space-y-2">
                    <Heading level={3} className="font-medium">
                        Gestion des conseils scientifique
                    </Heading>

                    <Text className="text-sm sm:text-base">
                        Voici la liste de tout les conseils scientifique
                        enregistrées. Vous pouvez visualiser les détails de
                        chaque conseil scientifique, et accéder aux options pour
                        modifier ou supprimer les conseils scientifique
                        existantes.
                    </Text>
                </div>

                <Button asChild>
                    <Link href={route("manage.board.create")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter un conseil scientifique
                    </Link>
                </Button>
            </div>

            <Table boards={boards} />
        </div>
    );
};

// @ts-ignore
Index.layout = (page) => {
    return <AuthLayout children={page} />;
};

export default Index;
