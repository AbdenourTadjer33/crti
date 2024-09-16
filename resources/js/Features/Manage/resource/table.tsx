import React from "react";
import DataTable, {
    HeaderSelecter,
    RowSelecter,
} from "@/Components/common/data-table";
import * as TanstackTable from "@tanstack/react-table";
import * as DropdownMenu from "@/Components/ui/dropdown-menu";
import * as Tooltip from "@/Components/ui/tooltip";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MoreHorizontal, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { TableWrapper } from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { capitalize } from "@/Utils/helper";
import ReadMore from "@/Components/common/read-more";

const columnHelper = TanstackTable.createColumnHelper<any>();

const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({ table }) => <HeaderSelecter table={table} />,
        cell: ({ row }) => <RowSelecter row={row} />,
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.accessor("code", {
        header: "Code",
        cell: ({ getValue }) => (
            <p className="text-sm font-medium whitespace-nowrap">
                {getValue()}
            </p>
        ),
    }),

    columnHelper.accessor("name", {
        header: "Ressource",
        cell: ({ getValue }) => (
            <p className="whitespace-nowrap">{getValue()}</p>
        ),
    }),

    columnHelper.accessor("state", {
        header: "état",
        cell: ({ getValue }) => (
            <p className="whitespace-nowrap">
                {getValue() ? "Bon" : "A réparer"}
            </p>
        ),
    }),

    columnHelper.accessor("description", {
        header: "description",
        cell: ({ getValue }) =>
            getValue() ? (
                <ReadMore
                    charLimit={50}
                    text={getValue()}
                    readMoreText="...Lire plus"
                    readLessText="Lire moins"
                />
            ) : (
                <p className="font-medium">Aucune description fournie</p>
            ),
    }),

    columnHelper.accessor("createdAt", {
        header: "Créer",
        cell: ({ getValue }) => (
            <Tooltip.TooltipProvider>
                <Tooltip.Tooltip>
                    <Tooltip.TooltipTrigger className="whitespace-nowrap">
                        {formatDistanceToNow(getValue(), {
                            addSuffix: true,
                            locale: fr,
                        })}
                    </Tooltip.TooltipTrigger>
                    <Tooltip.TooltipContent>
                        {format(getValue(), "dd MMM yyy HH:mm", {
                            locale: fr,
                        })}
                    </Tooltip.TooltipContent>
                </Tooltip.Tooltip>
            </Tooltip.TooltipProvider>
        ),
    }),

    columnHelper.display({
        id: "actions",
        cell: () => (
            <DropdownMenu.DropdownMenu>
                <DropdownMenu.DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-5 w-5" />
                    </Button>
                </DropdownMenu.DropdownMenuTrigger>
                <DropdownMenu.DropdownMenuContent
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    align="end"
                    loop
                ></DropdownMenu.DropdownMenuContent>
            </DropdownMenu.DropdownMenu>
        ),
        enableHiding: false,
        enableSorting: false,
    }),
];

const Table: React.FC<any> = ({ resources }) => {
    const data = React.useMemo(() => resources.data, [resources.data]);
    const columns = React.useMemo(() => columnDef, []);

    const table = TanstackTable.useReactTable({
        data,
        columns,
        getCoreRowModel: TanstackTable.getCoreRowModel(),
        getRowId: (row) => row.code,
        getRowCanExpand: () => true,
        manualPagination: true,
    });

    return (
        <TableWrapper>
            <div className="p-4 flex justify-between gap-2">
                <div className="relative sm:w-80">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <Input placeholder="Search" className="pl-10" />
                </div>

                <DropdownMenu.DropdownMenu>
                    <Tooltip.TooltipProvider>
                        <Tooltip.Tooltip>
                            <Tooltip.TooltipTrigger asChild>
                                <DropdownMenu.DropdownMenuTrigger asChild>
                                    <Button variant="ghost">
                                        <SlidersHorizontal className="w-5 h-5" />
                                    </Button>
                                </DropdownMenu.DropdownMenuTrigger>
                            </Tooltip.TooltipTrigger>
                            <Tooltip.TooltipContent>
                                visibilité des colonnes
                            </Tooltip.TooltipContent>
                        </Tooltip.Tooltip>
                    </Tooltip.TooltipProvider>
                    <DropdownMenu.DropdownMenuContent
                        align="end"
                        onCloseAutoFocus={(e) => e.preventDefault()}
                        loop
                        className="w-40"
                    >
                        {table
                            .getAllColumns()
                            .filter((col) => col.getCanHide())
                            .map((col) => {
                                const title =
                                    typeof col.columnDef.header === "string"
                                        ? col.columnDef.header
                                        : col.id;
                                return (
                                    <DropdownMenu.DropdownMenuCheckboxItem
                                        key={col.id}
                                        checked={col.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            col.toggleVisibility(!!value)
                                        }
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        {capitalize(title)}
                                    </DropdownMenu.DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenu.DropdownMenuContent>
                </DropdownMenu.DropdownMenu>
            </div>

            <DataTable
                options={{
                    table,
                    pagination: {
                        links: resources.links,
                        meta: resources.meta,
                    },
                }}
            />
        </TableWrapper>
    );
};

export default Table;
