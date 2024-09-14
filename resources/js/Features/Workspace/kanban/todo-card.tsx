import React from "react";
import {
    KanbanCard,
    KanbanCardDescription,
    KanbanCardTitle,
} from "@/Components/common/kanban";
import UserAvatar from "@/Components/common/user-hover-avatar";
import { differenceInDays, format, formatDistanceToNow, set } from "date-fns";
import { CircleArrowRight, Clock, EllipsisVertical, Play } from "lucide-react";
import { Button, buttonVariants } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Task } from "@/types/project";
import * as DropdownMenu from "@/Components/ui/dropdown-menu";
import { router } from "@inertiajs/react";
import { fr } from "date-fns/locale";
import { capitalize } from "@/Utils/helper";
import * as AlertDialog from "@/Components/ui/alert-dialog";

const TodoCard: React.FC<{ task: Task }> = ({ task }) => {
    const [confirmBegin, setConfirmBegin] = React.useState(false);

    const startDate = React.useMemo(
        () => set(task.timeline.from, { hours: 8 }),
        [task.timeline.from]
    );
    const isStartingSoon = React.useMemo(() => {
        const daysBeforeStart = differenceInDays(startDate, new Date());
        return daysBeforeStart < 10 && daysBeforeStart >= 0;
    }, [startDate]);

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
                    variant="blue"
                    className="inline-flex items-center ms-auto"
                >
                    <Clock className="h-4 w-4 mr-2" />
                    {isStartingSoon
                        ? capitalize(
                              formatDistanceToNow(startDate, {
                                  locale: fr,
                                  addSuffix: true,
                              })
                          )
                        : format(startDate, "dd-MM-yyyy")}
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
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AlertDialog.AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialog.AlertDialogContent
            className="max-w-2xl"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <AlertDialog.AlertDialogHeader>
                    <AlertDialog.AlertDialogTitle>
                        Confirmer le Démarrage de la Tâche
                    </AlertDialog.AlertDialogTitle>
                    <AlertDialog.AlertDialogDescription>
                        Êtes-vous sûr de vouloir démarrer cette tâche ? Cette
                        action ne peut pas être annulée.
                    </AlertDialog.AlertDialogDescription>
                </AlertDialog.AlertDialogHeader>
                <AlertDialog.AlertDialogFooter>
                    <AlertDialog.AlertDialogCancel disabled={processing}>
                        Annuler
                    </AlertDialog.AlertDialogCancel>
                    <AlertDialog.AlertDialogAction
                        className={buttonVariants({ variant: "primary" })}
                        disabled={processing}
                        onClick={start}
                    >
                        Démarrer
                    </AlertDialog.AlertDialogAction>
                </AlertDialog.AlertDialogFooter>
            </AlertDialog.AlertDialogContent>
        </AlertDialog.AlertDialog>
    );
};

export default TodoCard;
