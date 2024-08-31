import React from "react";
import { Head } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { House } from "lucide-react";
import CreateForm from "@/Features/Manage/Board/CreateForm";
import { BaseProject } from "@/types/project";

interface ProjjectProps {
    projects: BaseProject;
}

const Create: React.FC<ProjjectProps> = ({ projects }) => {
    const breadcrubms = React.useMemo(
        () => [
            { href: route("app"), label: <House className="w-5 h-5" /> },
            { href: route("manage.index"), label: "Centres d'administration" },
            {
                href: route("manage.board.index"),
                label: "Gestion des conseils scientifque",
            },
            { label: "Créer un conseil scientifique" },
        ],
        []
    );
    return (
        <>
            <Head title="Créer board" />
            <div className="space-y-4">
                <Breadcrumb items={breadcrubms} />

                <div>
                    <Heading level={3} className="font-medium">
                        Créer conseil scientifique
                    </Heading>
                    <Text>
                        Utilisez ce formulaire pour ajouter un nouveau conseil
                        scientifique, Cliquez sur "Créer" pour enregistrer les
                        informations ou "Annuler" pour revenir à la page
                        précédente sans sauvegarder.
                    </Text>
                </div>
                <CreateForm />
                <pre>{JSON.stringify(projects, null, 2)}</pre>
            </div>
        </>
    );
};

// @ts-ignore
Create.layout = (page) => {
    return <AuthLayout children={page} />;
};

export default Create;
