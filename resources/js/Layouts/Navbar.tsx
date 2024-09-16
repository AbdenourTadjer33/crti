import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
    Bell,
    CircleEllipsis,
    Eye,
    LoaderCircle,
    Menu,
    Moon,
    Sun,
} from "lucide-react";
import { useUser } from "@/Hooks/use-user";
import * as DropdownMenu from "@/Components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { getInitials } from "@/Utils/helper";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { Button } from "@/Components/ui/button";
import { useMediaQuery } from "@/Hooks/use-media-query";
import { useLocalStorage } from "@/Hooks/use-local-storage";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import * as Tooltip from "@/Components/ui/tooltip";

const Navbar: React.FC = () => {
    const renderSidebar = useMediaQuery("(max-width: 768px)");

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 px-2.5 flex flex-col justify-center bg-white dark:bg-gray-950 z-50 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center sm:gap-4 gap-2">
                    {renderSidebar && (
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                className="w-64 border-0 p-0"
                                side="left"
                                onOpenAutoFocus={(e) => e.preventDefault()}
                                onCloseAutoFocus={(e) => e.preventDefault()}
                            >
                                <SheetTitle className="hidden"></SheetTitle>
                                <SheetDescription className="hidden"></SheetDescription>
                                <Sidebar
                                    sidebarState="open"
                                    className="border-0 pt-12 bg-transparent "
                                    hidder={false}
                                />
                            </SheetContent>
                        </Sheet>
                    )}

                    <a href="/" className="shrink-0">
                        <img
                            src="/assets/favicon.png"
                            className="shrink-0 h-11"
                        />
                    </a>
                </div>

                <div className="flex items-center flex-row-reverse gap-2">
                    <UserMenu />

                    <NotificationManu />

                    <Theme />

                    <PendingActions />
                </div>
            </div>
        </nav>
    );
};

const Theme = () => {
    const [theme, setTheme] = useLocalStorage("color-theme", "system");

    React.useEffect(() => {
        const root = window.document.documentElement;

        if (
            theme === "dark" ||
            ("system" === theme &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            root.classList.add("dark");
            return;
        }

        root.classList.remove("dark");
    }, [theme]);

    return (
        <DropdownMenu.DropdownMenu modal={false}>
            <Tooltip.TooltipProvider>
                <Tooltip.Tooltip>
                    <Tooltip.TooltipTrigger asChild>
                        <DropdownMenu.DropdownMenuTrigger asChild>
                            <NavBtn>
                                {theme === "dark" ||
                                ("system" === theme &&
                                    window.matchMedia(
                                        "(prefers-color-scheme: dark)"
                                    ).matches) ? (
                                    <Moon className="h-6 w-6" />
                                ) : (
                                    <Sun className="h-6 w-6" />
                                )}
                            </NavBtn>
                        </DropdownMenu.DropdownMenuTrigger>
                    </Tooltip.TooltipTrigger>
                    <Tooltip.TooltipContent>Thème</Tooltip.TooltipContent>
                </Tooltip.Tooltip>
            </Tooltip.TooltipProvider>

            <DropdownMenu.DropdownMenuContent
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DropdownMenu.DropdownMenuItem
                    onClick={() => setTheme("light")}
                >
                    Mode jour
                </DropdownMenu.DropdownMenuItem>
                <DropdownMenu.DropdownMenuItem onClick={() => setTheme("dark")}>
                    Mode nuit
                </DropdownMenu.DropdownMenuItem>
                <DropdownMenu.DropdownMenuItem
                    onClick={() => setTheme("system")}
                >
                    System
                </DropdownMenu.DropdownMenuItem>
            </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
    );
};

const UserMenu = () => {
    const { name, email } = useUser();
    return (
        <DropdownMenu.DropdownMenu modal={false}>
            <Tooltip.TooltipProvider>
                <Tooltip.Tooltip>
                    <Tooltip.TooltipTrigger asChild>
                        <DropdownMenu.DropdownMenuTrigger asChild>
                            <button className="flex mx-3 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:ring-gray-700 outline-none">
                                <Avatar>
                                    <AvatarFallback>
                                        {getInitials(name)}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenu.DropdownMenuTrigger>
                    </Tooltip.TooltipTrigger>
                    <Tooltip.TooltipContent>Profile</Tooltip.TooltipContent>
                </Tooltip.Tooltip>
            </Tooltip.TooltipProvider>

            <DropdownMenu.DropdownMenuContent
                className="mx-2"
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <div className="py-3 px-2">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                        {name}
                    </span>
                    <span className="block text-sm text-gray-900 truncate dark:text-white">
                        {email}
                    </span>
                </div>
                <div className="h-px bg-gray-300 dark:bg-gray-500" />
                <DropdownMenu.DropdownMenuItem
                    asChild
                    className="cursor-pointer"
                >
                    <Link href={route("profile.show")}>Profile</Link>
                </DropdownMenu.DropdownMenuItem>
                <DropdownMenu.DropdownMenuItem>
                    <Link
                        as="button"
                        href={route("logout.destroy")}
                        method="delete"
                    >
                        Se déconnecter
                    </Link>
                </DropdownMenu.DropdownMenuItem>
            </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
    );
};

const NotificationManu = () => {
    return (
        <DropdownMenu.DropdownMenu modal={false}>
            <Tooltip.TooltipProvider>
                <Tooltip.Tooltip>
                    <Tooltip.TooltipTrigger asChild>
                        <DropdownMenu.DropdownMenuTrigger asChild>
                            <NavBtn>
                                <span className="sr-only">
                                    View notifications
                                </span>
                                <Bell className="w-6 h-6" />
                            </NavBtn>
                        </DropdownMenu.DropdownMenuTrigger>
                    </Tooltip.TooltipTrigger>
                    <Tooltip.TooltipContent>
                        Notification
                    </Tooltip.TooltipContent>
                </Tooltip.Tooltip>
            </Tooltip.TooltipProvider>

            <DropdownMenu.DropdownMenuContent
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="mx-2"
            >
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
                            <img
                                className="w-11 h-11 rounded-full"
                                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
                                alt="Bonnie Green avatar"
                            />
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
                        <Eye className="mr-2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                        View all
                    </div>
                </a>
            </DropdownMenu.DropdownMenuContent>
        </DropdownMenu.DropdownMenu>
    );
};

const PendingActions = () => {
    const { pendingActions } = usePage<{
        pendingActions?:
            | false
            | Record<
                  string,
                  { url: string; name: string; createdAt: string }[]
              >;
    }>().props;

    return (
        <DropdownMenu.DropdownMenu modal={false}>
            <Tooltip.TooltipProvider>
                <Tooltip.Tooltip>
                    <Tooltip.TooltipTrigger asChild>
                        <DropdownMenu.DropdownMenuTrigger asChild>
                            <NavBtn
                                onClick={() =>
                                    router.reload({ only: ["pendingActions"] })
                                }
                            >
                                <CircleEllipsis className="h-6 w-6" />
                            </NavBtn>
                        </DropdownMenu.DropdownMenuTrigger>
                    </Tooltip.TooltipTrigger>
                    <Tooltip.TooltipContent>
                        Incompléte action
                    </Tooltip.TooltipContent>
                </Tooltip.Tooltip>
            </Tooltip.TooltipProvider>

            <DropdownMenu.DropdownMenuContent
                className="w-80 mx-2"
                align="start"
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                {typeof pendingActions === "undefined" ? (
                    <div className="py-8 flex items-center justify-center">
                        <LoaderCircle className="animate-spin mr-2 h-5 w-5" />
                        Chargement...
                    </div>
                ) : pendingActions === false ? (
                    <div className="py-8 text-center">
                        Vous n'avez aucune action incompléte.
                    </div>
                ) : (
                    Object.keys(pendingActions).map((type, idx) => (
                        <React.Fragment key={idx}>
                            <DropdownMenu.DropdownMenuLabel>
                                {type}
                            </DropdownMenu.DropdownMenuLabel>

                            {pendingActions[type].map((action, idx) => (
                                <DropdownMenu.DropdownMenuItem
                                    key={idx}
                                    asChild
                                >
                                    <Link
                                        href={action.url}
                                        className="flex items-center justify-between"
                                    >
                                        <b>{action.name}</b>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDistanceToNow(
                                                action.createdAt,
                                                {
                                                    locale: fr,
                                                    addSuffix: true,
                                                }
                                            )}
                                        </span>
                                    </Link>
                                </DropdownMenu.DropdownMenuItem>
                            ))}

                            <DropdownMenu.DropdownMenuSeparator />
                        </React.Fragment>
                    ))
                )}
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
        className={`p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-200 dark:text-gray-50 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 ${className}`}
        {...props}
    >
        {children}
    </button>
));

export default Navbar;
