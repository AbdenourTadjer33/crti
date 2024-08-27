import React from "react";
import {
    AuthLayoutContext,
    AuthLayoutProvider,
} from "@/Contexts/auth-layout-context";
import { UserContextProvider } from "@/Contexts/user-context";
import { usePage } from "@inertiajs/react";
import { Toaster } from "@/Components/ui/sonner";
import { toast } from "sonner";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import * as Dialog from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { SuccessCheckAlert } from "@/Components/Alerts/Alert";

export default function AuthLayout({ children }: React.PropsWithChildren) {
    const { alert, info } = usePage().props.flash as any;
    const [dialog, setDialog] = React.useState(false);

    React.useEffect(() => {
        if (alert) {
            toast(alert.message);
        }

        if (info) {
            setDialog(true);
        }
    }, [alert, info]);

    return (
        <UserContextProvider>
            <AuthLayoutProvider>
                <Navbar />
                <Sidebar />
                <Main>{children}</Main>
                <Toaster closeButton />
                {info && (
                    <Dialog.Dialog open={dialog} onOpenChange={setDialog}>
                        <Dialog.DialogContent
                            onOpenAutoFocus={(e) => e.preventDefault()}
                            onCloseAutoFocus={(e) => e.preventDefault()}
                            className="mx-auto max-w-xl grid gap-4 rounded relative overflow-hidden"
                        >
                            <Dialog.DialogHeader className="items-center sm:text-center">
                                {info.status === "success" && (
                                    <SuccessCheckAlert />
                                )}
                                <Dialog.DialogTitle className="text-xl">
                                    {info.title}
                                </Dialog.DialogTitle>
                                <Dialog.DialogDescription className="text-base">
                                    {info?.message}
                                </Dialog.DialogDescription>
                            </Dialog.DialogHeader>

                            <div className="flex items-center justify-center">
                                <Button onClick={() => setDialog(false)}>
                                    OK!
                                </Button>
                            </div>
                        </Dialog.DialogContent>
                    </Dialog.Dialog>
                )}
            </AuthLayoutProvider>
        </UserContextProvider>
    );
}

function Main({ children }: React.PropsWithChildren) {
    const { sidebarState } = React.useContext(AuthLayoutContext);

    return (
        <main
            className="p-2 sm:p-4 mt-16 data-[sidebar=open]:ml-64 data-[sidebar=open]:animate-in data-[sidebar=open]:slide-in-from-left-0 data-[sidebar=close]:ml-16 data-[sidebar=close]:animate-out data-[sidebar=close]:slide-out-to-right-0 duration-200"
            data-sidebar={sidebarState}
        >
            {children}
        </main>
    );
}
