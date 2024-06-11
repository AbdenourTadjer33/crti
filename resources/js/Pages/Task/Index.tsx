import * as React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import { MdHome } from "react-icons/md";
import Breadcrumb from "@/Features/Breadcrumb/Breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { Button } from "@/Components/ui/button";
import { MdAdd } from "react-icons/md";
import DataTable from "@/Components/DataTable";
import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { TableWraper } from "@/Components/ui/table";

const breadcrumbs = [
    { href: route("app"), label: <MdHome className="w-6 h-6" /> },
    { label: "Mes projets" },
];

const columnHelper = createColumnHelper<any>();

const Index = () => {
    const columns = React.useMemo(
        () => [
            columnHelper.accessor("id", {
                header: "id",
            }),
        ],
        []
    );

    const [data, setData] = React.useState<any>([{ id: 111 }, { id: 222 }]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            addRow: () => {
                const newRow = { id: Math.floor(Math.random() * 10000) };
                setData((old: any[]) => [...old, newRow]);
            },
        },
    });

    return (
        <AuthLayout>
            <Head title="Mes Tâches" />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} MAX_ITEMS={2} />

                <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            Mes Tâches
                        </Heading>

                        <Text className={"max-w-7xl"}>
                            Votre modèle de tableau de bord de gestion d'accées.
                        </Text>
                    </div>

                    <Button onClick={() => setData((old) => [...old, {id: Math.floor(Math.random() * 10000)}])}>
                        <MdAdd className="w-4 h-4 mr-2" />
                        Ajouter une tâche
                    </Button>
                </div>

                <TableWraper>
                    <DataTable options={{ table }} />
                </TableWraper>
            </div>
        </AuthLayout>
    );
};

export default Index;
