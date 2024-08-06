import React from "react";
import { Head, Link } from "@inertiajs/react";

import AuthLayout from "@/Layouts/AuthLayout";
import { MdHome } from "react-icons/md";
import Breadcrumb from "@/Components/Breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { Button } from "@/Components/ui/button";
import Table from "@/Features/Manage/Unit/Table";
import { Pagination, Unit } from "@/types";
import { House, Plus } from "lucide-react";
import { TableWraper } from "@/Components/ui/table";

const Index: React.FC<{ unit: any }> = ({ unit }) => {
    const breadcrumbs = React.useMemo(
        () => [
            { href: route("app"), label: <House className="w-5 h-5" /> },
            { href: route("manage.index"), label: "Centres d'administration" },
            {
                href: route("manage.unit.index", route().params.unit as string),
                label: "Gestion d'unité",
            },
            {
                label: unit.name,
            },
        ],
        []
    );

    return (
        <AuthLayout>
            <Head title={unit.name} />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} />

                <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            {unit.name} {unit.abbr && "-" + unit.abbr + "-"}
                        </Heading>

                        <Text className={"max-w-7xl"}>
                            Votre modèle de tableau de bord de gestion d'accées.
                        </Text>
                    </div>
                </div>

                <TableWraper className="p-4 overflow-hidden">
                    <Link
                        href={route(
                            "manage.unit.edit",
                            route().params.unit as string
                        )}
                    >
                        Modifier
                    </Link>
                </TableWraper>
            </div>
        </AuthLayout>
    );
};

export default Index;
