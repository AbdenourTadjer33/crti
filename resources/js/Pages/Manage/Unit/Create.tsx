import React from "react";
import { Head } from "@inertiajs/react";
import CreateForm from "@/Features/Manage/Unit/CreateForm";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { House } from "lucide-react";

const breadcrubms = [
    { href: route("app"), label: <House className="w-6 h-6" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    { href: route("manage.unit.index"), label: "Gestion d'unité" },
    { label: "Créer unité" },
];

const Create: React.FC = () => (
    <AuthLayout>
        <Head title="Créer unité" />
        <div className="space-y-4">
            <Breadcrumb items={breadcrubms} />

            <div>
                <Heading level={3} className="font-medium">
                    Créer unité
                </Heading>
                <Text>
                    Utilisez ce formulaire pour ajouter une nouvelle unité,
                    Cliquez sur "Créer" pour enregistrer les informations ou "Annuler"
                    pour revenir à la page précédente sans sauvegarder.
                </Text>
            </div>

            <CreateForm />
        </div>
    </AuthLayout>
);

export default Create;
