import React from "react";
import { Pagination as PaginationType, Board } from "@/types";
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
import UserAvatar from "@/Components/common/user-hover-avatar";
import {
    differenceInDays,
    format,
    formatDistanceToNow,
    isAfter,
    isBefore,
    parseISO,
    set,
} from "date-fns";
import { fr } from "date-fns/locale";
import { Dialog } from "@radix-ui/react-dialog";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Badge } from "@/Components/ui/badge";
import { useLocalStorage } from "@/Hooks/use-local-storage";

const columnHelper = createColumnHelper<Board>();

const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({ table }) => <HeaderSelecter table={table} />,
        cell: ({ row }) => <RowSelecter row={row} />,
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.accessor("code", {
        header: "Conseil",
        cell: ({ getValue }) => (
            <p className="whitespace-nowrap font-medium">{getValue()}</p>
        ),
    }),

    columnHelper.accessor("project.code", {
        header: "Code du projet",
        cell: ({ getValue }) => (
            <p className="whitespace-nowrap font-medium">{getValue()}</p>
        ),
    }),

    columnHelper.accessor("users", {
        header: "Membres",
        cell: ({ getValue, row }) => (
            <div className="flex items-center -space-x-1">
                {getValue()?.map((user) => (
                    <UserAvatar
                        key={user.uuid}
                        user={user}
                        className={
                            row.original.president === user.uuid
                                ? "*:!border-primary-700/75"
                                : undefined
                        }
                    />
                ))}
            </div>
        ),
    }),

    columnHelper.accessor("judgment_period", {
        header: "Periode d'évaluation",
        cell: ({ getValue }) => (
            <p className="whitespace-nowrap">
                {`${format(getValue().from, "dd/MM")} - ${format(
                    getValue().to,
                    "dd/MM"
                )}`}
            </p>
        ),
    }),

    columnHelper.accessor("judgment_period", {
        header: "Durré",
        cell: ({ getValue }) => {
            const diff = differenceInDays(getValue().to, getValue().from);

            return (
                <Badge size="default">{`${diff} jour${
                    diff > 1 ? "s" : ""
                }`}</Badge>
            );
        },
    }),

    columnHelper.display({
        id: "status",
        header: "Status",
        cell: ({ row }) => {
            const decision = React.useMemo(() => row.original.decision, []);

            const from = React.useMemo(
                () => parseISO(row.original.judgment_period.from),
                [row.original.judgment_period.from]
            );
            const to = React.useMemo(() => {
                return set(row.original.judgment_period.to, {
                    hours: 23,
                    minutes: 59,
                    seconds: 59,
                });
            }, [row.original.judgment_period.to]);

            const isComming = isBefore(new Date(), from);
            const isFinished = isAfter(new Date(), to);
            const isProgressing = !isComming && !isFinished;

            if (isComming) return <Badge variant="yellow">A venir</Badge>;

            if (isProgressing && typeof decision === "undefined")
                return <Badge variant="blue">En cours</Badge>;

            if (
                (isProgressing || isFinished) &&
                typeof decision !== "undefined"
            )
                return <Badge variant="green">Terminée</Badge>;

            if (isFinished && typeof decision === "undefined")
                return <Badge variant="red">Aucune décision prise !</Badge>;
        },
    }),

    columnHelper.accessor("decision", {
        header: "Décision",
        cell: ({ getValue, row }) => {
            if (isBefore(new Date(), row.original.judgment_period.from))
                return null;

            if (typeof getValue() === "undefined")
                return <p className="whitespace-nowrap">Aucune décision</p>;

            return (
                <p className=" font-medium">
                    {getValue() ? "Accepté" : "Refusé"}
                </p>
            );
        },
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
                router.delete(
                    route("manage.board.destroy", { board: row.id }),
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
                                    href={route("manage.board.show", {
                                        board: row.id,
                                    })}
                                >
                                    <ArrowRightCircle className="w-4 h-4 mr-2" />
                                    Voir
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route("manage.board.edit", {
                                        board: row.id,
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

                            <DropdownMenuItem
                                onClick={() => setBeforeDeleteModal(true)}
                            >
                                <Trash className="w-4 h-4 mr-2 text-red-500 dark:text-red-600" />
                                Archiver
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
                            <DialogDescription></DialogDescription>
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

const Table: React.FC<{ boards: PaginationType<Board> }> = ({ boards }) => {
    const finalData = React.useMemo(() => boards.data, [boards.data]);
    const finalColumnDef = React.useMemo(() => columnDef, []);
    const [columnVisibility, setColumnVisibility] = useLocalStorage(
        "manage-board-table-column-visibility",
        {}
    );

    const table = useReactTable({
        columns: finalColumnDef,
        data: finalData,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.code,
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
                    pagination: { links: boards.links, meta: boards.meta },
                }}
            />
        </TableWrapper>
    );
};

export default Table;
