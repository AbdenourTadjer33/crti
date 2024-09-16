import React from "react";
import { Link } from "@inertiajs/react";
import {
    ChevronLeft,
    PieChart,
    MonitorCog,
    SquareGanttChart,
    Scale,
    FolderKanban,
} from "lucide-react";
import { addAttributesToChildren, cn } from "@/Utils/utils";
import { Button } from "@/Components/ui/button";
import { RouteName } from "ziggy-js";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    sidebarState?: "open" | "close" | "hidden" | "open-hover";
    setSidebarState?: React.Dispatch<
        React.SetStateAction<"open" | "close" | "hidden" | "open-hover">
    >;
    hidder?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
    className,
    sidebarState,
    setSidebarState,
    hidder = true,
}) => {
    const items = React.useMemo(
        () => [
            {
                routeName: "app",
                label: "Dashboard",
                icon: <PieChart className="h-6 w-6" />,
                can: true,
            },
            {
                routeName: "workspace.index",
                label: "Espace de travail",
                icon: <FolderKanban className="h-6 w-6" />,
                can: true,
            },
            {
                routeName: "project.index",
                label: "Projets",
                icon: <SquareGanttChart className="h-6 w-6" />,
                can: true,
            },
            {
                routeName: "board.index",
                label: "Espace commission",
                icon: <Scale className="h-6 w-6" />,
                can: true,
            },
            {
                routeName: "manage.index",
                label: "Centre d'administration",
                icon: <MonitorCog className="h-6 w-6" />,
                can: true,
            },
        ],
        []
    );

    return (
        <aside
            className={cn(className)}
            data-state={sidebarState === "open-hover" ? "open" : sidebarState}
        >
            <div
                className="overflow-y-auto p-2"
                onPointerEnter={() => {
                    if (sidebarState !== "close") return;
                    setSidebarState && setSidebarState("open-hover");
                }}
                onPointerLeave={() => {
                    if (sidebarState !== "open-hover") return;

                    setSidebarState && setSidebarState("close");
                }}
            >
                {addAttributesToChildren(
                    <ul className="space-y-2">
                        {items.map(
                            (item, idx) =>
                                item.can && (
                                    <SidebarItem
                                        key={idx}
                                        routeName={item.routeName}
                                        icon={item.icon}
                                        label={item.label}
                                    />
                                )
                        )}
                    </ul>,
                    { "data-state": sidebarState }
                )}
            </div>
            {hidder && (
                <Button
                    variant="ghost"
                    className="absolute bottom-2 right-2 p-2 rounded-full inline-flex"
                    onClick={() => setSidebarState && setSidebarState("hidden")}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
            )}
        </aside>
    );
};

const SidebarToggler: React.FC<
    Required<Pick<SidebarProps, "sidebarState" | "setSidebarState">>
> = ({ sidebarState, setSidebarState }) => {
    const sidebarTogglerFn = () =>
        setSidebarState((prev) => {
            if (prev === "hidden") return "close";
            if (prev === "open") return "close";
            return "open";
        });

    return (
        <button
            type="button"
            className="group rounded-full absolute top-0 data-[state=open]:left-64 data-[sidebar=open]:animate-in data-[sidebar=open]:slide-in-from-left-0 data-[state=close]:left-16 data-[sidebar=close]:animate-out data-[sidebar=close]:slide-out-to-right-0 duration-200"
            data-state={sidebarState}
            onClick={sidebarTogglerFn}
        >
            <div className="flex h-6 w-4 flex-col items-center">
                <div
                    data-state={sidebarState}
                    className="h-3 w-1 rounded-full bg-gray-500 dark:bg-gray-300 group-hover:bg-primary-600 dark:group-hover:bg-primary-50 duration-100 translate-y-[0.15rem] data-[state=open]:group-hover:-rotate-[-15deg] group-hover:rotate-[-15deg]"
                />
                <div
                    data-state={sidebarState}
                    className="h-3 w-1 rounded-full bg-gray-500 dark:bg-gray-300 group-hover:bg-primary-600 dark:group-hover:bg-primary-50 duration-100 -translate-y-[0.15rem] data-[state=open]:group-hover:-rotate-[15deg] group-hover:rotate-[15deg]"
                />
            </div>
        </button>
    );
};

interface SidebarItemProps {
    routeName: RouteName;
    routeParams?: any;
    icon: React.ReactNode;
    label: string;
    rest?: any;
}

const SidebarItem: React.FC<SidebarItemProps> = (props) => {
    const { routeName, routeParams = {}, icon, label, ...rest } = props;
    return (
        // @ts-ignore
        <li data-state={rest["data-state"]}>
            <Link
                href={route(routeName, routeParams)}
                className={cn(
                    "flex items-center data-[state=close]:justify-center p-2 text-base font-medium text-gray-600 rounded-lg dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 duration-100 group cursor-pointer",
                    "data-[active=true]:bg-gray-200/75 data-[active=true]:dark:bg-gray-700/75"
                )}
                // @ts-ignore
                data-state={rest["data-state"]}
                data-active={route().current(routeName, routeParams)}
            >
                <div
                    className={cn(
                        "group-hover:text-primary-700 dark:group-hover:text-primary-600 duration-300",
                        "data-[active=true]:text-primary-700 dark:data-[active=true]:text-primary-600"
                    )}
                    // @ts-ignore
                    data-state={rest["data-state"]}
                    data-active={route().current(routeName, routeParams)}
                >
                    {icon}
                </div>
                <span
                    className="data-[state=close]:hidden data-[state=open]:animate-in data-[state=open]:slide-in-from-left-5 duration-150 ml-3"
                    // @ts-ignore
                    data-state={rest["data-state"]}
                    data-active={route().current(routeName, routeParams)}
                >
                    {label}
                </span>
            </Link>
        </li>
    );
};

export { Sidebar, SidebarToggler };
