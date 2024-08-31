import UserAvatar from "@/Components/common/user-hover-avatar";
import { Badge } from "@/Components/ui/badge";
import { Indicator } from "@/Components/ui/indicator";
import { Text } from "@/Components/ui/paragraph";
import { User } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { ThumbsUp } from "lucide-react";

interface CommentCardProps {
    user: Pick<User, "uuid" | "name" | "email" >;
    isPresident: boolean,
}
const CommentCard: React.FC<CommentCardProps> = ({ user, isPresident }) => {
    return (
        <div className="p-4">
            <div className="flex items-start space-x-2">
                <UserAvatar user={user} />
                <div className="space-y-2">
                    <div>
                        <div className="flex items-center gap-1">
                            <p className="text-sm font-medium leading-none flex">
                                {user.name}
                            </p>
                                {isPresident && (
                                    <Badge
                                        variant="blue"
                                        size="sm"
                                    >
                                        Président
                                    </Badge>
                                )}
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="space-y-1">
                        <Text className="flex items-center gap-2 text-gray-800 font-medium">
                            <Indicator color={user.isFavorable} />
                            {user.isFavorable
                                ? "Avis favorable"
                                : "Avis Défavorable"}
                        </Text>
                        <Text className="text-base text-gray-700">
                            {user.comment}
                        </Text>
                        <div className="flex justify-end">
                            <Text classID="text-sm">
                                {formatDistanceToNow(user.updatedAt, {
                                    addSuffix: true,
                                    locale: fr,
                                })}
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentCard;
