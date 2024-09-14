import React from "react";
import { Task } from "@/types/project";
import {
    KanbanCard,
    KanbanCardDescription,
    KanbanCardTitle,
} from "@/Components/common/kanban";
import {
    CircleArrowRight,
    CircleCheckBig,
    Clock,
    EllipsisVertical,
    FileText,
    Pause,
    X,
} from "lucide-react";
import { Button, buttonVariants } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { differenceInDays, isAfter } from "date-fns";
import UserAvatar from "@/Components/common/user-hover-avatar";
import * as DropdownMenu from "@/Components/ui/dropdown-menu";
import { router, useForm } from "@inertiajs/react";
import { Textarea } from "@/Components/ui/textarea";
import { InputError } from "@/Components/ui/input-error";
import { Label } from "@/Components/ui/label";
import * as AlertDialog from "@/Components/ui/alert-dialog";

const ProgressCard: React.FC<{ task: Task }> = ({ task }) => {
    const [confirmEnd, setConfirmEnd] = React.useState(false);
    const [confirmSuspension, setConfirmSuspension] = React.useState(false);
    const [confirmCancellation, setConfirmCancellation] = React.useState(false);

    const isOverdue = React.useMemo(
        () => isAfter(new Date(), task.timeline.to),
        [task.timeline.to]
    );

    const daysDifference = React.useMemo(() => {
        return isOverdue
            ? differenceInDays(new Date(), task.timeline.to)
            : differenceInDays(task.timeline.to, new Date());
    }, [isOverdue, task.timeline.to]);

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
                            <CircleArrowRight className="h-4 w-4 mr-2" />
                            Voir la tâche
                        </DropdownMenu.DropdownMenuItem>
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
                    task={task}
                    open={confirmEnd}
                    onOpenChange={setConfirmEnd}
                />

                <ConfirmCancellationDialog
                    task={task}
                    open={confirmCancellation}
                    onOpenChange={setConfirmCancellation}
                />

                <ConfirmSuspensionDialog
                    task={task}
                    open={confirmSuspension}
                    onOpenChange={setConfirmSuspension}
                />
            </div>

            <KanbanCardDescription text={task.description} />

            <div className="flex items-end justify-between flex-wrap gap-2">
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

                <Badge
                    variant={isOverdue ? "red" : "yellow"}
                    className="inline-flex items-center ms-auto"
                >
                    <Clock className="h-4 w-4 mr-2" />
                    {daysDifference === 0
                        ? isOverdue
                            ? "Échéance dépassée (retard)"
                            : "Échéance aujourd'hui"
                        : isOverdue
                        ? `${daysDifference} ${
                              daysDifference === 1
                                  ? "jour de retard"
                                  : "jours de retard"
                          }`
                        : `${daysDifference} ${
                              daysDifference === 1
                                  ? "jour restant"
                                  : "jours restants"
                          }`}
                </Badge>
            </div>
        </KanbanCard>
    );
};

interface ConfirmDialogProps {
    task: Task;
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmEndDialog: React.FC<ConfirmDialogProps> = ({
    task,
    open,
    onOpenChange,
}) => {
    const [processing, setProcessing] = React.useState(false);

    const end = () => {
        const endpoint = route("project.task.end", {
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
                        Terminer la tâche {task.name}
                    </AlertDialog.AlertDialogTitle>
                    <AlertDialog.AlertDialogDescription>
                        Êtes-vous prêt à marquer cette tâche comme terminée ?
                        Une fois terminée, aucune autre modification ne peut
                        être apportée à la tâche. Assurez-vous que tous les
                        travaux sont finalisés avant de confirmer.
                    </AlertDialog.AlertDialogDescription>
                </AlertDialog.AlertDialogHeader>
                <AlertDialog.AlertDialogFooter>
                    <AlertDialog.AlertDialogCancel disabled={processing}>
                        Annuler
                    </AlertDialog.AlertDialogCancel>
                    <AlertDialog.AlertDialogAction
                        className={buttonVariants({ variant: "primary" })}
                        disabled={processing}
                        onClick={end}
                    >
                        Terminer
                    </AlertDialog.AlertDialogAction>
                </AlertDialog.AlertDialogFooter>
            </AlertDialog.AlertDialogContent>
        </AlertDialog.AlertDialog>
    );
};

const ConfirmCancellationDialog: React.FC<ConfirmDialogProps> = ({
    task,
    open,
    onOpenChange,
}) => {
    const { data, setData, processing, post, errors } = useForm({ reason: "" });

    const cancel = (e: React.FormEvent) => {
        e.preventDefault();

        const endpoint = route("project.task.cancel", {
            project: route().params.project,
            task: task.id,
        });

        post(endpoint, {
            onSuccess: () => onOpenChange(false),
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AlertDialog.AlertDialog
            open={open}
            onOpenChange={(o) => onOpenChange(processing ? false : o)}
        >
            <AlertDialog.AlertDialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="max-w-2xl"
            >
                <AlertDialog.AlertDialogHeader>
                    <AlertDialog.AlertDialogTitle>
                        Annuler la tâche {task.name}
                    </AlertDialog.AlertDialogTitle>
                    <AlertDialog.AlertDialogDescription>
                        Êtes-vous sûr de vouloir annuler cette tâche ? Une fois
                        annulée, la tâche ne peut pas être reprise. Veuillez
                        fournir une raison d'annulation, et celle-ci sera
                        enregistrée dans l'historique des tâches.
                    </AlertDialog.AlertDialogDescription>
                </AlertDialog.AlertDialogHeader>

                <form onSubmit={cancel} className="sm:space-y-6 space-y-4">
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

                    <AlertDialog.AlertDialogFooter>
                        <AlertDialog.AlertDialogCancel
                            type="button"
                            disabled={processing}
                        >
                            Annuler
                        </AlertDialog.AlertDialogCancel>
                        <AlertDialog.AlertDialogAction
                            type="submit"
                            className={buttonVariants({ variant: "primary" })}
                            disabled={processing}
                        >
                            Confirmer
                        </AlertDialog.AlertDialogAction>
                    </AlertDialog.AlertDialogFooter>
                </form>
            </AlertDialog.AlertDialogContent>
        </AlertDialog.AlertDialog>
    );
};

const ConfirmSuspensionDialog: React.FC<ConfirmDialogProps> = ({
    task,
    open,
    onOpenChange,
}) => {
    const { data, setData, post, processing, errors } = useForm({ reason: "" });

    const suspend = (e: React.FormEvent) => {
        e.preventDefault();

        const endpoint = route("project.task.suspend", {
            project: route().params.project,
            task: task.id,
        });

        post(endpoint, {
            onSuccess: () => onOpenChange(false),
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AlertDialog.AlertDialog
            open={open}
            onOpenChange={(o) => onOpenChange(processing ? false : o)}
        >
            <AlertDialog.AlertDialogContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="max-w-2xl"
            >
                <AlertDialog.AlertDialogHeader>
                    <AlertDialog.AlertDialogTitle>
                        Suspendre la tâche {task.name}
                    </AlertDialog.AlertDialogTitle>
                    <AlertDialog.AlertDialogDescription>
                        Êtes-vous sûr de vouloir suspendre cette tâche ? En la
                        suspendant, elle sera mise en attente et ne sera plus
                        active jusqu'à ce que vous décidiez de la reprendre.
                        Veuillez indiquer la raison de la suspension. Cette
                        action peut être réversible, mais assurez-vous que vous
                        avez bien noté toutes les informations nécessaires avant
                        de procéder.
                    </AlertDialog.AlertDialogDescription>
                </AlertDialog.AlertDialogHeader>

                <form onSubmit={suspend} className="sm:space-y-6 space-y-4">
                    <div className="space-y-1">
                        <Label required>Raison</Label>
                        <Textarea
                            value={data.reason}
                            onChange={(e) => setData("reason", e.target.value)}
                            placeholder="Veuillez fournir une raison pour la suspension de cette tâche."
                            className="max-h-80"
                        />
                        <InputError message={errors.reason} />
                    </div>

                    <AlertDialog.AlertDialogFooter>
                        <AlertDialog.AlertDialogCancel
                            type="button"
                            disabled={processing}
                        >
                            Annuler
                        </AlertDialog.AlertDialogCancel>
                        <AlertDialog.AlertDialogAction
                            type="submit"
                            className={buttonVariants({ variant: "primary" })}
                            disabled={processing}
                        >
                            Confirmer
                        </AlertDialog.AlertDialogAction>
                    </AlertDialog.AlertDialogFooter>
                </form>
            </AlertDialog.AlertDialogContent>
        </AlertDialog.AlertDialog>
    );
};

export default ProgressCard;
