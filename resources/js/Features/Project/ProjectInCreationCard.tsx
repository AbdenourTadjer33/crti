import React from "react";
import { fr } from "date-fns/locale";
import { differenceInHours, format, formatDistanceToNow } from "date-fns";
import { Link } from "@inertiajs/react";
import { Text } from "@/Components/ui/paragraph";
import { Dot, GitMerge } from "lucide-react";
import { BaseProject } from "@/types/project";
import * as Tooltip from "@/Components/ui/tooltip";

const ProjectInCreationCard: React.FC<{ project: BaseProject }> = ({
    project,
}) => {
    const { code, status, division, createdAt, unit } = project;
    const href = route("project.version.create", code);

    const [relativeTime, setRelativeTime] = React.useState(
        formatDistanceToNow(project.createdAt, {
            addSuffix: true,
            locale: fr,
        })
    );

    React.useEffect(() => {
        const updateRelativeTime = () => {
            setRelativeTime(
                formatDistanceToNow(project.createdAt, {
                    addSuffix: true,
                    locale: fr,
                })
            );
        };

        const resourceCreatedAt = new Date(project.createdAt);

        const interval = setInterval(() => {
            updateRelativeTime();

            const now = new Date();
            const isWithinOneHour =
                differenceInHours(now, resourceCreatedAt) < 1;

            if (!isWithinOneHour) {
                clearInterval(interval);
            }
        }, 60000);

        // Initial update
        updateRelativeTime();

        return () => clearInterval(interval);
    }, [createdAt]);

    return (
        <Link
            href={href}
            className="block p-4 space-y-2 bg-white rounded-lg border-2 border-gray-200 text-gray-950 hover:border-primary-700 hover:bg-gray-50 transition-all duration-150 cursor-pointer"
        >
            <div className="text-sm text-gray-500 inline-flex items-center">
                <Tooltip.TooltipProvider>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger>
                            <span className="font-medium">{unit.abbr}</span>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            {unit.name}
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                </Tooltip.TooltipProvider>
                <GitMerge className="h-4 w-4 mx-1.5 text-gray-800" />
                <Tooltip.TooltipProvider>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger>
                            <span className="font-medium">{division.abbr}</span>
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            {division.name}
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                </Tooltip.TooltipProvider>
                <Dot className="h-6 w-6 text-gray-800" />
                <span className="font-medium">{code}</span>
            </div>

            <Tooltip.TooltipProvider>
                <Tooltip.Tooltip>
                    <Tooltip.TooltipTrigger>
                        <Text>{`Créer ${relativeTime}`}</Text>
                    </Tooltip.TooltipTrigger>
                    <Tooltip.TooltipContent>
                        {format(createdAt, "dd-MM-yyy H:m")}
                    </Tooltip.TooltipContent>
                </Tooltip.Tooltip>
            </Tooltip.TooltipProvider>
        </Link>
    );
};

export default ProjectInCreationCard;
