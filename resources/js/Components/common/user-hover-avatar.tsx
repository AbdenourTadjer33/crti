import React from "react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "../ui/hover-card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { User } from "@/types";
import { getInitials } from "@/Utils/helper";
import { Text } from "../ui/paragraph";
import { cn } from "@/Utils/utils";

interface UserAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    user: Pick<User, "uuid" | "name" | "email">;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, className }) => {
    return (
        <HoverCard>
            <HoverCardTrigger className="select-none">
                <Avatar
                    className={cn(
                        "sm:h-10 sm:w-10 sm:text-base sm:font-normal h-8 w-8 text-sm font-medium",
                        className
                    )}
                >
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto">
                <div className="flex justify-between space-x-4">
                    <Avatar>
                        <AvatarFallback>
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                        <h4 className="text-sm font-semibold">{user.name}</h4>
                        <p className="text-sm">{user.email}</p>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default UserAvatar;
