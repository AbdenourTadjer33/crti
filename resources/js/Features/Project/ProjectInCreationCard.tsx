import React from "react";
import { fr } from "date-fns/locale";
import { differenceInHours, format, formatDistanceToNow } from "date-fns";
import { Link } from "@inertiajs/react";
import { Text } from "@/Components/ui/paragraph";
import { ArrowRightCircle, Dot } from "lucide-react";
import { BaseProject } from "@/types/project";
import * as Tooltip from "@/Components/ui/tooltip";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";

const ProjectInCreationCard: React.FC<{ project: BaseProject }> = ({
    project,
}) => {
    const { code, division, createdAt } = project;
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
            className="group px-4 py-3 block h-full w-full border-2 border-gray-200 dark:border-gray-500 hover:border-primary-700 dark:hover:border-primary-600 transition duration-150 rounded-md"
        >
            <div className="flex items-center justify-between gap-4 h-full">
                <div className="space-y-2">
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-200">
                        <Tooltip.TooltipProvider>
                            <Tooltip.Tooltip>
                                <Tooltip.TooltipTrigger>
                                    <span className="font-medium">
                                        {division.abbr}
                                    </span>
                                </Tooltip.TooltipTrigger>
                                <Tooltip.TooltipContent>
                                    {division.name}
                                </Tooltip.TooltipContent>
                            </Tooltip.Tooltip>
                        </Tooltip.TooltipProvider>
                        <Dot className="h-6 w-6 text-gray-800 dark:text-gray-200" />
                        <span className="font-medium">{code}</span>
                    </p>
                    <Badge size="xs">En cours de création</Badge>
                    <Tooltip.TooltipProvider>
                        <Tooltip.Tooltip>
                            <Tooltip.TooltipTrigger>
                                <Text>{`Créer ${relativeTime}`}</Text>
                            </Tooltip.TooltipTrigger>
                            <Tooltip.TooltipContent>
                                {format(createdAt, "dd-MM-yyy HH:mm")}
                            </Tooltip.TooltipContent>
                        </Tooltip.Tooltip>
                    </Tooltip.TooltipProvider>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:text-primary-700 dark:group-hover:text-primary-500 group-hover:bg-gray-100 dark:group-hover:bg-gray-700"
                >
                    <ArrowRightCircle className="shrink-0 h-6 w-6 duration-75" />
                </Button>
            </div>
        </Link>
    );
};

export default ProjectInCreationCard;
