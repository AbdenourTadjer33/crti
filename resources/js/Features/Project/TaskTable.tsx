import React from "react";
import * as TanstackTable from "@tanstack/react-table";
import { Task } from "@/types/project";
import { format } from "date-fns";
import { TableWrapper } from "@/Components/ui/table";
import DataTable from "@/Components/common/data-table";
import UserAvatar from "@/Components/common/user-hover-avatar";
import {
    Circle,
    CircleCheckBig,
    CirclePause,
    CircleX,
    MoveDown,
    MoveRight,
    MoveUp,
    Timer,
} from "lucide-react";

const columnHelper = TanstackTable.createColumnHelper<Task>();

const columnDef = [
    columnHelper.display({
        id: "index",
        cell: ({ row }) => row.id,
    }),

    columnHelper.accessor("name", {
        header: "tâche",
    }),

    columnHelper.accessor("status", {
        header: "Status",
        cell: ({ getValue, row }) => {
            const { _status } = row.original;

            return {
                to_do: (
                    <div className="inline-flex items-center gap-2">
                        <Circle className="shrink-0 h-4 w-4" />
                        <span>{getValue()}</span>
                    </div>
                ),
                in_progress: (
                    <div className="inline-flex items-center gap-2">
                        <Timer className="shrink-0 h-4 w-4" />
                        <span>{getValue()}</span>
                    </div>
                ),
                done: (
                    <div className="inline-flex items-center gap-2">
                        <CircleCheckBig className="shrink-0 h-4 w-4" />
                        <span>{getValue()}</span>
                    </div>
                ),
                suspended: (
                    <div className="inline-flex items-center gap-2">
                        <CirclePause className="shrink-0 h-4 w-4" />
                        <span>{getValue()}</span>
                    </div>
                ),
                canceled: (
                    <div className="inline-flex items-center gap-2">
                        <CircleX className="shrink-0 h-4 w-4" />
                        <span>{getValue()}</span>
                    </div>
                ),
            }[_status];
        },
    }),

    columnHelper.accessor("timeline", {
        header: "échancier",
        cell: ({ getValue }) =>
            `Du ${format(getValue().from, "dd MMM yyy")} au ${format(
                getValue().to,
                "dd MMM yyy"
            )}`,
    }),

    columnHelper.accessor("users", {
        header: "assigné à",
        cell: ({ getValue }) => (
            <div className="flex items-center -space-x-1 5">
                {getValue().map((user) => (
                    <UserAvatar user={user} key={user.uuid} />
                ))}
            </div>
        ),
    }),

    columnHelper.accessor("priority", {
        header: "priorité",
        cell: ({ getValue }) => (
            <div className="inline-flex items-center gap-2">
                {getValue() === "Basse" ? (
                    <MoveDown className="shrink-0 h-4 w-4" />
                ) : getValue() === "Moyenne" ? (
                    <MoveRight className="shrink-0 h-4 w-4" />
                ) : (
                    <MoveUp className="shrink-0 h-4 w-4 text-gray-500" />
                )}
                <span>{getValue()}</span>
            </div>
        ),
    }),
];

const TaskTable = ({ tasks }: { tasks: Task[] }) => {
    const data = React.useMemo(() => tasks, [tasks]);
    const columns = React.useMemo(() => columnDef, [columnDef]);

    const table = TanstackTable.useReactTable({
        data,
        columns,
        getCoreRowModel: TanstackTable.getCoreRowModel(),
        getRowId: (_, index) => String(index + 1),
    });

    return (
        <TableWrapper>
            <DataTable
                options={{
                    table,
                }}
            />
        </TableWrapper>
    );
};

export { TaskTable };
