import React from "react";
import { Task } from "@/types/project";
import {
    KanbanCard,
    KanbanCardDescription,
    KanbanCardTitle,
} from "@/Components/common/kanban";
import {
    CircleCheckBig,
    Clock,
    EllipsisVertical,
    FileText,
    Pause,
    X,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { differenceInDays } from "date-fns";
import UserAvatar from "@/Components/common/user-hover-avatar";
import * as DropdownMenu from "@/Components/ui/dropdown-menu";
import * as Dialog from "@/Components/ui/dialog";
import { router, useForm } from "@inertiajs/react";
import { Textarea } from "@/Components/ui/textarea";
import { InputError } from "@/Components/ui/input-error";
import { Label } from "@/Components/ui/label";

const ProgressCard: React.FC<{ task: Task }> = ({ task }) => {
    const [confirmEnd, setConfirmEnd] = React.useState(false);
    const [confirmSuspension, setConfirmSuspension] = React.useState(false);
    const [confirmCancellation, setConfirmCancellation] = React.useState(false);

    return (
        <KanbanCard className="space-y-2">
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
                            <FileText className="h-4 w-4 mr-2" />
                            Ajouter un rapport
                        </DropdownMenu.DropdownMenuItem>
                        <DropdownMenu.DropdownMenuItem
                            onClick={() => setConfirmEnd(true)}
                        >
                            <CircleCheckBig className="h-4 w-4 mr-2" />
                            Terminer la tâche
                        </DropdownMenu.DropdownMenuItem>
                        <DropdownMenu.DropdownMenuItem
                            onClick={() => setConfirmSuspension(true)}
                        >
                            <Pause className="h-4 w-4 mr-2" />
                            Suspendre la tâche
                        </DropdownMenu.DropdownMenuItem>
                        <DropdownMenu.DropdownMenuItem
                            onClick={() => setConfirmCancellation(true)}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Annuler la tâche
                        </DropdownMenu.DropdownMenuItem>
                    </DropdownMenu.DropdownMenuContent>
                </DropdownMenu.DropdownMenu>

                <ConfirmEndDialog
                    taskId={task.id}
                    open={confirmEnd}
                    onOpenChange={setConfirmEnd}
                />

                <ConfirmCancellationDialog
                    taskId={task.id}
                    open={confirmCancellation}
                    onOpenChange={setConfirmCancellation}
                />

                <ConfirmSuspensionDialog
                    taskId={task.id}
                    open={confirmSuspension}
                    onOpenChange={setConfirmSuspension}
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
                    {differenceInDays(task.timeline.to, task.timeline.from)}
                    {" jours restants"}
                </Badge>
            </div>
        </KanbanCard>
    );
};

interface ConfirmDialogProps {
    taskId: string;
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmEndDialog: React.FC<ConfirmDialogProps> = ({
    taskId,
    open,
    onOpenChange,
}) => {
    const [processing, setProcessing] = React.useState(false);

    const end = () => {
        const endpoint = route("project.task.end", {
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
                    <Dialog.DialogTitle>Terminer la tâche</Dialog.DialogTitle>
                    <Dialog.DialogDescription>
                        Êtes-vous prêt à marquer cette tâche comme terminée ?
                        Une fois terminée, aucune autre modification ne peut
                        être apportée à la tâche. Assurez-vous que tous les
                        travaux sont finalisés avant de confirmer.
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
                        onClick={end}
                        disabled={processing}
                    >
                        Terminer
                    </Button>
                </div>
            </Dialog.DialogContent>
        </Dialog.Dialog>
    );
};

const ConfirmCancellationDialog: React.FC<ConfirmDialogProps> = ({
    taskId,
    open,
    onOpenChange,
}) => {
    const { data, setData, processing, post, errors } = useForm({ reason: "" });

    const cancel = () => {
        const endpoint = route("project.task.cancel", {
            project: route().params.project,
            task: taskId,
        });

        post(endpoint, {
            onSuccess: () => onOpenChange(false),
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <Dialog.Dialog
            open={open}
            onOpenChange={(open) => {
                if (processing) {
                    onOpenChange(false);
                    return;
                }
                onOpenChange(open);
            }}
        >
            <Dialog.DialogContent
                className="space-y-4"
                classNames={{
                    content: "max-w-2xl",
                }}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <Dialog.DialogHeader>
                    <Dialog.DialogTitle>Annuler la tâche</Dialog.DialogTitle>
                    <Dialog.DialogDescription>
                        Êtes-vous sûr de vouloir annuler cette tâche ? Une fois
                        annulée, la tâche ne peut pas être reprise. Veuillez
                        fournir une raison d'annulation, et celle-ci sera
                        enregistrée dans l'historique des tâches.
                    </Dialog.DialogDescription>
                </Dialog.DialogHeader>
                <div className="space-y-1">
                    <Label required>Raison</Label>
                    <Textarea
                        value={data.reason}
                        onChange={(e) => setData("reason", e.target.value)}
                        placeholder="Veuillez fournir une raison pour l'annulation de cette tâche."
                        className="max-h-80"
                    />
                    <InputError message={errors.reason} />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="destructive"
                        className="w-full"
                        onClick={() => onOpenChange(false)}
                        disabled={processing}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        className="w-full"
                        onClick={cancel}
                        disabled={processing}
                    >
                        Confirmer
                    </Button>
                </div>
            </Dialog.DialogContent>
        </Dialog.Dialog>
    );
};

const ConfirmSuspensionDialog: React.FC<ConfirmDialogProps> = ({
    taskId,
    open,
    onOpenChange,
}) => {
    const { data, setData, post, processing, errors } = useForm({ reason: "" });

    const suspend = () => {
        const endpoint = route("project.task.suspend", {
            project: route().params.project,
            task: taskId,
        });

        post(endpoint, {
            onSuccess: () => onOpenChange(false),
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <Dialog.Dialog open={open} onOpenChange={onOpenChange}>
            <Dialog.DialogContent
                className="space-y-4"
                classNames={{
                    content: "max-w-2xl",
                }}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <Dialog.DialogHeader>
                    <Dialog.DialogTitle>
                        Êtes-vous sur de suspendre la tâche
                    </Dialog.DialogTitle>
                    <Dialog.DialogDescription>
                        Please provide a reason for suspending this task. The
                        task will remain suspended until resumed.
                    </Dialog.DialogDescription>
                </Dialog.DialogHeader>
                <div className="space-y-1">
                    <Label required>Raison</Label>
                    <Textarea
                        value={data.reason}
                        onChange={(e) => setData("reason", e.target.value)}
                    />
                    <InputError message={errors.reason} />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="destructive"
                        className="w-full"
                        disabled={processing}
                        onClick={() => onOpenChange(false)}
                    >
                        Annuler
                    </Button>
                    <Button
                        variant="primary"
                        className="w-full"
                        disabled={processing}
                        onClick={suspend}
                    >
                        Confirmer
                    </Button>
                </div>
            </Dialog.DialogContent>
        </Dialog.Dialog>
    );
};

export default ProgressCard;
