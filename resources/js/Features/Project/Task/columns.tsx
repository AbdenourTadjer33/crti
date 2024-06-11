import React from "react";
import { Checkbox } from "@/Components/ui/checkbox";
import { createColumnHelper } from "@tanstack/react-table";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useHover } from "@/Hooks/use-hover";
import { Task } from "@/types/task";

const columnHelper = createColumnHelper<Task>();

export const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({ table }) => (
            <div className="flex items-center gap-3">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                />
                <MdKeyboardArrowDown className="w-4 h-4" />
            </div>
        ),
        cell: ({ row }) => {
            const hoverRef = React.useRef(null);
            const isHover = useHover(hoverRef);
            return (
                <div ref={hoverRef}>
                    {isHover || row.getIsSelected() ? (
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) =>
                                row.toggleSelected(!!value)
                            }
                            aria-label="select row"
                        />
                    ) : (
                        <>{Number(row.id) + 1}</>
                    )}
                </div>
            );
        },
    }),

    columnHelper.accessor("name", {
        header: "Tâches",
        cell: ({ getValue }) => <div>{getValue()}</div>,
    }),

    columnHelper.accessor("description", {
        header: "description",
    }),

    columnHelper.accessor("timeline.from", {
        header: "Date début",
    }),

    columnHelper.accessor("timeline.to", {
        header: "Date end",
    }),
];
