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

interface UserAvatarProps {
    user: Pick<User, "uuid" | "name" | "email">;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user }) => {
    return (
        <HoverCard>
            <HoverCardTrigger className="select-none">
                <Avatar>
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto">
                <div className="flex justify-between space-x-4">
                    <Avatar>
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
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
