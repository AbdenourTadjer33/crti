import React from "react";
import { Head } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import { MdHome } from "react-icons/md";
import Breadcrumb from "@/Components/Breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import EditForm from "@/Features/Manage/Unit/Division/EditForm";

const Edit: React.FC<any> = ({ division, unit}) => {
    const breadcrubms = React.useMemo(
        () => [
            { href: route("app"), label: <MdHome className="w-6 h-6" /> },
            { href: route("manage.index"), label: "Centres d'administration" },
            { href: route("manage.unit.index"), label: "Gestion d'unité" },
            {
                href: route("manage.unit.show", route().params.unit as string),
                label: unit.name,
            },
            { href: route("manage.unit.division.index", { unit: unit.id }), label: "Gestion des divisions" },
            { label: "modifier division" },
        ],
        []
    );
    return (
        <AuthLayout>
            <Head title="Créer devision" />
            <div className="space-y-4">
                <Breadcrumb items={breadcrubms} />

                <div>
                    <Heading level={3} className="font-medium">
                        {/* Créer une nouvelle division pour {unit.name} */}
                        Modifier division
                    </Heading>
                    <Text>
                        Votre modèle de tableau de bord de gestion d'accées.
                    </Text>
                </div>
                <EditForm unit={unit} division={division} />
                <pre>
                    {JSON.stringify({unit, division, }, null, 2)}
                </pre>

            </div>

        </AuthLayout>
    );
};

export default Edit;
