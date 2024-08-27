import React from "react";
import { Head } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { House } from "lucide-react";
import CreateForm from "@/Features/Manage/Board/CreateForm";

const Create: React.FC<any> = ({ board, project }) => {
    const breadcrubms = React.useMemo(
        () => [
            { href: route("app"), label: <House className="w-6 h-6" /> },
            { href: route("manage.index"), label: "Centres d'administration" },
            { href: route("manage.board.index"), label: "Gestion des conseils scientifque" },
            { label: "Créer un conseil scientifique" },
        ],
        []
    );
    return (
        <AuthLayout>
            <Head title="Créer board" />
            <div className="space-y-4">
                <Breadcrumb items={breadcrubms} />

                <div>
                <Heading level={3} className="font-medium">
                    Créer conseil scientifique
                </Heading>
                <Text>
                    Utilisez ce formulaire pour ajouter un nouveau conseil scientifique,
                    Cliquez sur "Créer" pour enregistrer les informations ou "Annuler"
                    pour revenir à la page précédente sans sauvegarder.
                </Text>
            </div>
                <CreateForm board={board.id} projects={project}/>
            </div>
        </AuthLayout>
    );
};

export default Create;
