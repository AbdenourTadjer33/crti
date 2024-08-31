import React from "react";
import { Button, buttonVariants } from "@/Components/ui/button";
import { Link, usePage } from "@inertiajs/react";
import { ChevronsUpDown, Dot } from "lucide-react";
import { cn } from "@/Utils/utils";

const baseLinks = [
    {
        name: "workspace.index",
    },
    {
        name: "workspace.project",
        params: route().params.project,
        label: "Projet",
    },
    // {
    //     name: "#",
    //     label: "Calendrier",
    // },
    // { name: "#", label: "Kanban" },
];

const Topbar: React.FC = ({ additionalLinks = [] }) => {
    const { project } = usePage().props;
    const links = React.useMemo(
        () => [...baseLinks, ...additionalLinks],
        [additionalLinks.length]
    );

    return (
        <div className="sm:-mx-4 sm:-mt-4 -mx-2 -mt-2 p-3 border-b">
            <div className="flex items-center gap-4">
                <Link
                    href={route("workspace.index")}
                    className="text-blue-700 hover:text-blue-600 hover:underline data-[active=true]:text-primary-700"
                >
                    Tous les projet
                </Link>

                <Link
                    href={route("workspace.project", route().params.project)}
                    className="text-blue-700 hover:text-blue-600 hover:underline data-[active=true]:text-primary-700"
                    data-active={route().current("workspace.project")}
                >
                    Projet
                </Link>

                <Link
                    href={route("workspace.calendar", route().params.project)}
                    className="text-blue-700 hover:text-blue-600 hover:underline data-[active=true]:text-primary-700"
                    data-active={route().current("workspace.calendar")}
                >
                    Calendrier
                </Link>

                <Link
                    href={route("workspace.kanban", route().params.project)}
                    className="text-blue-700 hover:text-blue-600 hover:underline data-[active=true]:text-primary-700"
                    data-active={route().current("workspace.kanban")}
                >
                    Kanban
                </Link>
            </div>
        </div>
    );
};

export default Topbar;
