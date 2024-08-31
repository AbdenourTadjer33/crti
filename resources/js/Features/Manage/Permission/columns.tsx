import { createColumnHelper } from "@tanstack/react-table";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Permission } from "@/types";
import Actions from "./actions";

const columnHelper = createColumnHelper<Permission>();

export const columnDef = [
    columnHelper.display({
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.accessor("id", {
        header: "id",
    }),

    columnHelper.display({
        id: "permission",
        header: "permission",
        cell: ({ row }) => (
            <>
            </>
        ),
    }),

    columnHelper.display({
        id: "Actions",
        cell: ({ row }) => <Actions row={row} />,
        enableHiding: false,
    }),
];
