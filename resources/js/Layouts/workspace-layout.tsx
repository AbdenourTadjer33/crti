import React from "react";
import { useUser } from "@/Hooks/use-user";
import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/Utils/utils";
import { buttonVariants } from "@/Components/ui/button";

const WorkspaceLayout = ({ children }: React.PropsWithChildren) => {
    const { suggested_versions_count } = usePage<{
        suggested_versions_count?: number;
    }>().props;

    return (
        <div>
            <nav className="sm:-mx-4 sm:-mt-5 -mx-2 -mt-2 p-3 border-b bg-white flex items-center space-x-2">
                <Link
                    href={route("workspace.index")}
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "data-[active=true]:bg-gray-100"
                    )}
                >
                    Tous les projet
                </Link>

                <Link
                    href={route("workspace.project", route().params.project)}
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "data-[active=true]:bg-gray-100"
                    )}
                    data-active={route().current("workspace.project")}
                >
                    Projet
                </Link>

                {/* <Link
                    href={route("workspace.calendar", route().params.project)}
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "data-[active=true]:bg-gray-100"
                    )}
                    data-active={route().current("workspace.calendar")}
                >
                    Calendrier
                </Link> */}

                <Link
                    href={route("workspace.kanban", route().params.project)}
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "data-[active=true]:bg-gray-100"
                    )}
                    data-active={route().current("workspace.kanban")}
                >
                    Kanban
                </Link>

                {/* DO SOME VERIFICATION HERE TO SEE IF THE CURRENT USER ACCESS SUGGESTED VERSIONS */}

                {suggested_versions_count !== undefined && (
                    <Link
                        href={route(
                            "workspace.suggested.version.index",
                            route().params.project
                        )}
                        className={cn(
                            buttonVariants({
                                variant: "ghost",
                                size: "sm",
                            }),
                            "data-[active=true]:bg-gray-100"
                        )}
                        data-active={route().current(
                            "workspace.suggested.version.*"
                        )}
                    >
                        Version suggére ({suggested_versions_count})
                    </Link>
                )}
            </nav>

            <div className="pt-4">{children}</div>
        </div>
    );
};

export default WorkspaceLayout;
