import React from "react";
import { Task } from "@/types/project";
import {
    KanbanCard,
    KanbanCardDescription,
    KanbanCardTitle,
} from "@/Components/common/kanban";
import * as DropdownMenu from "@/Components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/Components/ui/button";
import { CircleArrowRight, EllipsisVertical, RefreshCcw } from "lucide-react";
import { router } from "@inertiajs/react";
import UserAvatar from "@/Components/common/user-hover-avatar";
import { Badge } from "@/Components/ui/badge";
import * as AlertDialog from "@/Components/ui/alert-dialog";

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
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Reprendre la tâche
                        </DropdownMenu.DropdownMenuItem>
                    </DropdownMenu.DropdownMenuContent>
                </DropdownMenu.DropdownMenu>

                <ConfirmResumDialog
                    task={task}
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
                        }`}{" "}
                    </span>
                    <div className="flex items-center -space-x-2">
                        {task.users.map((u) => (
                            <UserAvatar key={u.uuid} user={u} />
                        ))}
                    </div>
                </div>

                <Badge variant="orange" className="inline-flex items-center">
                    Suspendu
                </Badge>
            </div>
        </KanbanCard>
    );
};

const ConfirmResumDialog: React.FC<{
    task: Task;
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ task, open, onOpenChange }) => {
    const [processing, setProcessing] = React.useState(false);

    const resum = () => {
        const endpoint = route("project.task.resum", {
            project: route().params.project,
            task: task.id,
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
        <AlertDialog.AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialog.AlertDialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="max-w-2xl"
            >
                <AlertDialog.AlertDialogHeader>
                    <AlertDialog.AlertDialogTitle>
                        Redémarrer la tâche {task.name}
                    </AlertDialog.AlertDialogTitle>
                    <AlertDialog.AlertDialogDescription>
                        Êtes-vous sûr de vouloir reprendre cette tâche ? La
                        tâche reprendra à partir de la date actuelle.
                    </AlertDialog.AlertDialogDescription>
                </AlertDialog.AlertDialogHeader>
                <AlertDialog.AlertDialogFooter>
                    <AlertDialog.AlertDialogCancel disabled={processing}>
                        Annuler
                    </AlertDialog.AlertDialogCancel>
                    <AlertDialog.AlertDialogAction
                        className={buttonVariants({ variant: "primary" })}
                        disabled={processing}
                        onClick={resum}
                    >
                        Redémarrer
                    </AlertDialog.AlertDialogAction>
                </AlertDialog.AlertDialogFooter>
            </AlertDialog.AlertDialogContent>
        </AlertDialog.AlertDialog>
    );
};

export default SuspendedCard;
