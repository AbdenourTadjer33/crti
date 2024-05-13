import { Permission, Role } from "@/types";
import React from "react";

type List = {
    id: number;
    name: string;
};

const CreateUserContext = React.createContext<{
    permissions: Permission[];
    roles: Role[];
    universities: List[];
    grades: List[];
    diplomas: List[];
}>({
    permissions: [],
    roles: [],
    universities: [],
    grades: [],
    diplomas: [],
});

export { CreateUserContext };
