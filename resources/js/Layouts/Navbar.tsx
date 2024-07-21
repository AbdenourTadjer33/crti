import React from "react";
import { Link } from "@inertiajs/react";
import { Moon, Search } from "lucide-react";
import { FaBell, FaEye } from "react-icons/fa";
import { useUser } from "@/Hooks/use-user";
import * as DropdownMenu from "@/Components/ui/dropdown-menu";
import * as Select from "@/Components/ui/select";
import Avatar from "@/Components/Avatar";

const Navbar: React.FC = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 py-2 px-2.5 bg-gray-100 z-50 border-b border-gray-200">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="shrink-0">
                        <img
                            src="/assets/favicon.png"
                            className="shrink-0 h-11"
                        />
                    </Link>

                    <Select.Select>
                        <Select.SelectTrigger className="shrink-0 max-w-sm">
                            <Select.SelectValue placeholder="choose division" />
                        </Select.SelectTrigger>
                        <Select.SelectContent></Select.SelectContent>
                    </Select.Select>
                </div>

                <div className="flex items-center gap-4">
                    <NavBtn>
                        <span className="sr-only">Toggle search</span>
                        <Search className="h-6 w-6" />
                    </NavBtn>

                    <Theme />

                    <NotificationManu />
                    <UserMenu />
                </div>
            </div>
        </nav>
    );
};

const Theme = () => {
    return (
        <DropdownMenu.DropdownMenu modal={false}>
            <DropdownMenu.DropdownMenuTrigger asChild>
                <NavBtn>
                    <Moon className="h-6 w-6" />
                </NavBtn>
            </DropdownMenu.DropdownMenuTrigger>
            <DropdownMenu.DropdownMenuContent
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DropdownMenu.DropdownMenuItem>
                    Mode jour
                </DropdownMenu.DropdownMenuItem>
                <DropdownMenu.DropdownMenuItem>
                    Mode nuit
                </DropdownMenu.DropdownMenuItem>
                <DropdownMenu.DropdownMenuItem>
                    System
                </DropdownMenu.DropdownMenuItem>
            </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
    );
};

const UserMenu = () => {
    const { name, email } = useUser();
    return (
        <DropdownMenu.DropdownMenu>
            <DropdownMenu.DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="flex mx-3 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 bg-gray-100 dark:bg-gray-500"
                >
                    <Avatar name={name} />
                </button>
            </DropdownMenu.DropdownMenuTrigger>
            <DropdownMenu.DropdownMenuContent>
                <div className="py-3 px-4">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                        {name}
                    </span>
                    <span className="block text-sm text-gray-900 truncate dark:text-white">
                        {email}
                    </span>
                </div>
                <div className="h-px bg-gray-300 dark:bg-gray-500" />
                <DropdownMenu.DropdownMenuItem asChild>
                    <Link href="#">Profile</Link>
                </DropdownMenu.DropdownMenuItem>
                <DropdownMenu.DropdownMenuItem asChild>
                    <Link href="#">Account Settings</Link>
                </DropdownMenu.DropdownMenuItem>
                <DropdownMenu.DropdownMenuItem asChild>
                    <Link
                        as="button"
                        href={route("logout.destroy")}
                        method="delete"
                    >
                        Sign out
                    </Link>
                </DropdownMenu.DropdownMenuItem>
            </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
    );
};

const NotificationManu = () => {
    return (
        <DropdownMenu.DropdownMenu>
            <DropdownMenu.DropdownMenuTrigger asChild>
                <NavBtn>
                    <span className="sr-only">View notifications</span>
                    <FaBell className="w-6 h-6" />
                </NavBtn>
            </DropdownMenu.DropdownMenuTrigger>
            <DropdownMenu.DropdownMenuContent>
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
            </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
    );
};

const NavBtn = React.forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement>
>(({ className = "", children, ...props }, ref) => (
    <button
        type="button"
        ref={ref}
        className={`p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 ${className}`}
        {...props}
    >
        {children}
    </button>
));

export default Navbar;
