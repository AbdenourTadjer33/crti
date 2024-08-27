import React from "react";
import * as TanstackTable from "@tanstack/react-table";
import { RequestedResource } from "@/types/project";
import { currencyFormat } from "@/Utils/helper";
import { TableWrapper } from "@/Components/ui/table";
import DataTable from "@/Components/common/data-table";
import { Button } from "@/Components/ui/button";

const columnHelper = TanstackTable.createColumnHelper<RequestedResource>();

const columnDef = [
    columnHelper.display({
        id: "index",
        cell: ({ row }) => row.id,
        footer: ({ table }) =>
            !!table.getRowCount() && <p className="text-pretty">TOTAL</p>,
    }),

    columnHelper.accessor("name", {
        header: "nature",
    }),

    columnHelper.display({
        id: "description",
        header: "Observation",
        cell: ({ getValue, row }) => (
            <Button
                variant="link"
                onClick={row.getToggleExpandedHandler()}
                disabled={!getValue()}
                className="justify-start truncate text-sm"
            >
                {!row.getIsExpanded()
                    ? "Voir l'observation"
                    : "Cacher l'observation"}
            </Button>
        ),
    }),

    columnHelper.accessor("price", {
        header: "prix",
        cell: ({ getValue }) => currencyFormat(getValue()),
        footer: ({ table }) => {
            if (!table.getRowCount()) return;

            const total = table
                .getRowModel()
                .rows.reduce((sum, row) => sum + row.original.price, 0);

            return (
                <p className="text-base font-medium">{currencyFormat(total)}</p>
            );
        },
    }),
];

const ResourceTable = ({ resources }: { resources: RequestedResource[] }) => {
    const data = React.useMemo(() => resources, [resources]);
    const columns = React.useMemo(() => columnDef, [columnDef]);

    const table = TanstackTable.useReactTable({
        data,
        columns,
        getCoreRowModel: TanstackTable.getCoreRowModel(),
        getRowId: (_, index) => String(index + 1),
    });

    return (
        <TableWrapper>
            <DataTable
                options={{
                    table,
                    noDataPlaceholder: (
                        <p className="text-lg font-medium text-center">
                            Aucune information fournie
                        </p>
                    ),
                    subComponent: ({ row }) => (
                        <p className="sm:text-base text-sm text-gray-600">
                            {row.original.description}
                        </p>
                    ),
                }}
            />
        </TableWrapper>
    );
};

export { ResourceTable };
