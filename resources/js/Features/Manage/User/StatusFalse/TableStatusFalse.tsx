import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Pagination as PaginationType, User } from "@/types";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    getCoreRowModel,
    getExpandedRowModel,
    Row,
    useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/Components/ui/button";
import DataTable from "@/Components/common/data-table";
import { Input } from "@/Components/ui/input";
import React from "react";
import { TableWrapper } from "@/Components/ui/table";
import { Search, SlidersHorizontal } from "lucide-react";

import { createColumnHelper } from "@tanstack/react-table";
import { Switch } from "@/Components/ui/switch";
import { MoreHorizontal, SquareArrowOutUpRight } from "lucide-react";
import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/Components/ui/dropdown-menu";
import { Indicator } from "@/Components/ui/indicator";
import {
    HeaderSelecter,
    RowExpander,
    RowSelecter,
} from "@/Components/common/data-table";
import { Link } from "@inertiajs/react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";


const columnHelper = createColumnHelper<User>();

const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({ table }) => <HeaderSelecter table={table} />,
        cell: ({ row }) => <RowSelecter row={row} />,
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.accessor("name", {
        header: "Nom prénom",
        cell: ({ row, getValue }) => (
            <Link
                href={route("manage.user.show", { user: row.id })}
                className="inline-flex items-center hover:text-blue-600 duration-100"
            >
                {getValue()}{" "}
                <SquareArrowOutUpRight className="h-4 w-4 ml-1.5" />
            </Link>
        ),
    }),

    columnHelper.accessor("email", {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Email
                </Button>
            );
        },
        cell: ({ row }) => {
            const { email, isEmailVerified } = row.original;
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <span className="inline-flex items-center gap-2">
                                <Indicator color={isEmailVerified} />
                                {email}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            {isEmailVerified
                                ? "Adresse e-mail verifié"
                                : "Adresse e-mail non verifié"}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    }),



    columnHelper.accessor("createdAt", {
        header: "Créer le",
        cell: ({ getValue }) => {
            return (
                <TooltipProvider>
                    <Tooltip>
                        {/* <TooltipTrigger>
                            {formatDistanceToNow(getValue()!, {
                                addSuffix: true,
                                locale: fr,
                            })}
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                {format(getValue()!, "dd MMM yyy hh:mm", {
                                    locale: fr,
                                })}
                            </p>
                        </TooltipContent> */}
                    </Tooltip>
                </TooltipProvider>
            );
        },
    }),




    columnHelper.display({
        id: "Actions",
        cell: ({ row }) => {
            const id = row.id;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        onCloseAutoFocus={(e) => e.preventDefault()}
                        loop
                    >
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            onClick={() => navigator.clipboard.writeText(id)}
                        >
                            Copier l'ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem asChild>
                            <Link href={route("manage.user.edit", { board: id })}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Modifier
                            </Link>
                    </DropdownMenuItem> */}
                        <DropdownMenuItem>Supprimé</DropdownMenuItem>
                        <DropdownMenuItem>Blocker</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        enableHiding: false,
    }),
];


const TableStatusFalse: React.FC<{ users: User[] }> = ({ users }) => {
    const finalData = React.useMemo(() => users, [users]);
    const finalColumnDef = React.useMemo(() => columnDef, []);

    const table = useReactTable({
        columns: finalColumnDef,
        data: finalData ?? [],
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.uuid,
        getRowCanExpand: () => true,
        getExpandedRowModel: getExpandedRowModel(),
        manualPagination: true,
    });

    return (
        <TableWrapper>
            <DataTable
                options={{
                    table,
                }}
            />
        </TableWrapper>
    );
};

export default TableStatusFalse;
