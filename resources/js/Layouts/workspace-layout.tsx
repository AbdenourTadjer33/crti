import Topbar from "@/Features/Workspace/top-bar";
import React from "react";

const WorkspaceLayout = ({ children }: React.PropsWithChildren) => {
    return (
        <div>
            <Topbar />
            <div className="pt-4">{children}</div>
        </div>
    );
};

export default WorkspaceLayout;
