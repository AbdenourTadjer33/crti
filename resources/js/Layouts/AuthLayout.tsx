import React from "react";
import {
    AuthLayoutContext,
    AuthLayoutProvider,
} from "@/Contexts/auth-layout-context";
import { UserContextProvider } from "@/Contexts/user-context";
import { usePage } from "@inertiajs/react";
import { Toaster } from "@/Components/ui/sonner";
import { toast } from "sonner";

// import { useToast } from "@/Components/ui/use-toast";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AuthLayout({ children }: React.PropsWithChildren) {
    const { flash } = usePage().props;

    React.useEffect(() => {
        if ((flash as any).alert) {
            toast((flash as any).alert.message);
        }
    }, [(flash as any).alert]);

    return (
        <UserContextProvider>
            <AuthLayoutProvider>
                <Navbar />
                <Sidebar />
                <Main>{children}</Main>
                <Toaster closeButton />
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
