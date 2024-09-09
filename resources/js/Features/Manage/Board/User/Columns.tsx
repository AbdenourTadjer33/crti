import { createColumnHelper } from "@tanstack/react-table";
import { User } from "@/types";
import { Link } from "@inertiajs/react";
import UserAvatar from "@/Components/common/user-hover-avatar";

const columnHelper = createColumnHelper<User>();

export const columnDef = [
    columnHelper.accessor("uuid", {
        header: "id",
    }),

    columnHelper.accessor("name", {
        header: "Nom prénom",
        cell: ({ row }) => (
            <div className="inline-flex items-center gap-2">
                <UserAvatar user={row.original} />
                <span>{row.original.name}</span>
            </div>
        ),
    }),

    columnHelper.accessor("email", {
        header: "E-mail",
    }),
];
