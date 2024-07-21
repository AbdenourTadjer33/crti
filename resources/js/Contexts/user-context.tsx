import React, { createContext, ReactNode } from "react";
import { User } from "@/types";
import { usePage } from "@inertiajs/react";

export const UserContext = createContext<User | null>(null);

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const pageProps: any = usePage().props;
    const user = pageProps.auth.user as User;

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
