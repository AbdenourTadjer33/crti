import React, { useContext, useEffect } from "react";
import Navbar from "@/Components/Block/Navbar";
import { Sidebar } from "@/Components/Block/Sidebar";
import {
    AuthLayoutContext as AuthContext,
    AuthLayoutProvider as AuthProvider,
} from "@/Contexts/AuthLayoutContext";
import { UserContextProvider } from "@/Contexts/UserContext";
import { usePage } from "@inertiajs/react";
import { Toaster } from "@/Components/ui/toaster";
import { useToast } from "@/Components/ui/use-toast";

export default function AuthLayout({ children }: React.PropsWithChildren) {
    const { flash } = usePage().props;
    const { toast } = useToast();

    useEffect(() => {
        if ((flash as any).alert) {
            toast({ description: (flash as any).alert.message });
        }
    }, [(flash as any).alert]);

    return (
        <UserContextProvider>
            <AuthProvider>
                <Navbar />
                <Sidebar />
                <Main>{children}</Main>
                <Toaster />
            </AuthProvider>
        </UserContextProvider>
    );
}

function Main({ children }: React.PropsWithChildren) {
    const { sidebarState } = useContext(AuthContext);

    return (
        <main
            className={`p-4 ${
                sidebarState === "hidden"
                    ? ""
                    : `${sidebarState === "opened" ? "ml-64" : "ml-20"}`
            } h-auto `}
        >
            {children}
        </main>
    );
}
