import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { Task } from "@/types/project";
import { differenceInDays, set } from "date-fns";
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
    const { todo, progress, done, suspended, canceled } = React.useMemo<
        Record<Task["_status"], Task[]>
    >(() => {
        const statusGroups: Record<Task["_status"], Task[]> = {
            todo: [],
            progress: [],
            done: [],
            suspended: [],
            canceled: [],
        };

        tasks.forEach((task) => {
            task.timeline.from = set(task.timeline.from, {
                hours: 23,
                minutes: 59,
                seconds: 59,
            });

            statusGroups[task._status]?.push(task);
        });

        return statusGroups;
    }, [tasks]);

    return (
        <>
            <KanbanLayout className="px-0">
                <KanbanColumn className="space-y-4">
                    <KanbanColumnTitle className="capitalize">
                        à faire
                    </KanbanColumnTitle>

                    {todo.map((task, idx) => (
                        <TodoCard key={idx} task={task} />
                    ))}
                </KanbanColumn>
                <>
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
                </>
            </KanbanLayout>
            <pre>{JSON.stringify(tasks, null, 2)}</pre>
        </>
    );
};

const TodoCard = ({ task }) => {
    return (
        <KanbanCard className="space-y-2.5">
            <div className="flex items-start justify-between gap-2">
                <KanbanCardTitle>{task.name}</KanbanCardTitle>
                <Button variant="ghost" size="sm">
                    <EllipsisVertical className="shrink-0 h-5 w-5" />
                </Button>
            </div>

            <KanbanCardDescription text={task.description} />

            <div className="flex items-end justify-between gap-2">
                <div className="space-y-1">
                    <span>
                        {`${task.users.length} assigné${
                            task.users.length > 1 ? "s" : ""
                        }`}{" "}
                    </span>
                    <div className="flex items-center -space-x-1 5">
                        {task.users.map((u) => (
                            <UserAvatar key={u.uuid} user={u} />
                        ))}
                    </div>
                </div>

                <Badge variant="indigo">
                    {differenceInDays(task.timeline.from, new Date())}
                    {" jours restants"}
                </Badge>
            </div>
        </KanbanCard>
    );
};

// @ts-ignore
Kanban.layout = (page) => (
    <AuthLayout>
        <WorkspaceLayout children={page} />
    </AuthLayout>
);

export default Kanban;

// <KanbanCard key={idx} className="space-y-2.5">
//     <div className="flex items-start justify-between gap-2">
//         <KanbanCardTitle>{task.name}</KanbanCardTitle>

//         <Button variant="ghost" size="sm">
//             <EllipsisVertical className="h-5 w-5" />
//         </Button>
//     </div>
//     <KanbanCardDescription text={task.description} />

//     <div className="flex items-end justify-between gap-2">
//         <div className="space-y-1">
//             <span>{task.users.length} assigné</span>
//             <div className="flex items-center -space-x-1.5">
//                 {task.users.map((user) => (
//                     <UserAvatar
//                         key={user.uuid}
//                         user={user}
//                     />
//                 ))}
//             </div>
//         </div>

//         <Badge variant="indigo">
//             {differenceInDays(
//                 task.timeline.from,
//                 new Date()
//             )}
//             {" jours restants"}
//         </Badge>
//     </div>
// </KanbanCard>
