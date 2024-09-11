import React from "react";
import {
    KanbanCard,
    KanbanCardDescription,
    KanbanCardTitle,
} from "@/Components/common/kanban";
import UserAvatar from "@/Components/common/user-hover-avatar";
import { differenceInDays } from "date-fns";
import { CircleArrowRight, Clock, EllipsisVertical, Play } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Task } from "@/types/project";
import * as DropdownMenu from "@/Components/ui/dropdown-menu";
import * as Dialog from "@/Components/ui/dialog";
import { router } from "@inertiajs/react";

const TodoCard: React.FC<{ task: Task }> = ({ task }) => {
    const [confirmBegin, setConfirmBegin] = React.useState(false);

    return (
        <KanbanCard className="space-y-2.5">
            <div className="flex items-start justify-between gap-2">
                <KanbanCardTitle>{task.name}</KanbanCardTitle>
                <DropdownMenu.DropdownMenu modal={false}>
                    <DropdownMenu.DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <EllipsisVertical className="shrink-0 h-5 w-5" />
                        </Button>
                    </DropdownMenu.DropdownMenuTrigger>
                    <DropdownMenu.DropdownMenuContent>
                        <DropdownMenu.DropdownMenuItem
                            onClick={() => setConfirmBegin(true)}
                        >
                            <CircleArrowRight className="h-4 w-4 mr-2" />
                            Voir la tâche
                        </DropdownMenu.DropdownMenuItem>
                        <DropdownMenu.DropdownMenuItem
                            onClick={() => setConfirmBegin(true)}
                        >
                            <Play className="h-4 w-4 mr-2" />
                            Démarrer la tâche
                        </DropdownMenu.DropdownMenuItem>
                    </DropdownMenu.DropdownMenuContent>
                </DropdownMenu.DropdownMenu>

                <ConfirmStartDialog
                    taskId={task.id}
                    open={confirmBegin}
                    onOpenChange={setConfirmBegin}
                />
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

                <Badge variant="indigo" className="inline-flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {differenceInDays(task.timeline.from, new Date())}
                    {" jours restants"}
                </Badge>
            </div>
        </KanbanCard>
    );
};

const ConfirmStartDialog: React.FC<{
    taskId: string;
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ taskId, open, onOpenChange }) => {
    const [processing, setProcessing] = React.useState(false);

    const start = () => {
        const endpoint = route("project.task.start", {
            project: route().params.project,
            task: taskId,
        });
        router.visit(endpoint, {
            method: "post",
            onBefore: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog.Dialog open={open} onOpenChange={onOpenChange}>
            <Dialog.DialogContent className="space-y-4">
                <Dialog.DialogHeader>
                    <Dialog.DialogTitle>
                        Êtes-vous sur de vouloir démarrer la tâche
                    </Dialog.DialogTitle>
                    <Dialog.DialogDescription>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ab quia dolorem deserunt nemo aperiam? Aperiam nesciunt
                        facere nisi, eius necessitatibus quisquam fugit animi
                        fugiat odio illo aliquid commodi possimus mollitia.
                    </Dialog.DialogDescription>
                </Dialog.DialogHeader>
                <div className="flex items-center gap-2">
                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="primary"
                        className="w-full"
                        onClick={start}
                        disabled={processing}
                    >
                        Démarrer
                    </Button>
                </div>
            </Dialog.DialogContent>
        </Dialog.Dialog>
    );
};

export default TodoCard;
