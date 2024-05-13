import React from "react";
import { Permission } from "@/types";

const PermissionContext = React.createContext<{
    permissions?: Permission[];
}>({});

export { PermissionContext };

