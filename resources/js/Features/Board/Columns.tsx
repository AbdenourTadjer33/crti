import {
    HeaderSelecter,
    RowSelecter,
} from "@/Components/DataTable";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Board, User } from "@/types";
import { Link } from "@inertiajs/react";
import { SquareArrowOutUpRight } from "lucide-react";

const columnHelper = createColumnHelper<Board>();

export const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({ table }) => <HeaderSelecter table={table} />,
        cell: ({ row }) => <RowSelecter row={row} />,
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.accessor("id", {
        header: "id",
    }),

    columnHelper.accessor("name", {
        header: "nom - prenom",
        cell: ({ row }) => (
            <Link
                href={route("manage.user.show",  row.original.id)}
                className="inline-flex items-center hover:text-blue-600 duration-100"
            >
                {row.original.name}{" "}
                <SquareArrowOutUpRight className="h-4 w-4 ml-1.5" />
            </Link>
        ),
    }),

    columnHelper.accessor("president.name", {
        header: "e-mail",
    }),

    // columnHelper.accessor("users.name", {
    //     header: "Ajouté",
    //     cell: ({ getValue }) => (
    //         <TooltipProvider>
    //             <Tooltip>
    //                 <TooltipTrigger>
    //                     {dayjs(getValue()).fromNow()}
    //                 </TooltipTrigger>
    //                 <TooltipContent>
    //                     <p>{dayjs(getValue()).format("DD-MM-YYYY HH:mm:ss")}</p>
    //                 </TooltipContent>
    //             </Tooltip>
    //         </TooltipProvider>
    //     ),
    // }),
];

