import { Pagination, Role } from "@/types";
import React from "react";
import { TableWrapper } from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import DataTable, {
    HeaderSelecter,
    RowExpander,
    RowSelecter,
} from "@/Components/common/data-table";
import { Badge } from "@/Components/ui/badge";
import {
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
    Row,
    createColumnHelper,
} from "@tanstack/react-table";

import * as DropdownMenu from "@/Components/ui/dropdown-menu";
import * as Tooltip from "@/Components/ui/tooltip";
import * as Dialog from "@/Components/ui/dialog";

import {
    Info,
    Key,
    MoreHorizontal,
    Pencil,
    Search,
    SlidersHorizontal,
    Trash,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Link, router } from "@inertiajs/react";
import { Text } from "@/Components/ui/paragraph";
import { Heading } from "@/Components/ui/heading";
import { useLocalStorage } from "@/Hooks/use-local-storage";

const columnHelper = createColumnHelper<Role>();

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

    columnHelper.accessor("id", {
        header: "id",
    }),

    columnHelper.accessor("name", {
        header: "role",
    }),

    columnHelper.accessor("permissions", {
        header: "Permissions",
        cell: ({ getValue }) => <>{getValue()?.length}</>,
    }),

    columnHelper.accessor("usersCount", {
        header: "Utilisateurs avec rôle",
    }),

    columnHelper.accessor("createdAt", {
        header: "créer le",
        cell: ({ getValue }) => (
            <Tooltip.TooltipProvider>
                <Tooltip.Tooltip>
                    <Tooltip.TooltipTrigger>
                        {formatDistanceToNow(getValue()!, {
                            addSuffix: true,
                            locale: fr,
                        })}
                    </Tooltip.TooltipTrigger>
                    <Tooltip.TooltipContent>
                        <p>
                            {format(getValue()!, "dd MMM yyy hh:mm", {
                                locale: fr,
                            })}
                        </p>
                    </Tooltip.TooltipContent>
                </Tooltip.Tooltip>
            </Tooltip.TooltipProvider>
        ),
    }),

    columnHelper.accessor("updatedAt", {
        header: "modifier le",
        cell: ({ getValue }) => (
            <Tooltip.TooltipProvider>
                <Tooltip.Tooltip>
                    <Tooltip.TooltipTrigger>
                        {formatDistanceToNow(getValue()!, {
                            addSuffix: true,
                            locale: fr,
                        })}
                    </Tooltip.TooltipTrigger>
                    <Tooltip.TooltipContent>
                        <p>
                            {format(getValue()!, "dd MMM yyy hh:mm", {
                                locale: fr,
                            })}
                        </p>
                    </Tooltip.TooltipContent>
                </Tooltip.Tooltip>
            </Tooltip.TooltipProvider>
        ),
    }),

    columnHelper.display({
        id: "Actions",
        cell: ({ row }) => {
            const [beforeDeleteModal, setBeforeDeleteModal] =
                React.useState(false);

            const deleteHandler = () => {
                router.delete(route("manage.role.destroy", { role: row.id }), {
                    preserveScroll: true,
                    preserveState: true,
                    only: ["flash", "roles"],
                    onSuccess: () => setBeforeDeleteModal(false),
                });
            };
            return (
                <>
                    <DropdownMenu.DropdownMenu modal={false}>
                        <DropdownMenu.DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-8 h-8 p-0">
                                <MoreHorizontal className="w-5 h-5" />
                            </Button>
                        </DropdownMenu.DropdownMenuTrigger>
                        <DropdownMenu.DropdownMenuContent
                            align="end"
                            onCloseAutoFocus={(e) => e.preventDefault()}
                            loop
                        >
                            <DropdownMenu.DropdownMenuItem asChild>
                                <Link
                                    href={route("manage.role.edit", {
                                        role: row.id,
                                    })}
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Modifier
                                </Link>
                            </DropdownMenu.DropdownMenuItem>
                            <DropdownMenu.DropdownMenuItem
                                onClick={() => setBeforeDeleteModal(true)}
                            >
                                <Trash className="w-4 h-4 mr-2 text-red-500 dark:text-red-600" />
                                Supprimer
                            </DropdownMenu.DropdownMenuItem>
                        </DropdownMenu.DropdownMenuContent>
                    </DropdownMenu.DropdownMenu>

                    <Dialog.Dialog
                        open={beforeDeleteModal}
                        onOpenChange={setBeforeDeleteModal}
                    >
                        <Dialog.DialogContent
                            onOpenAutoFocus={(e) => e.preventDefault()}
                        >
                            <Dialog.DialogHeader>
                                <Dialog.DialogTitle className="inline-flex items-center gap-2">
                                    <Info className="w-6 h-6 text-red-500 dark:text-red-600" />
                                    Etes-vous absolument sûr?
                                </Dialog.DialogTitle>
                            </Dialog.DialogHeader>
                            <Dialog.DialogDescription>
                                Cette action ne peut pas être annulée. Cela sera
                                définitivement supprimez cette permission.
                            </Dialog.DialogDescription>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={(e) => setBeforeDeleteModal(false)}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={deleteHandler}
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </Dialog.DialogContent>
                    </Dialog.Dialog>

                </>
            );
        },
        enableHiding: false,
    }),
];

const Table: React.FC<{ roles: Pagination<Role> }> = ({ roles }) => {
    const data = React.useMemo(() => roles.data, [roles.data]);
    const columns = React.useMemo(() => columnDef, []);
    const [columnVisibility, setColumnVisibility] = useLocalStorage(
        "manage-roles-table-column-visibility",
        {}
    );

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
        getRowCanExpand: () => true,
        getExpandedRowModel: getExpandedRowModel(),
        state: {
            columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
    });

    const subComponent = ({ row }: { row: Row<Role> }) => {
        const permissions = row.original.permissions;
        const description = row.original.description;

        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <Heading level={5}>Description</Heading>
                    <Text>
                        {description
                            ? description
                            : "Aucune description fournie"}
                    </Text>
                </div>

                <div className="space-y-2">
                    <Heading level={5}>Permissions</Heading>
                    <div className="flex flex-wrap gap-2">
                        {permissions?.map((permission, idx) => (
                            <Badge variant="indigo" key={idx}>
                                {permission.name}
                            </Badge>
                        ))}
                    </div>
                </div>
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
                    pagination: { links: roles.links, meta: roles.meta },
                    subComponent,
                }}
            />
        </TableWrapper>
    );
};

export default Table;
