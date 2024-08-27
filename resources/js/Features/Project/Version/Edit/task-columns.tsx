import React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { EditProjectContext } from "@/Contexts/Project/edit-project-context";
import { TaskForm } from "@/types/form";
import { format } from "date-fns";
import { Button } from "@/Components/ui/button";
import UserAvatar from "@/Components/common/user-hover-avatar";

const columnHelper = createColumnHelper<TaskForm>();

export const columnDef = [
    columnHelper.display({
        id: "index",
        cell: ({ row }) => row.id,
    }),
    columnHelper.accessor("name", {
        header: "tâche",
    }),

    columnHelper.accessor("description", {
        header: "description",
        cell: ({ row }) => (
            <Button variant="link" onClick={row.getToggleExpandedHandler()}>
                {!row.getIsExpanded()
                    ? "Voir la description"
                    : "Cacher la description"}
            </Button>
        ),
    }),

    columnHelper.accessor("timeline", {
        header: "échancier",
        cell: ({ getValue }) =>
            `Du ${format(getValue().from!, "dd MMM yyy")} au ${format(
                getValue().to!,
                "dd MMM yyy"
            )}`,
    }),

    columnHelper.accessor("users", {
        header: "assigné à",
        cell: ({ getValue }) => {
            const { data } = React.useContext(EditProjectContext);
            const members = React.useMemo(() => data.members, [data.members]);
            const uuids = React.useMemo(() => getValue(), [getValue()]);
            const selectedMembers = React.useMemo(
                () => members.filter((m) => uuids.includes(m.uuid)),
                [members, uuids]
            );

            return (
                <div className="flex items-center -space-x-1.5">
                    {selectedMembers.map((member) => (
                        <UserAvatar key={member.uuid} user={member} />
                    ))}
                </div>
            );
        },
    }),

    columnHelper.accessor("priority", {
        header: "priorité",
    }),
];
