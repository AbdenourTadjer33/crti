import React from "react";
import { useLocalStorage } from "@/Hooks/use-local-storage";

type SidebarState = "open" | "close" | "hidden";

const AuthLayoutContext = React.createContext<{
    sidebarState: SidebarState;
    setSidebarState: React.Dispatch<React.SetStateAction<SidebarState>>;
}>({
    sidebarState: "open",
    setSidebarState: () => {},
});

const AuthLayoutProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [sidebarState, setSidebarState] = useLocalStorage<SidebarState>("sidebar-state", "open");

    return (
        <AuthLayoutContext.Provider
            value={{
                sidebarState,
                setSidebarState,
            }}
        >
            {children}
        </AuthLayoutContext.Provider>
    );
};

export { AuthLayoutContext, AuthLayoutProvider };
