import React from "react";
import { Task } from "@/types/project";
import {
    KanbanCard,
    KanbanCardDescription,
    KanbanCardTitle,
} from "@/Components/common/kanban";
import * as DropdownMenu from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { CircleArrowRight, Clock, EllipsisVertical } from "lucide-react";
import * as Dialog from "@/Components/ui/dialog";
import { router } from "@inertiajs/react";
import UserAvatar from "@/Components/common/user-hover-avatar";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";

const SuspendedCard: React.FC<{ task: Task }> = ({ task }) => {
    const [confirmResume, setConfirmResum] = React.useState(false);

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
                    <DropdownMenu.DropdownMenuContent
                        onCloseAutoFocus={(e) => e.preventDefault()}
                        loop
                    >
                        <DropdownMenu.DropdownMenuItem>
                            <CircleArrowRight className="h-4 w-4 mr-2" />
                            Voir la tâche
                        </DropdownMenu.DropdownMenuItem>
                        <DropdownMenu.DropdownMenuItem
                            onClick={() => setConfirmResum(true)}
                        >
                            Reprendre la tâche
                        </DropdownMenu.DropdownMenuItem>
                    </DropdownMenu.DropdownMenuContent>
                </DropdownMenu.DropdownMenu>

                <ConfirmResumDialog
                    taskId={task.id}
                    open={confirmResume}
                    onOpenChange={setConfirmResum}
                />
            </div>

            <KanbanCardDescription text={task.description} />

            <div className="flex items-end justify-between gap-2">
                <div className="space-y-1">
                    <span>
                        {`${task.users.length} assigné${
                            task.users.length > 1 ? "s" : ""
                        }`}
                    </span>
                    <div className="flex items-center -space-x-1.5">
                        {task.users.map((u) => (
                            <UserAvatar key={u.uuid} user={u} />
                        ))}
                    </div>
                </div>

                <Badge variant="dark" className="inline-flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {`suspended at ${format(task.suspendedAt, "dd MM yyy")}`}
                </Badge>
            </div>
        </KanbanCard>
    );
};

const ConfirmResumDialog: React.FC<{
    taskId: string;
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ taskId, open, onOpenChange }) => {
    const [processing, setProcessing] = React.useState(false);

    const resum = () => {
        const endpoint = route("project.task.resum", {
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
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <Dialog.Dialog open={open} onOpenChange={onOpenChange}>
            <Dialog.DialogContent
                className="space-y-4"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <Dialog.DialogHeader>
                    <Dialog.DialogTitle>
                        Redémarrer la tâche suspendue
                    </Dialog.DialogTitle>
                    <Dialog.DialogDescription>
                        Êtes-vous sûr de vouloir reprendre cette tâche ? La
                        tâche reprendra à partir de la date actuelle.
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
                        onClick={resum}
                    >
                        Redémarrer
                    </Button>
                </div>
            </Dialog.DialogContent>
        </Dialog.Dialog>
    );
};

export default SuspendedCard;
