import React from "react";
import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { TableWrapper } from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import DataTable, { HeaderSelecter, RowSelecter } from "@/Components/common/data-table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Button, buttonVariants } from "@/Components/ui/button";
import { Division } from "@/types/division";
import { Link, router } from "@inertiajs/react";
import { ArrowRightCircle, Delete, Edit, Ellipsis, Info, MoreHorizontal, Plus, Search, SlidersHorizontal, SquareArrowOutUpRight } from "lucide-react";
import { cn } from "@/Utils/utils";
import { useLocalStorage } from "@/Hooks/use-local-storage";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/Components/ui/dialog";


const columnHelper = createColumnHelper<Division>();

export const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({ table }) => <HeaderSelecter table={table} />,
        cell: ({ row }) => <RowSelecter row={row} />,
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.accessor("name", {
        header: "Division",
        cell: ({ getValue, row }) => (
            <Link
                href={route("manage.unit.division.show", {
                    unit: route().params.unit,
                    division: row.original.id,
                })}
                className="inline-flex items-center hover:text-blue-600 duration-100"
            >
                <span className="md:mr-1">{getValue()}</span>
                <span className="hidden md:inline-block">
                    -{row.original.abbr}-
                </span>
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

    columnHelper.accessor("createdAt", {
        header: "créer",
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
                router.delete(
                    route("manage.unit.division.destroy", {
                        unit: route().params.unit,
                        division: row.id,
                    }),
                    {
                        preserveScroll: true,
                        preserveState: true,
                        onSuccess: () => setBeforeDeleteModal(false),
                    }
                );
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
                                <Link
                                    href={route("manage.unit.division.show", {
                                        unit: route().params.unit as string,
                                        division: row.id,
                                    })}
                                >
                                    <ArrowRightCircle className="w-4 h-4 mr-2" />
                                    voir
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route("manage.unit.division.edit", {
                                        unit: route().params.unit as string,
                                        division: row.id,
                                    })}
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    modifier
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setBeforeDeleteModal(true)}
                            >
                                <Delete className="w-4 h-4 mr-2 text-red-500 dark:text-red-600" />
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


const Table: React.FC<{ divisions: Division[] }> = ({ divisions }) => {
    const data = React.useMemo(() => divisions, [divisions]);
    const columns = React.useMemo(() => columnDef, []);
    const [columnVisibility, setColumnVisibility] = useLocalStorage(
        `manage-divisions-${route().params.unit}-table-column-visibility`,
        {}
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
        state: {
            columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
    });

    return (
        <TableWrapper>
            <div className="p-4 flex justify-between">
                <div className="relative sm:w-80 w-full">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <Input placeholder="Rechercher..." className="pl-10" />
                </div>

                <div className="sm:hidden">
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost">
                                <Ellipsis className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Link
                                    href={route(
                                        "manage.unit.division.create",
                                        route().params.unit as string
                                    )}
                                    className="flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Ajouter division
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    Visibility
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    {table
                                        .getAllColumns()
                                        .filter((col) => col.getCanHide())
                                        .map((col) => {
                                            const title =
                                                typeof col.columnDef.header ===
                                                "string"
                                                    ? col.columnDef.header
                                                    : col.id;
                                            return (
                                                <DropdownMenuCheckboxItem
                                                    key={col.id}
                                                    checked={col.getIsVisible()}
                                                    onCheckedChange={(value) =>
                                                        col.toggleVisibility(
                                                            !!value
                                                        )
                                                    }
                                                    onSelect={(e) =>
                                                        e.preventDefault()
                                                    }
                                                >
                                                    {title}
                                                </DropdownMenuCheckboxItem>
                                            );
                                        })}
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="hidden sm:block">
                    <div className="flex items-center gap-2">
                        <Link
                            href={route(
                                "manage.unit.division.create",
                                route().params.unit as string
                            )}
                            className={cn(
                                buttonVariants(),
                                "justify-between gap-2"
                            )}
                        >
                            <Plus className="w-4 h-4" />
                            Ajouter division
                        </Link>

                        <DropdownMenu>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost">
                                                <SlidersHorizontal className="ww-5 h-5" />
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
                                            typeof col.columnDef.header ===
                                            "string"
                                                ? col.columnDef.header
                                                : col.id;
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={col.id}
                                                checked={col.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    col.toggleVisibility(
                                                        !!value
                                                    )
                                                }
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
                                            >
                                                {title}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <DataTable
                options={{
                    table,
                }}
            />
        </TableWrapper>
    );
};

export default Table;
