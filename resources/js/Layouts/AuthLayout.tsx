import Navbar from "@/Components/Block/Navbar";
import { Sidebar } from "@/Components/Block/Sidebar";
import { UserContextProvider } from "@/Contexts/UserContext";
import { User } from "@/types";
import React from "react";

export default function AuthLayout({
    children,
}: React.PropsWithChildren<{ user?: User }>) {
    return (
        <UserContextProvider>
            <Navbar />
            <Sidebar />
            <main className="p-4 md:ml-64 h-auto pt-20">{children}</main>
        </UserContextProvider>
    );
}
