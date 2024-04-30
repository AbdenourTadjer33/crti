import { useContext } from "react";
import { UserContext } from "@/Contexts/UserContext";

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserContextProvider");
    }
    return context;
};
