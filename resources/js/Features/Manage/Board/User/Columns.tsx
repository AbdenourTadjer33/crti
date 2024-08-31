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
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import UserAvatar from "@/Components/common/user-hover-avatar";

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
        header: "nom prénom",
        cell: ({ row }) => (
            <div className="inline-flex items-center gap-2">
                <UserAvatar user={row.original}/>
                <Link
                    href={route("manage.user.show",  row.original.uuid)}
                    className="hover:text-blue-600 duration-100"
                >
                    {row.original.name}
                </Link>
            </div>

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

