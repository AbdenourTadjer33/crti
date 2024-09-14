import React from "react";
import Projects from "@/Features/Workspace/projects";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head } from "@inertiajs/react";
import { House } from "lucide-react";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";

const breadcrumbs = [
    { href: route("app"), label: <House className="h-5 w-5" /> },
    { label: "Espace de travail" },
];

const Page: React.FC<any> = ({ projects }) => (
    <div className="space-y-4">
        <Head title="Espace de travail" />
        <Breadcrumb items={breadcrumbs} MAX_ITEMS={2} />

        <div className="space-y-2">
            <Heading level={3} className="font-medium">
                Espace de travail
            </Heading>

            <Text className="text-sm sm:text-base">
                The Workspace is a dedicated area for project leaders and
                members to collaborate on active projects. Here, users can
                seamlessly manage and track their projects by selecting from a
                list of projects they are involved in. Whether you're overseeing
                the progress as a project leader or contributing as a team
                member, the Workspace provides you with the tools and
                information you need to stay updated and engaged with your
                projects.
            </Text>
        </div>

        <Projects projects={projects} />
    </div>
);

// @ts-ignore
Page.layout = (page) => <AuthLayout children={page} />;

export default Page;
