import React from "react";
import { Link } from "@inertiajs/react";
import Avatar from "../Avatar";
import { useUser } from "@/Hooks/useUser";
import { PiMoonFill, PiSunFill } from "react-icons/pi";
import { MdMenu, MdSearch } from "react-icons/md";
import { FaBell } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import useStorage from "@/Hooks/useStorage";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../ui/dropdown-menu";

export default function Navbar() {
    const [isDark, setIsDark] = useStorage(
        "color-theme",
        window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
    );

    function toggleDarkMode(e: React.MouseEvent) {
        setIsDark(
            !document.documentElement.classList.contains("dark")
                ? "dark"
                : "light"
        );
        document.documentElement.classList.toggle("dark");
    }

    return (
        <nav className="px-4 py-2.5 z-50">
            <div className="flex justify-between items-center">
                <button type="button">
                    <MdMenu className="w-8 h-8 text-primary-600" />
                </button>

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="hidden md:block md:pl-2"
                >
                    <Label htmlFor="topbar-search" className="sr-only">
                        Search
                    </Label>
                    <div className="relative md:w-96">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <MdSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <Input
                            id="topbar-search"
                            placeholder="Search"
                            className="pl-10"
                            autoComplete="off"
                        />
                    </div>
                </form>
                <div className="flex items-center lg:order-2">
                    <NavBtn className="md:hidden">
                        <span className="sr-only">Toggle search</span>
                        <MdSearch className="w-6 h-6" />
                    </NavBtn>

                    <NavBtn onClick={toggleDarkMode}>
                        <span className="sr-only">Toggle DarkMode</span>
                        {isDark === "dark" ? (
                            <PiSunFill className="w-6 h-6" />
                        ) : (
                            <PiMoonFill className="w-6 h-6" />
                        )}
                    </NavBtn>

                    <NotificationManu />

                    <UserMenu />
                </div>
            </div>
        </nav>
    );
}

const UserMenu = () => {
    const { name, email } = useUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="flex mx-3 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 bg-gray-100 dark:bg-gray-500"
                >
                    <Avatar name={name} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className="py-3 px-4">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                        {name}
                    </span>
                    <span className="block text-sm text-gray-900 truncate dark:text-white">
                        {email}
                    </span>
                </div>
                <div className="h-px bg-gray-300 dark:bg-gray-500" />
                <DropdownMenuItem asChild>
                    <Link href="#">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="#">Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        as="button"
                        href={route("logout.destroy")}
                        method="delete"
                    >
                        Sign out
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const NotificationManu = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <NavBtn>
                    <span className="sr-only">View notifications</span>
                    <FaBell className="w-6 h-6" />
                </NavBtn>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <div className="block py-2 px-4 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-600 dark:text-gray-300">
                    Notifications
                </div>
                <div>
                    <a
                        href="#"
                        className="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
                    >
                        <div className="flex-shrink-0">
                            <span className="w-11 h-11 rounded-full" />
                            {/* <img
                                className="w-11 h-11 rounded-full"
                                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
                                alt="Bonnie Green avatar"
                            /> */}
                            <div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 rounded-full border border-white bg-primary-700 dark:border-gray-700">
                                <svg
                                    aria-hidden="true"
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                                    <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="pl-3 w-full">
                            <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                                New message from
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    Bonnie Green
                                </span>
                                : "Hey, what's up? All set for the
                                presentation?"
                            </div>
                            <div className="text-xs font-medium text-primary-600 dark:text-primary-500">
                                a few moments ago
                            </div>
                        </div>
                    </a>
                </div>
                <a
                    href="#"
                    className="block py-2 text-md font-medium text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-600 dark:text-white dark:hover:underline"
                >
                    <div className="inline-flex items-center">
                        <FaEye className="mr-2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                        View all
                    </div>
                </a>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const NavBtn = React.forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement>
>(({ className = "", children, ...props }, ref) => (
    <button
        type="button"
        ref={ref}
        className={`p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 ${className}`}
        {...props}
    >
        {children}
    </button>
));
