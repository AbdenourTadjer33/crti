import { User } from "@/types";
import { usePage } from "@inertiajs/react";
import React, { createContext, ReactNode } from "react";

export const UserContext = createContext<User | null>(null);

export const UserContextProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const user = usePage().props.user as unknown as User;
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
