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
import { User } from "@/types";

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
        header: "name",

    }),

    columnHelper.accessor("email", {
        header: "e-mail",
    }),

    columnHelper.accessor("division.grade", {
        header: "Grade",
    }),




    columnHelper.accessor("division.addedAt", {
        header: "Ajouté le",
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

