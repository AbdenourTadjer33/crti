import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { Button } from "@/Components/ui/button";
import Table from "@/Features/Manage/Unit/Table";
import { Pagination, Unit } from "@/types";
import { Plus, House } from "lucide-react";

const breadcrumbs = [
    { href: route("app"), label: <House className="w-5 h-5" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    { label: "Gestion d'unité" },
];

const Index: React.FC<{ units: Pagination<Unit> }> = ({ units }) => {
    return (
        <>
            <Head title="Gestion d'unité" />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} />

                <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            Gestion d'unité
                        </Heading>

                        <Text>
                            Voici la liste de toutes les unités enregistrées .
                            Vous pouvez visualiser les détails de chaque unité,
                            et accéder aux options pour modifier ou supprimer
                            les unités existantes.
                        </Text>
                    </div>

                    <Button asChild>
                        <Link href={route("manage.unit.create")}>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter Unité
                        </Link>
                    </Button>
                </div>
                <Table units={units} />
            </div>
        </>
    );
};

// @ts-ignore
Index.layout = (page) => <AuthLayout children={page} />;

export default Index;
