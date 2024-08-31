import React from "react";
import Projects from "@/Features/Workspace/projects";
import AuthLayout from "@/Layouts/AuthLayout";
import { Link, usePage } from "@inertiajs/react";
import { ChevronsUpDown, Dot } from "lucide-react";
import WorkspaceLayout from "@/Layouts/workspace-layout";

const Page: React.FC<any> = ({ projects }) => {
    return (
        <>
            <Projects projects={projects} />
            {/* <pre>{JSON.stringify(usePage().props, null, 2)}</pre> */}
        </>
    );
};

// @ts-ignore
Page.layout = (page) => <AuthLayout children={page} />;

export default Page;
