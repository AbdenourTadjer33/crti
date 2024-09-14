import React from "react";
import { Head } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import CreateForm from "@/Features/Manage/Unit/Division/CreateForm";
import { House } from "lucide-react";

const Create: React.FC<any> = ({ unit, grades }) => {
    const breadcrubms = React.useMemo(
        () => [
            { href: route("app"), label: <House className="w-6 h-6" /> },
            { href: route("manage.index"), label: "Centres d'administration" },
            { href: route("manage.unit.index"), label: "Gestion d'unité" },
            {
                href: route("manage.unit.show", route().params.unit as string),
                label: unit.abbr,
            },
            { label: "Créer division" },
        ],
        []
    );

    return (
        <div className="space-y-4">
            <Head title="Créer devision" />
            <Breadcrumb items={breadcrubms} />

            <div>
                <Heading level={3} className="font-medium">
                    Créer une nouvelle division pour {unit.name}
                </Heading>
                <Text className="sm:text-base text-sm">
                    Utilisez ce formulaire pour ajouter une nouvelle division au
                    sein de l'unité{" "}
                    <span className=" font-medium">{unit.name}</span>. Cliquez
                    sur "Créer" pour enregistrer les informations ou "Annuler"
                    pour revenir à la page précédente sans sauvegarder.
                </Text>
            </div>

            <CreateForm unit={unit.id} grades={grades} />
        </div>
    );
};

// @ts-ignore
Create.layout = (page) => <AuthLayout children={page} />;

export default Create;
