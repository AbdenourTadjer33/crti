import { User } from "@/types";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Switch } from "@/Components/ui/switch";
import { MoreHorizontal, SquareArrowOutUpRight } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Indicator } from "@/Components/ui/indicator";
import {
    HeaderSelecter,
    RowExpander,
    RowSelecter,
} from "@/Components/common/data-table";
import { Link } from "@inertiajs/react";

const columnHelper = createColumnHelper<User>();

export const columnDef = [
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

    columnHelper.accessor("uuid", {
        header: "Id",
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
        // header: "Adresse e-mail",
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

    columnHelper.accessor("status", {
        header: "Validation",
        cell: ({ getValue }) => {
            return <Switch checked={getValue()} />;
        },
    }),

    columnHelper.accessor("createdAt", {
        header: "Créer le",
        cell: ({ getValue }) => {
            const datetime = dayjs(getValue());
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>{datetime.fromNow()}</TooltipTrigger>
                        <TooltipContent>
                            <p>{datetime.format("DD-MM-YYYY HH:mm:ss")}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    }),

    columnHelper.accessor("updatedAt", {
        header: "Modifier le",
        cell: ({ getValue }) => {
            const datetime = dayjs(getValue());
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>{datetime.fromNow()}</TooltipTrigger>
                        <TooltipContent>
                            <p>{datetime.format("DD-MM-YYYY HH:MM:ss")}</p>
                        </TooltipContent>
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
