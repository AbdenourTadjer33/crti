import React from "react";
import { Text } from "@/Components/ui/paragraph";
import { Project } from "@/types/project";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Heading } from "@/Components/ui/heading";

interface PreviousVersionCardProps {
    version: {
        name: string;
        reason: string;
        creator: Project["creator"];
        createdAt: string;
    };
}

const PreviousVersionCard: React.FC<PreviousVersionCardProps> = ({
    version,
}) => {
    const isFirstVersion = React.useMemo(() => true, []);

    return (
        <div className="p-2 border rounded shadow max-w-md w-full flex flex-col gap-2">
            <Heading level={5}>{version.name}</Heading>
            <Text className="text-sm">
                Suggéré par <strong>{version.creator.name}</strong>
            </Text>
            <div>
                <blockquote className="text-base italic font-medium text-gray-900 dark:text-white">
                    "{version.reason}"
                </blockquote>
            </div>
            <Text className="text-sm mt-auto text-end">
                {formatDistanceToNow(version.createdAt, {
                    locale: fr,
                    addSuffix: true,
                })}
            </Text>
        </div>
    );
};

export default PreviousVersionCard;
