import {
    HeaderSelecter,
    RowSelecter,
} from "@/Components/common/data-table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { createColumnHelper } from "@tanstack/react-table";
import { User } from "@/types";
import { Link } from "@inertiajs/react";
import { SquareArrowOutUpRight } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const columnHelper = createColumnHelper<User>();

export const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({ table }) => <HeaderSelecter table={table} />,
        cell: ({ row }) => <RowSelecter row={row} />,
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.accessor("uuid", {
        header: "id",
    }),

    columnHelper.accessor("name", {
        header: "nom - prenom",
        cell: ({ row }) => (
            <Link
                href={route("manage.user.show", row.original.uuid)}
                className="inline-flex items-center hover:text-blue-600 duration-100"
            >
                {row.original.name}{" "}
                <SquareArrowOutUpRight className="h-4 w-4 ml-1.5" />
            </Link>
        ),
    }),

    columnHelper.accessor("email", {
        header: "e-mail",
    }),

    columnHelper.accessor("board.addedAt", {
        header: "Ajouté",
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
];

