import React from "react";
import { Task } from "@/types/project";
import {
    KanbanCard,
    KanbanCardDescription,
    KanbanCardTitle,
} from "@/Components/common/kanban";
import * as DropdownMenu from "@/Components/ui/dropdown-menu";
import { Check, CircleArrowRight, EllipsisVertical } from "lucide-react";
import { Button } from "@/Components/ui/button";
import UserAvatar from "@/Components/common/user-hover-avatar";
import { Badge } from "@/Components/ui/badge";

const DoneCard: React.FC<{ task: Task }> = ({ task }) => {
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
                    <DropdownMenu.DropdownMenuContent>
                        <DropdownMenu.DropdownMenuItem>
                            <CircleArrowRight className="h-4 w-4 mr-2" />
                            Voir la tâche
                        </DropdownMenu.DropdownMenuItem>
                    </DropdownMenu.DropdownMenuContent>
                </DropdownMenu.DropdownMenu>
            </div>

            <KanbanCardDescription text={task.description} />

            <div className="flex items-end justify-between gap-2">
                <div className="space-y-1">
                    <div className="flex items-center -space-x-1 5">
                        {task.users.map((u) => (
                            <UserAvatar key={u.uuid} user={u} />
                        ))}
                    </div>
                </div>

                <Badge variant="green" className="inline-flex items-center">
                    <Check className="h-4 w-4 mr-2" />
                    Faite
                </Badge>
            </div>
        </KanbanCard>
    );
};

export default DoneCard;
