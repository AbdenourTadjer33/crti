import React from "react";
import { Head } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { House } from "lucide-react";
import CreateForm from "@/Features/Manage/Board/CreateForm";

const breadcrubms = [
    { href: route("app"), label: <House className="w-5 h-5" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    {
        href: route("manage.board.index"),
        label: "Gestion des conseils scientifque",
    },
    { label: "Créer conseil" },
];

const Create: React.FC = () => {
    return (
        <div className="space-y-4">
            <Head title="Créer conseil" />
            <Breadcrumb items={breadcrubms} />

            <div className="space-y-2">
                <Heading level={3} className="font-medium">
                    Créer conseil scientifique
                </Heading>
                <Text className="text-sm sm:text-base">
                    Utilisez ce formulaire pour ajouter un nouveau conseil
                    scientifique, Cliquez sur "Créer" pour enregistrer les
                    informations ou "Annuler" pour revenir à la page précédente
                    sans sauvegarder.
                </Text>
            </div>

            <CreateForm />
        </div>
    );
};

// @ts-ignore
Create.layout = (page) => {
    return <AuthLayout children={page} />;
};

export default Create;
