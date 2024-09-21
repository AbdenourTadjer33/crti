import UserAvatar from "@/Components/common/user-hover-avatar";
import { Indicator } from "@/Components/ui/indicator";
import { Text } from "@/Components/ui/paragraph";
import { User } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface CommentCardProps {
    user: Pick<User, "uuid" | "name" | "email">;
    isPresident: boolean;
}

const CommentCard: React.FC<CommentCardProps> = ({ user, isPresident }) => {
    return (
        <div className="p-4 flex items-start space-x-2 ">
            <UserAvatar user={user} />
            <div className="flex-1 space-y-2">
                <div>
                    <div className="flex items-center gap-1">
                        <p className="text-sm font-medium leading-none flex">
                            {user.name}
                        </p>
                        {isPresident && <strong>(Président)</strong>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-200">{user.email}</p>
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
                        <Text className="text-sm">
                            {formatDistanceToNow(user.updatedAt, {
                                addSuffix: true,
                                locale: fr,
                            })}
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentCard;
