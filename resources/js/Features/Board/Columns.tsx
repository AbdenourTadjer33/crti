
import { createColumnHelper } from "@tanstack/react-table";
import { Board } from "@/types";
import { Link } from "@inertiajs/react";
import { SquareArrowOutUpRight } from "lucide-react";
import { HeaderSelecter, RowSelecter } from "@/Components/common/data-table";
import UserAvatar from "@/Components/common/user-hover-avatar";
import { format } from "date-fns";

const columnHelper = createColumnHelper<Board>();

export const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({ table }) => <HeaderSelecter table={table} />,
        cell: ({ row }) => <RowSelecter row={row} />,
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.accessor("code", {
        header: "code",
    }),

    columnHelper.display({
        id: "board",
        header: "conseil",
        cell: ({ row }) => (
            <Link
                href={route("board.show", row.id)}
                className="inline-flex items-center hover:text-blue-600 duration-100"
            >
                {row.original.name}
                <SquareArrowOutUpRight className="h-4 w-4 ml-1.5" />
            </Link>
        ),
    }),

    columnHelper.accessor("project.name", {
        header: "project",
        cell: ({ row }) => (
            <Link
                href={route("project.show", row.original.project.code)}
                className="inline-flex items-center hover:text-blue-600 duration-100"
            >
                {row.original.project.name}{" "}
                <SquareArrowOutUpRight className="h-4 w-4 ml-1.5" />
            </Link>
        ),
    }),

    columnHelper.display({
        header: "membres",
        cell: ({row}) => <div className="flex items-center -space-x-2 start">
            {row.original.users?.map((user) => (
                <UserAvatar key={user.uuid} user={user}/>
            ))}
        </div>
    }),

    columnHelper.display({
        header: "president",
        cell: ({ row }) => (
            <div className="flex items-center gap-1">
                <UserAvatar user={row.original.president} />
                {row.original.president.name}
            </div>
        ),
    }),

    columnHelper.accessor("judgment_period", {
        header: "periode de jugement",
        cell: ({ getValue }) =>
            `Du ${format(getValue().from, "dd MMM yyy")} au ${format(
                getValue().to,
                "dd MMM yyy"
            )}`,
    }),

    columnHelper.display({
        id: "actions",
        cell: ({ row }) => <Actions code={row.original.code} />,
        enableHiding: false,
    }),
];

const Actions = ({ code }: { code: string }) => {

    return (
        <Link
            type="button"
            href={route("board.show", {board: code} )}
        >
            <SquareArrowOutUpRight className="hover:text-blue-600 duration-100"/>
        </Link>

    );
};

