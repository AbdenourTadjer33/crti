import React from "react";
import { Head } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import EditForm from "@/Features/Manage/Unit/Division/EditForm";
import { House } from "lucide-react";

const Edit: React.FC<any> = ({ division, unit, grades }) => {
    const breadcrubms = React.useMemo(
        () => [
            { href: route("app"), label: <House className="w-6 h-6" /> },
            { href: route("manage.index"), label: "Centres d'administration" },
            { href: route("manage.unit.index"), label: "Gestion d'unité" },
            {
                href: route("manage.unit.show", route().params.unit as string),
                label: unit.abbr,
            },
            {
                href: route("manage.unit.division.show", {
                    unit: route().params.unit as string,
                    division,
                }),
                label: division.abbr,
            },
            { label: "modifier " + (division.abbr ?? division.name) },
        ],
        []
    );
    return (
        <div className="space-y-4">
            <Head title="Modifier devision" />
            <Breadcrumb items={breadcrubms} />

            <div>
                <Heading level={3} className="font-medium">
                    Modifier {division.name}
                </Heading>
                <Text className="sm:text-base text-sm">
                    Utilisez ce formulaire pour modifier les détails de la
                    division{" "}
                    <span className=" font-medium">{division.name}</span> au
                    sein de l'unité{" "}
                    <span className="font-medium">{unit.name}</span>. Cliquez
                    sur "Sauvegarder" pour enregistrer vos changements ou
                    "Annuler" pour revenir sans sauvegarder.
                </Text>
            </div>
            <EditForm unit={unit} division={division} grades={grades} />
        </div>
    );
};

// @ts-ignore
Edit.layout = (page) => <AuthLayout children={page} />;

export default Edit;
