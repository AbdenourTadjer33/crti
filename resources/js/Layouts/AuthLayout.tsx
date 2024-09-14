import React from "react";
import { UserContextProvider } from "@/Contexts/user-context";
import { usePage } from "@inertiajs/react";
import { Toaster } from "@/Components/ui/sonner";
import { toast } from "sonner";
import { Sidebar, SidebarToggler } from "./Sidebar";
import Navbar from "./Navbar";
import * as Dialog from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { SuccessCheckAlert } from "@/Components/Alerts/Alert";
import WorkspaceNavbar from "./workspace-navbar";
import { useLocalStorage } from "@/Hooks/use-local-storage";
import { cn } from "@/Utils/utils";
import { PageProps } from "@/types";

export default function AuthLayout({ children }: React.PropsWithChildren) {
    const { alert, info } = usePage<PageProps>().props;
    const [sidebarState, setSidebarState] = useLocalStorage<
        "open" | "close" | "hidden" | "open-hover"
    >("sidebar-state", "open");

    const [dialog, setDialog] = React.useState(false);

    const displayWorkspaceNavbar = React.useMemo(
        () =>
            route().current("workspace.*") &&
            !route().current("workspace.index"),
        [route().current()]
    );

    React.useEffect(() => {
        if (alert) {
            if (["success", "error"].includes(alert.status)) {
                toast[alert.status](alert.message);
            } else {
                toast.message(alert.message);
            }
        }

        if (info) {
            setDialog(true);
        }
    }, [alert, info]);

    return (
        <UserContextProvider>
            <Navbar />
            {displayWorkspaceNavbar && (
                <WorkspaceNavbar
                    className={cn(
                        "top-16 duration-200",
                        sidebarState === "open"
                            ? "left-64 animate-in slide-in-from-left-0"
                            : sidebarState === "close"
                            ? "left-16 animate-out slide-out-to-right-0"
                            : "left-0 animate-out slide-out-to-right-0"
                    )}
                />
            )}

            <div className="fixed top-0 left-0 min-h-full bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 z-10 duration-0">
                <Sidebar
                    sidebarState={sidebarState}
                    setSidebarState={setSidebarState}
                    className="pt-16 md:block hidden data-[state=hidden]:hidden data-[state=open]:w-64 w-16 data-[sidebar=open]:animate-in data-[sidebar=open]:slide-in-from-left-0 data-[sidebar=close]:animate-out data-[sidebar=close]:slide-out-to-right-0 duration-200"
                />
            </div>
            <div className="fixed top-1/2 md:block hidden">
                <SidebarToggler
                    sidebarState={sidebarState === "open-hover" ? "open" : sidebarState}
                    setSidebarState={setSidebarState}
                />
            </div>
            <Main
                sidebarState={
                    sidebarState === "open-hover" ? "open" : sidebarState
                }
            >
                {children}
            </Main>
            <Toaster richColors expand />
            {info && (
                <Dialog.Dialog open={dialog} onOpenChange={setDialog}>
                    <Dialog.DialogContent
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onCloseAutoFocus={(e) => e.preventDefault()}
                        className="mx-auto max-w-xl grid sm:gap-6 gap-4 rounded relative overflow-hidden"
                    >
                        <Dialog.DialogHeader className="space-y-2.5">
                            {info.status === "success" && <SuccessCheckAlert />}
                            <Dialog.DialogTitle className="text-xl text-center">
                                {info.title}
                            </Dialog.DialogTitle>
                            <Dialog.DialogDescription className="text-base">
                                {info?.message}
                            </Dialog.DialogDescription>
                        </Dialog.DialogHeader>

                        <div className="flex items-center justify-center">
                            <Button
                                onClick={() => setDialog(false)}
                                className="uppercase"
                            >
                                ok!
                            </Button>
                        </div>
                    </Dialog.DialogContent>
                </Dialog.Dialog>
            )}
        </UserContextProvider>
    );
}

const Main: React.FC<{
    sidebarState: "open" | "close" | "hidden" | "open-hover";
    children: React.ReactNode;
}> = ({ sidebarState, children }) => {
    return (
        <main
            className="p-2 sm:p-4 mt-16 md:data-[sidebar=open]:ml-64 data-[sidebar=open]:animate-in data-[sidebar=open]:slide-in-from-left-0 md:data-[sidebar=close]:ml-16 data-[sidebar=close]:animate-out data-[sidebar=close]:slide-out-to-right-0 duration-200"
            data-sidebar={sidebarState}
        >
            {children}
        </main>
    );
};
