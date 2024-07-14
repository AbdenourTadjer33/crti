import { useContext } from "react";
import { UserContext } from "@/Contexts/UserContext";
import { User } from "@/types";

export const useUser = (...attributes: (keyof User)[]) => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserContextProvider");
    }
    if (attributes.length) {
        return attributes.reduce((selectedAttributes: any, attribute) => {
            selectedAttributes[attribute] = context[attribute];
            return selectedAttributes;
        }, {});
    }
    return context;
};
