import React, { useContext } from "react";
import { RiPieChartFill } from "react-icons/ri";
import { MdLanguage, MdSettings } from "react-icons/md";
import { AuthLayoutContext } from "@/Contexts/AuthLayoutContext";

export function Sidebar() {
    const { sidebarState } = useContext(AuthLayoutContext);
    return (
        <Aside>
            <AsideLinks>
                <AsideLink>
                    <RiPieChartFill className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-50" />
                    {sidebarState === "opened" && <span className="ml-3">Overview</span>}
                </AsideLink>
            </AsideLinks>
            <AsideOptions />
        </Aside>
    );
}

function Aside({ children }: React.PropsWithChildren) {
    const { sidebarState } = useContext(AuthLayoutContext);
    return (
        <aside
            className={`fixed top-0 left-0 z-40 h-screen pt-16 ${
                sidebarState === "opened" ? "w-64" : "w-20"
            } ${
                sidebarState === "hidden" ? "-translate-x-20" : ""
            } border-r border-gray-200 dark:border-gray-800`}
        >
            {children}
            <AsideToggler />
        </aside>
    );
}

function AsideToggler() {
    const { sidebarState, setSidebarState } = useContext(AuthLayoutContext);

    function toggle(e: React.MouseEvent) {
        setSidebarState((prev) => {
            if (e.detail <= 1) {
                return prev === "hidden"
                    ? "opened"
                    : prev === "opened"
                    ? "closed"
                    : "opened";
            }
            return "hidden";
        });
    }

    return (
        <button
            type="button"
            onClick={toggle}
            className="absolute top-1/2 -right-5 rounded-full group cursor-pointer duration-100"
        >
            <div className="flex h-6 w-6 flex-col items-center">
                <div
                    className={`h-3 w-1 rounded-full bg-gray-500 dark:bg-gray-600 group-hover:bg-primary-600 dark:group-hover:bg-primary-50 duration-100 ${
                        sidebarState === "opened"
                            ? "group-hover:-rotate-[-15deg]"
                            : "group-hover:rotate-[-15deg]"
                    } translate-y-[0.15rem]`}
                ></div>
                <div
                    className={`h-3 w-1 rounded-full bg-gray-500 dark:bg-gray-600 group-hover:bg-primary-600 dark:group-hover:bg-primary-50 duration-100 ${
                        sidebarState === "opened"
                            ? "group-hover:-rotate-[15deg]"
                            : "group-hover:rotate-[15deg]"
                    } -translate-y-[0.15rem]`}
                ></div>
            </div>
        </button>
    );
}

function AsideLinks({ children }: React.PropsWithChildren) {
    return (
        <div className="overflow-y-auto py-5 px-3 h-full">
            <ul className="space-y-2">{children}</ul>
        </div>
    );
}

function AsideLink({ children }: React.PropsWithChildren) {
    const { sidebarState } = useContext(AuthLayoutContext);
    return (
        <li>
            <a
                className={`flex items-center ${
                    sidebarState === "opened" ? "" : "justify-center"
                } p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer`}
            >
                {children}
            </a>
        </li>
    );
}

function AsideOptions() {
    const { sidebarState } = useContext(AuthLayoutContext);
    return (
        <div
            className={`absolute bottom-0 left-0 p-4 w-full flex ${
                sidebarState === "opened" ? "flex-row" : "flex-col-reverse"
            } justify-center gap-2 z-20`}
        >
            <a className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer dark:text-gray-400 dark:hover:text-primary-50 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-600">
                <MdSettings className="w-6 h-6 rounded-full" />
            </a>

            <LangDropdown />
        </div>
    );
}

const LangDropdown = () => {
    return (
        <button
            type="button"
            data-dropdown-toggle="language-dropdown"
            className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer dark:hover:text-primary-50 dark:text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
            <MdLanguage className="w-6 h-6 rounded-full" />
        </button>
    );
};
