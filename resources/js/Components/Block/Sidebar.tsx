import { Transition } from "@headlessui/react";
import React, { useState, createContext, useContext } from "react";
import { MdLanguage, MdSettings } from "react-icons/md";
import { RiPieChartFill } from "react-icons/ri";

const SidebarContext = createContext<{
    isOpen?: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isHidden?: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
}>({
    setIsOpen: () => {},
    setIsHidden: () => {},
});

export function Sidebar() {
    const [isOpen, setIsOpen] = useState<boolean>(() => {
        const storedValue = localStorage.getItem("sidebar");
        return storedValue
            ? storedValue.trim().toLowerCase() === "true"
            : false;
    });
    const [isHidden, setIsHidden] = useState<boolean>(false);

    return (
        <SidebarContext.Provider
            value={{ isOpen, setIsOpen, isHidden, setIsHidden }}
        >
            <Aside>
                <AsideLinks>
                    <AsideLink>
                        <RiPieChartFill className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-50" />
                        <Transition
                            as="span"
                            show={isOpen}
                            enter="transition-opacity duration-75"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            className="ml-3"
                        >
                            Overview
                        </Transition>
                    </AsideLink>
                </AsideLinks>
                <AsideOptions />
            </Aside>
        </SidebarContext.Provider>
    );
}

function Aside({ children }: React.PropsWithChildren) {
    const { isOpen, isHidden } = useContext(SidebarContext);
    return (
        <aside
            className={`fixed top-0 left-0 z-40 h-screen pt-16 ${
                isOpen ? "w-64" : "w-20"
            } ${
                isHidden ? "-translate-x-20" : ""
            } transition-all duration-100 ease-in bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
        >
            {children}
            <AsideToggler />
        </aside>
    );
}

function AsideToggler() {
    const { isOpen, setIsOpen, isHidden, setIsHidden } =
        useContext(SidebarContext);

    function hide() {
        setIsHidden(true);
    }

    function toggle() {
        if (isHidden) {
            setIsHidden(false);
            setIsOpen(true);
            localStorage.setItem("sidebar", String(true));
            return;
        }

        if (isOpen) {
            setTimeout(() => {
                setIsOpen(false);
                localStorage.setItem("sidebar", String(false));
            }, 175);
            return;
        }

        setIsOpen(true);
        localStorage.setItem("sidebar", String(true));
    }

    return (
        <button
            type="button"
            onClick={toggle}
            onDoubleClick={hide}
            className="absolute top-1/2 -right-5 rounded-full group cursor-pointer duration-100"
        >
            <div className="flex h-6 w-6 flex-col items-center">
                <div
                    className={`h-3 w-1 rounded-full bg-gray-500 dark:bg-gray-600 group-hover:bg-primary-600 dark:group-hover:bg-primary-500 duration-100 ${
                        isOpen
                            ? "group-hover:-rotate-[-15deg]"
                            : "group-hover:rotate-[-15deg]"
                    } translate-y-[0.15rem]`}
                ></div>
                <div
                    className={`h-3 w-1 rounded-full bg-gray-500 dark:bg-gray-600 group-hover:bg-primary-600 dark:group-hover:bg-primary-500 duration-100 ${
                        isOpen
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
    const { isOpen } = useContext(SidebarContext);
    return (
        <li>
            <a
                className={`flex items-center ${
                    isOpen ? "" : "justify-center"
                } p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer`}
            >
                {children}
            </a>
        </li>
    );
}

function AsideOptions() {
    const { isOpen } = useContext(SidebarContext);
    return (
        <div
            className={`absolute bottom-0 left-0 p-4 w-full flex ${
                isOpen ? "flex-row" : "flex-col-reverse"
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