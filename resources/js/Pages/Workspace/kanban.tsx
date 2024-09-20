import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { Task } from "@/types/project";
import { set } from "date-fns";
import {
    KanbanColumn,
    KanbanColumnTitle,
    KanbanLayout,
} from "@/Components/common/kanban";
import WorkspaceLayout from "@/Layouts/workspace-layout";
import { Head } from "@inertiajs/react";
import TodoCard from "@/Features/Workspace/kanban/todo-card";
import ProgressCard from "@/Features/Workspace/kanban/progress-card";
import DoneCard from "@/Features/Workspace/kanban/done-card";
import SuspendedCard from "@/Features/Workspace/kanban/suspended-card";
import CanceledCard from "@/Features/Workspace/kanban/canceled-card";
import { cn } from "@/Utils/utils";

interface KanbanProps {
    tasks: Task[];
    can_use_kanban: boolean;
}

type TaskByStatus = Record<Task["_status"], Task[]>;

const Kanban: React.FC<KanbanProps> = ({ tasks, can_use_kanban }) => {
    const { todo, progress, done, suspended, canceled } =
        React.useMemo<TaskByStatus>(() => {
            const statusGroups: TaskByStatus = {
                todo: [],
                progress: [],
                done: [],
                suspended: [],
                canceled: [],
            };

            tasks.forEach((task) => {
                task.timeline.to = set(task.timeline.to, {
                    hours: 23,
                    minutes: 59,
                    seconds: 59,
                });

                statusGroups[task._status]?.push(task);
            });

            console.table(tasks);
            console.table(statusGroups);

            statusGroups.progress.sort(
                (a, b) =>
                    (a.timeline.to as Date).getTime() -
                    (b.timeline.to as Date).getTime()
            );

            return statusGroups;
        }, [tasks]);

    return (
        <KanbanLayout
            className={cn(
                "px-0",
                can_use_kanban ? "" : "opacity-50 pointer-events-none select-none"
            )}
        >
            <Head title="Tableau kanban" />

            <KanbanColumn className="space-y-4">
                <KanbanColumnTitle className="capitalize">
                    à faire
                </KanbanColumnTitle>

                {todo.map((task, idx) => (
                    <TodoCard key={idx} task={task} />
                ))}
            </KanbanColumn>

            <KanbanColumn className="space-y-4">
                <KanbanColumnTitle className="capitalize">
                    En cours
                </KanbanColumnTitle>

                {progress.map((task, idx) => (
                    <ProgressCard key={idx} task={task} />
                ))}
            </KanbanColumn>

            <KanbanColumn className="space-y-4">
                <KanbanColumnTitle className="capitalize">
                    faite
                </KanbanColumnTitle>

                {done.map((task, idx) => (
                    <DoneCard key={idx} task={task} />
                ))}
            </KanbanColumn>

            <KanbanColumn className="space-y-4">
                <KanbanColumnTitle className="capitalize">
                    Suspendu
                </KanbanColumnTitle>

                {suspended.map((task, idx) => (
                    <SuspendedCard key={idx} task={task} />
                ))}
            </KanbanColumn>

            <KanbanColumn className="space-y-4">
                <KanbanColumnTitle className="capitalize">
                    Annulé
                </KanbanColumnTitle>

                {canceled.map((task, idx) => (
                    <CanceledCard key={idx} task={task} />
                ))}
            </KanbanColumn>
        </KanbanLayout>
    );
};

// @ts-ignore
Kanban.layout = (page) => (
    <AuthLayout>
        <WorkspaceLayout children={page} />
    </AuthLayout>
);

export default Kanban;
