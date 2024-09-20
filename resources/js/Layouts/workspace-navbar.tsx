import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/Utils/utils";
import { buttonVariants } from "@/Components/ui/button";

interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {}

const WorkspaceNavbar: React.FC<NavbarProps> = ({ className }) => {
    const { suggested_versions_count, can_access_suggested_versions } =
        usePage<{
            suggested_versions_count?: number;
            can_access_suggested_versions: boolean;
        }>().props;

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 h-14 px-2.5 flex items-center gap-2 bg-white dark:bg-gray-950 z-50 border-b dark:border-gray-800",
                className
            )}
        >
            <Link
                href={route("workspace.index")}
                className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "data-[active=true]:bg-gray-100 dark:data-[active=true]:bg-gray-700"
                )}
            >
                Tous les projet
            </Link>

            <Link
                href={route("workspace.project", route().params.project)}
                className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "data-[active=true]:bg-gray-100 dark:data-[active=true]:bg-gray-700"
                )}
                data-active={route().current("workspace.project")}
            >
                Projet
            </Link>

            <Link
                href={route("workspace.kanban", route().params.project)}
                className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "data-[active=true]:bg-gray-100 dark:data-[active=true]:bg-gray-700"
                )}
                data-active={route().current("workspace.kanban")}
            >
                Kanban
            </Link>

            {can_access_suggested_versions && (
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
                        "data-[active=true]:bg-gray-100 dark:data-[active=true]:bg-gray-700"
                    )}
                    data-active={route().current(
                        "workspace.suggested.version.*"
                    )}
                >
                    Version suggére ({suggested_versions_count})
                </Link>
            )}
        </nav>
    );
};

export default WorkspaceNavbar;
