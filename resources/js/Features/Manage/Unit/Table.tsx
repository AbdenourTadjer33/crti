import React from "react";
import { Pagination as PaginationType, Unit } from "@/types";
import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { TableWrapper } from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import DataTable, {
    HeaderSelecter,
    RowSelecter,
} from "@/Components/common/data-table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Button } from "@/Components/ui/button";
import {
    ArrowRightCircle,
    Info,
    MoreHorizontal,
    Pencil,
    Search,
    SlidersHorizontal,
    SquareArrowOutUpRight,
    Trash,
} from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Dialog } from "@radix-ui/react-dialog";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { useLocalStorage } from "@/Hooks/use-local-storage";

const columnHelper = createColumnHelper<Unit>();

const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({ table }) => <HeaderSelecter table={table} />,
        cell: ({ row }) => <RowSelecter row={row} />,
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.accessor("name", {
        header: "Unité",
        cell: ({ getValue, row }) => (
            <Link
                href={route("manage.unit.show", row.id)}
                className="inline-flex items-center hover:text-blue-600 duration-100"
            >
                <span>{getValue()}</span>
                <SquareArrowOutUpRight className="shrink-0 h-4 w-4 ml-1 md:block hidden" />
            </Link>
        ),
    }),

    columnHelper.accessor("abbr", {
        header: "Abréviation",
    }),

    columnHelper.accessor("webpage", {
        header: "Page web",
        cell: ({ getValue }) =>
            getValue() && (
                <a
                    href={getValue()}
                    target="_blank"
                    className="block max-w-[10rem] truncate text-blue-700 underline"
                >
                    {getValue()}
                </a>
            ),
    }),

    columnHelper.accessor("address", {
        header: "Adresse",
    }),

    columnHelper.accessor("divisionCount", {
        header: "Nombre de divisions",
    }),

    columnHelper.accessor("createdAt", {
        header: "Créer",
        cell: ({ getValue }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
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
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
    }),

    columnHelper.accessor("updatedAt", {
        header: "Modifier",
        cell: ({ getValue }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
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
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
    }),

    columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
            const [beforeDeleteModal, setBeforeDeleteModal] =
                React.useState<boolean>(false);

            const deleteHandler = () => {
                router.delete(route("manage.unit.destroy", { unit: row.id }), {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => setBeforeDeleteModal(false),
                });
            };

            return (
                <>
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
                            <DropdownMenuItem asChild>
                                <Link href={route("manage.unit.show", row.id)}>
                                    <ArrowRightCircle className="w-4 h-4 mr-2" />
                                    Voir
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route("manage.unit.edit", {
                                        unit: row.id,
                                    })}
                                >
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Modifier
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setBeforeDeleteModal(true)}
                            >
                                <Trash className="w-4 h-4 mr-2 text-red-500 dark:text-red-600" />
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog
                        open={beforeDeleteModal}
                        onOpenChange={setBeforeDeleteModal}
                    >
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="inline-flex items-center gap-2">
                                    <Info className="w-6 h-6 text-red-500 dark:text-red-600" />
                                    Etes-vous absolument sùr?
                                </DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                Cette action ne peut pas être annulée. Cela sera
                                définitivement supprimez cette unité.
                            </DialogDescription>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => setBeforeDeleteModal(false)}
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
                        </DialogContent>
                    </Dialog>
                </>
            );
        },
        enableHiding: false,
    }),
];

const Table: React.FC<{ units: PaginationType<Unit> }> = ({ units }) => {
    const data = React.useMemo(() => units.data, [units.data]);
    const columns = React.useMemo(() => columnDef, []);
    const [columnVisibility, setColumnVisibility] = useLocalStorage(
        "manage-unit-table-column-visibility",
        {}
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
        manualPagination: true,
        state: {
            columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
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

                <DropdownMenu>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost">
                                        <SlidersHorizontal className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                                visibilité des colonnes
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <DropdownMenuContent
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
                                    <DropdownMenuCheckboxItem
                                        key={col.id}
                                        checked={col.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            col.toggleVisibility(!!value)
                                        }
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        {title}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <DataTable
                options={{
                    table,
                    pagination: { links: units.links, meta: units.meta },
                }}
            />
        </TableWrapper>
    );
};

export default Table;
