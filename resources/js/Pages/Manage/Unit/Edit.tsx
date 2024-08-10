import React from "react";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import Breadcrumb from "@/Components/Breadcrumb";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head } from "@inertiajs/react";
import EditForm from "@/Features/Manage/Unit/EditForm";
import { House } from "lucide-react";

const Edit: React.FC<{ unit: any }> = ({ unit }) => {
    const breadcrubms = React.useMemo(
        () => [
            { href: route("app"), label: <House className="w-5 h-5" /> },
            { href: route("manage.index"), label: "Centres d'administration" },
            { href: route("manage.unit.index"), label: "Gestion d'unité" },
            {
                href: route("manage.unit.show", unit.id),
                label: unit.abbr ?? unit.name,
            },
            { label: "Modifier " + unit.abbr ?? unit.name },
        ],
        []
    );

    return (
        <AuthLayout>
            <Head title={"Modifier " + unit.name} />
            <div className="space-y-4">
                <Breadcrumb items={breadcrubms} />

                <div className="space-y-2">
                    <Heading level={3} className="font-medium">
                        Modifier {unit.name}
                    </Heading>
                    <Text className="sm:text-base text-sm">
                        Utilisez ce formulaire pour modifier les détails de
                        l'unité <span className="font-medium">{unit.name}</span>
                        , et Cliquez sur "Sauvegarder" pour
                        enregistrer vos changements ou "Annuler" pour revenir
                        sans sauvegarder.{" "}
                    </Text>
                </div>

                <EditForm unit={unit} />
            </div>
        </AuthLayout>
    );
};

export default Edit;
