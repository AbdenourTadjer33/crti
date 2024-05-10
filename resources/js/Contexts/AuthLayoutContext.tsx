import { createContext, useState } from "react";

export const AuthLayoutContext = createContext<{
    isOpen?: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isHidden?: boolean;
    setIsHidden: React.Dispatch<React.SetStateAction<boolean>>;
    sidebarState?: "opened" | "closed" | "hidden" | string;
    setSidebarState: React.Dispatch<React.SetStateAction<string>>;
}>({
    setIsOpen: () => {},
    setIsHidden: () => {},
    setSidebarState: () => {},
});

export const AuthLayoutProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(() => {
        const storedValue = localStorage.getItem("sidebar");
        return storedValue
            ? storedValue.trim().toLowerCase() === "true"
            : false;
    });
    const [isHidden, setIsHidden] = useState<boolean>(false);
    const [sidebarState, setSidebarState] = useState(() => {
        const sidebarStates: string[] = ["opened", "closed", "hidden"];

        const storedValue = localStorage.getItem("sidebar-state");

        if (
            !storedValue ||
            !sidebarStates.includes(storedValue) ||
            storedValue === "opened"
        ) {
            return "opened";
        }

        return storedValue;
    });

    return (
        <AuthLayoutContext.Provider
            value={{
                isOpen,
                setIsOpen,
                isHidden,
                setIsHidden,
                sidebarState,
                setSidebarState,
            }}
        >
            {children}
        </AuthLayoutContext.Provider>
    );
};
