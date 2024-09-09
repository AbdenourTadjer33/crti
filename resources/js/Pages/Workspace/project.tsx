import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import WorkspaceLayout from "@/Layouts/workspace-layout";
import { usePage } from "@inertiajs/react";

const Project: React.FC<any> = ({ project }) => {
    return (
        <>
            <pre>{JSON.stringify(usePage().props, null, 2)}</pre>
            DISPLAY PROJECT STATISTICS
            <br />
            USER THAT HAVE ACCESS CAN SUGGEST NEW VERSIONS HERE
            <pre>{JSON.stringify(project, null, 2)}</pre>
        </>
    );
};

// @ts-ignore
Project.layout = (page) => (
    <AuthLayout>
        <WorkspaceLayout children={page} />
    </AuthLayout>
);

export default Project;
