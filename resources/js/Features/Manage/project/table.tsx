import React from "react";
import * as TanstackTable from "@tanstack/react-table";
import * as DropdownMenu from "@/Components/ui/dropdown-menu";
import * as Tooltip from "@/Components/ui/tooltip";
import { Input } from "@/Components/ui/input";
import { TableWrapper } from "@/Components/ui/table";
import {
    ArrowRightCircle,
    MoreHorizontal,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import ProjectBadge from "@/Components/common/project-badge";
import UserAvatar from "@/Components/common/user-hover-avatar";
import DataTable, {
    HeaderSelecter,
    RowExpander,
    RowSelecter,
} from "@/Components/common/data-table";
import { Button } from "@/Components/ui/button";
import { Project } from "@/types/project";
import { Pagination } from "@/types";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useLocalStorage } from "@/Hooks/use-local-storage";

const columnHelper = TanstackTable.createColumnHelper<Project>();

const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({ table }) => <HeaderSelecter table={table} />,
        cell: ({ row }) => <RowSelecter row={row} />,
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.display({
        id: "expander",
        cell: ({ row }) => <RowExpander row={row} />,
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

    columnHelper.accessor("creator", {
        header: "Créateur",
        cell: ({ getValue }) => <UserAvatar user={getValue()} />,
    }),

    columnHelper.accessor("division", {
        header: "Division",
        cell: ({ getValue }) => (
            <p className="">
                <span className="block md:hidden">{getValue().abbr}</span>
                <span className="hidden md:block">{getValue().name}</span>
            </p>
        ),
    }),

    columnHelper.accessor("status", {
        header: "Status",
        cell: ({ getValue, row }) => (
            <ProjectBadge
                status={row.original._status}
                size="sm"
                className="whitespace-nowrap"
            >
                {getValue()}
            </ProjectBadge>
        ),
    }),

    columnHelper.accessor("versionsCount", {
        header: "Nombre de version",
        cell: ({ getValue }) => getValue(),
    }),

    columnHelper.accessor("createdAt", {
        header: "Créer",
        cell: ({ getValue }) => (
            <Tooltip.TooltipProvider>
                <Tooltip.Tooltip>
                    <Tooltip.TooltipTrigger>
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
                >
                    <DropdownMenu.DropdownMenuItem>
                        <ArrowRightCircle className="w-4 h-4 mr-2" />
                        Voir
                    </DropdownMenu.DropdownMenuItem>
                </DropdownMenu.DropdownMenuContent>
            </DropdownMenu.DropdownMenu>
        ),
        enableHiding: false,
        enableSorting: false,
    }),
];

const Table: React.FC<{
    projects: Pagination<Project>;
}> = ({ projects }) => {
    const data = React.useMemo(() => projects.data, [projects.data]);
    const columns = React.useMemo(() => columnDef, []);
    const [columnVisibility, setColumnVisibility] = useLocalStorage(
        "manage-project-table-column-visibility",
        {}
    );

    const table = TanstackTable.useReactTable({
        data,
        columns,
        getCoreRowModel: TanstackTable.getCoreRowModel(),
        getRowId: (row) => row.code,
        getRowCanExpand: () => true,
        getExpandedRowModel: TanstackTable.getExpandedRowModel(),
        manualPagination: true,
        state: {
            columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
    });

    const Sub = ({ row }: { row: TanstackTable.Row<Project> }) => {
        const project = row.original;

        if (project._status === "creation") {
            return <div>Projet en cours de création.</div>;
        }

        return (
            <div>
                {row.id}
                <p>{project.name}</p>
                <pre>{JSON.stringify(row, null, 2)}</pre>
            </div>
        );
    };

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
                                        {title}
                                    </DropdownMenu.DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenu.DropdownMenuContent>
                </DropdownMenu.DropdownMenu>
            </div>

            <DataTable
                options={{
                    table,
                    pagination: { links: projects.links, meta: projects.meta },
                    subComponent: Sub,
                }}
            />
        </TableWrapper>
    );
};

export default Table;
