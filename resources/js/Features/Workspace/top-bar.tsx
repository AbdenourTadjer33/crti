import React from "react";
import { Link } from "@inertiajs/react";

const Topbar: React.FC = () => {
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

                {/* DO SOME VERIFICATION HERE TO SEE IF THE CURRENT USER ACCESS SUGGESTED VERSIONS */}
                <Link
                    href={route(
                        "workspace.suggested.version.index",
                        route().params.project
                    )}
                    className="text-blue-700 hover:text-blue-600 hover:underline data-[active=true]:text-primary-700"
                    data-active={route().current(
                        "workspace.suggested.version.*"
                    )}
                >
                    #Version suggére
                </Link>
            </div>
        </div>
    );
};

export default Topbar;
