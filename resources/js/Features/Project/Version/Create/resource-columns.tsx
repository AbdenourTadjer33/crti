import { createColumnHelper } from "@tanstack/react-table";
import { Resource } from "@/types/form";
import { Button } from "@/Components/ui/button";
import { currencyFormat } from "@/Utils/helper";

const columnHelper = createColumnHelper<Omit<Resource, "code" | "state">>();

export const columnDef = [
    columnHelper.display({
        id: "index",
        cell: ({ row }) => row.id,
    }),

    columnHelper.accessor("name", {
        header: "nature",
    }),

    columnHelper.accessor("description", {
        header: "observation",
        cell: ({ row }) => (
            <Button variant="link" onClick={row.getToggleExpandedHandler()}>
                {!row.getIsExpanded()
                    ? "Voir l'observation"
                    : "Cacher l'observation"}
            </Button>
        ),
    }),

    columnHelper.accessor("price", {
        header: "prix",
        cell: ({ getValue }) => currencyFormat(getValue()),
    }),
];
