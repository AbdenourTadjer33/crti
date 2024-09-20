import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import CreateForm from "@/Features/Manage/User/CreateForm";
import { Head } from "@inertiajs/react";
import { Heading } from "@/Components/ui/heading";
import { House } from "lucide-react";

const breadcrumbs = [
    { href: route("app"), label: <House className="w-5 h-5" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    { href: route("manage.user.index"), label: "Gestion d'utilisateurs" },
    { label: "Créer utilisateur" },
];

const Create: React.FC<{
    universities: { id: number; name: string }[];
    diplomas: { id: number; name: string }[];
}> = ({ universities, diplomas }) => {
    return (
        <div className="space-y-4">
            <Head title="Créer utilisateur" />

            <Breadcrumb items={breadcrumbs} />

            <div>
                <Heading level={3} className="font-medium">
                    Créer utilisateur
                </Heading>

            </div>

            <CreateForm universities={universities} diplomas={diplomas} />
        </div>
    );
};

// @ts-ignore
Create.layout = (page) => <AuthLayout children={page} />;

export default Create;
