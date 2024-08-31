import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { Task } from "@/types/project";
import { differenceInDays } from "date-fns";
import { Badge } from "@/Components/ui/badge";
import {
    KanbanCard,
    KanbanCardDescription,
    KanbanCardTitle,
    KanbanColumn,
    KanbanColumnTitle,
    KanbanLayout,
} from "@/Components/common/kanban";
import { Button } from "@/Components/ui/button";
import { EllipsisVertical } from "lucide-react";
import UserAvatar from "@/Components/common/user-hover-avatar";
import WorkspaceLayout from "@/Layouts/workspace-layout";

interface KanbanProps {
    tasks: Task[];
}

const Kanban: React.FC<KanbanProps> = ({ tasks }) => {
    const { to_do, in_progress, done, suspended, canceled } = React.useMemo<
        Record<Task["_status"], Task[]>
    >(
        () => ({
            to_do: tasks.filter((t) => t._status === "to_do"),
            in_progress: tasks.filter((t) => t._status === "in_progress"),
            done: tasks.filter((t) => t._status === "done"),
            suspended: tasks.filter((t) => t._status === "suspended"),
            canceled: tasks.filter((t) => t._status === "canceled"),
        }),
        [tasks]
    );

    return (
        <>
            <KanbanLayout className="px-0">
                <KanbanColumn className="space-y-4">
                    <KanbanColumnTitle className="capitalize">
                        à faire
                    </KanbanColumnTitle>

                    {to_do.map((task, idx) => (
                        <KanbanCard key={idx} className="space-y-2.5">
                            <div className="flex items-start justify-between gap-2">
                                <KanbanCardTitle>{task.name}</KanbanCardTitle>

                                <Button variant="ghost" size="sm">
                                    <EllipsisVertical className="h-5 w-5" />
                                </Button>
                            </div>
                            <KanbanCardDescription text={task.description} />

                            <div className="flex items-end justify-between">
                                <div className="space-y-1">
                                    <span>{task.users.length} assigné</span>
                                    <div className="flex items-center -space-x-1.5">
                                        {task.users.map((user) => (
                                            <UserAvatar
                                                key={user.uuid}
                                                user={user}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <Badge variant="indigo">
                                    {differenceInDays(
                                        task.timeline.from,
                                        new Date()
                                    )}
                                    {" jours restants"}
                                </Badge>
                            </div>
                        </KanbanCard>
                    ))}
                </KanbanColumn>

                <KanbanColumn className="space-y-4">
                    <KanbanColumnTitle className="capitalize">
                        En cours
                    </KanbanColumnTitle>
                </KanbanColumn>

                <KanbanColumn>
                    <KanbanColumnTitle className="capitalize">
                        Suspendu
                    </KanbanColumnTitle>
                </KanbanColumn>

                <KanbanColumn>
                    <KanbanColumnTitle className="capitalize">
                        Annulé
                    </KanbanColumnTitle>
                </KanbanColumn>
            </KanbanLayout>
            <pre>{JSON.stringify(tasks, null, 2)}</pre>
        </>
    );
};

// @ts-ignore
Kanban.layout = (page) => (
    <AuthLayout>
        <WorkspaceLayout children={page} />
    </AuthLayout>
);

export default Kanban;
