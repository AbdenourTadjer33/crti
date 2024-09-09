import React from "react";
import Projects from "@/Features/Workspace/projects";
import AuthLayout from "@/Layouts/AuthLayout";

const Page: React.FC<any> = ({ projects }) => <Projects projects={projects} />;

// @ts-ignore
Page.layout = (page) => <AuthLayout children={page} />;

export default Page;
