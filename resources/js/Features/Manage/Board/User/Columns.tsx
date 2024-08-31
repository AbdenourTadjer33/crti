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
import dayjs from "dayjs";
import { User } from "@/types";
import { Link } from "@inertiajs/react";
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
        header: "nom - prenom",
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
                        {dayjs(getValue()).fromNow()}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{dayjs(getValue()).format("DD-MM-YYYY HH:mm:ss")}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
    }),
];

