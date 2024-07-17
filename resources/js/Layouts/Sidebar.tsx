import React from "react";
import { Link } from "@inertiajs/react";
import {
    ChevronLeft,
    PieChart,
    MonitorCog,
    SquareGanttChart,
} from "lucide-react";
import { AuthLayoutContext } from "@/Contexts/AuthLayoutContext";
import { addAttributesToChildren } from "@/Utils/utils";

const Sidebar: React.FC = () => {
    const { sidebarState, setSidebarState } =
        React.useContext(AuthLayoutContext);

    const hideSidebarFn = () => setSidebarState("hidden");

    return (
        <>
            <aside
                className="fixed top-0 left-0 min-h-full pt-16 border-r border-gray-200 data-[state=hidden]:hidden data-[state=open]:w-64 w-16 data-[sidebar=open]:animate-in data-[sidebar=open]:slide-in-from-left-0 data-[sidebar=close]:animate-out data-[sidebar=close]:slide-out-to-right-0 duration-200"
                data-state={sidebarState}
            >
                <div className="overflow-y-auto p-2 h-full">
                    {addAttributesToChildren(
                        <ul className="space-y-2">
                            <SidebarItem
                                href={route("app")}
                                icon={<PieChart className="h-6 w-6" />}
                                label="Dashboard"
                            />
                            <SidebarItem
                                href={route("project.index")}
                                icon={<SquareGanttChart className="h-6 w-6" />}
                                label="Projets"
                            />
                            <SidebarItem
                                href={route("manage.index")}
                                icon={<MonitorCog className="h-6 w-6" />}
                                label="Centre d'administration"
                            />
                        </ul>,
                        { "data-state": sidebarState }
                    )}
                </div>
                <button
                    className="absolute bottom-0 right-2 p-2 rounded-full inline-flex hover:bg-white"
                    onClick={hideSidebarFn}
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>
            </aside>
            <div className="fixed top-1/2">
                <SidebarToggler />
            </div>
        </>
    );
};

const SidebarToggler = () => {
    const { sidebarState, setSidebarState } =
        React.useContext(AuthLayoutContext);

    const sidebarTogglerFn = () =>
        setSidebarState((prev) => {
            if (prev === "hidden") return "open";
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
                    className="h-3 w-1 rounded-full bg-gray-500 dark:bg-gray-600 group-hover:bg-primary-600 dark:group-hover:bg-primary-50 duration-100 translate-y-[0.15rem] data-[state=open]:group-hover:-rotate-[-15deg] group-hover:rotate-[-15deg]"
                />
                <div
                    data-state={sidebarState}
                    className="h-3 w-1 rounded-full bg-gray-500 dark:bg-gray-600 group-hover:bg-primary-600 dark:group-hover:bg-primary-50 duration-100 -translate-y-[0.15rem] data-[state=open]:group-hover:-rotate-[15deg] group-hover:rotate-[15deg]"
                />
            </div>
        </button>
    );
};

interface SidebarItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    rest?: any;
}

const SidebarItem: React.FC<SidebarItemProps> = (props) => {
    const { href, icon, label, ...rest } = props;
    return (
        // @ts-ignore
        <li data-state={rest["data-state"]}>
            <Link
                href={href}
                className="flex items-center data-[state=close]:justify-center p-2 text-base font-medium text-gray-600 rounded-lg dark:text-white hover:bg-gray-200/75 dark:hover:bg-gray-700 duration-100 group cursor-pointer"
                // @ts-ignore
                data-state={rest["data-state"]}
            >
                <div
                    className="group-hover:text-primary-600 dark:group-hover:text-primary-50 duration-100"
                    // @ts-ignore
                    data-state={rest["data-state"]}
                >
                    {icon}
                </div>
                <span
                    className="data-[state=close]:hidden data-[state=open]:animate-in data-[state=open]:slide-in-from-left-5 duration-150 ml-3"
                    // @ts-ignore
                    data-state={rest["data-state"]}
                >
                    {label}
                </span>
            </Link>
        </li>
    );
};

export default Sidebar;
