import React from "react";
import {
    KanbanCard,
    KanbanCardDescription,
    KanbanCardTitle,
} from "@/Components/common/kanban";
import { Task } from "@/types/project";
import * as DropdownMenu from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { CircleArrowRight, Clock, EllipsisVertical } from "lucide-react";
import UserAvatar from "@/Components/common/user-hover-avatar";
import { Badge } from "@/Components/ui/badge";
import { format } from "date-fns";

const CanceledCard: React.FC<{ task: Task }> = ({ task }) => {
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
                    </DropdownMenu.DropdownMenuContent>
                </DropdownMenu.DropdownMenu>
            </div>

            <KanbanCardDescription text={task.description} />

            <div className="flex items-end justify-between gap-2">
                <div className="space-y-1">
                    <span>
                        {`${task.users.length} assigné${
                            task.users.length > 1 ? "s" : ""
                        }`}{" "}
                    </span>
                    <div className="flex items-center -space-x-1.5">
                        {task.users.map((u) => (
                            <UserAvatar key={u.uuid} user={u} />
                        ))}
                    </div>
                </div>

                <Badge variant="orange" className="inline-flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {`suspended at ${format(task.suspendedAt, "dd MM yyy")}`}
                </Badge>
            </div>
        </KanbanCard>
    );
};

export default CanceledCard;
