import React from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { TableWrapper } from "@/Components/ui/table";
import DataTable from "@/Components/common/data-table";
import { createColumnHelper } from "@tanstack/react-table";
import { Board, Pagination } from "@/types";
import { Link } from "@inertiajs/react";
import UserAvatar from "@/Components/common/user-hover-avatar";
import {
    differenceInDays,
    format,
    isAfter,
    isBefore,
    parseISO,
    set,
} from "date-fns";
import { Badge } from "@/Components/ui/badge";
import { useUser } from "@/Hooks/use-user";
import { Button, buttonVariants } from "@/Components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/Components/ui/input";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
} from "@/Components/ui/dropdown-menu";
import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/Components/ui/tooltip";
import { useLocalStorage } from "@/Hooks/use-local-storage";

const columnHelper = createColumnHelper<Board>();

export const columnDef = [
    columnHelper.accessor("code", {
        header: "Conseil",
        cell: ({ getValue }) => (
            <span className="font-medium whitespace-nowrap">{getValue()}</span>
        ),
    }),

    columnHelper.accessor("project.name", {
        header: "project",
    }),

    columnHelper.display({
        header: "membres",
        cell: ({ row }) => (
            <div className="flex items-center -space-x-1.5">
                {row.original.users?.map((user) => (
                    <UserAvatar
                        key={user.uuid}
                        user={user}
                        className={
                            user.uuid === row.original.president
                                ? "*:!border-primary-700/75"
                                : undefined
                        }
                    />
                ))}
            </div>
        ),
    }),

    columnHelper.accessor("judgment_period.from", {
        header: "Date début",
        cell: ({ getValue }) => <p>{format(getValue(), "dd MMM yyy")}</p>,
    }),

    columnHelper.accessor("judgment_period.to", {
        header: "Date fin",
        cell: ({ getValue }) => <p>{format(getValue(), "dd MMM yyy")}</p>,
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
            const { uuid } = useUser("uuid");
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

            if (
                isFinished &&
                typeof decision === "undefined" &&
                row.original.president === uuid
            )
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

    columnHelper.display({
        id: "actions",
        cell: ({ row }) => (
            <Link
                as="button"
                href={route("board.show", { board: row.original.code })}
                className={buttonVariants()}
                disabled={isBefore(
                    new Date(),
                    row.original.judgment_period.from
                )}
            >
                Voir
            </Link>
        ),
        enableHiding: false,
    }),
];

const Table: React.FC<{ boards: Pagination<Board> }> = ({ boards }) => {
    const data = React.useMemo(() => boards.data, [boards.data]);
    const columns = React.useMemo(() => columnDef, []);
    const [columnVisibility, setColumnVisibility] = useLocalStorage(
        "app-board-table-column-visibility",
        {}
    );

    const table = useReactTable({
        columns,
        data,
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
