import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head } from "@inertiajs/react";
import { House } from "lucide-react";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import Form from "@/Features/Manage/resource/create/form";

const breadcrubms = [
    { href: route("app"), label: <House className="w-5 h-5" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    {
        href: route("manage.resource.index"),
        label: "Gestion des ressources",
    },
    { label: "Créer ressource" },
];

const Create = () => {
    return (
        <div className="space-y-4">
            <Head title="Créer ressource" />
            <Breadcrumb items={breadcrubms} />

            <div className="space-y-2">
                <Heading level={3} className="font-medium">
                    Créer ressource
                </Heading>
                <Text className="text-sm sm:text-base">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Illum aut fugit provident blanditiis veniam possimus quos
                    dicta quidem! Consequatur minima harum in atque animi
                    mollitia. Sapiente cumque aut laborum et!
                </Text>
            </div>

            <Form />
        </div>
    );
};

// @ts-ignore
Create.layout = (page) => <AuthLayout children={page} />;

export default Create;
