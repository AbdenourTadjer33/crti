import React from "react";
import { Head } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import { MdHome } from "react-icons/md";
import Breadcrumb from "@/Components/Breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import CreateForm from "@/Features/Manage/Unit/Division/CreateForm";

const Create: React.FC<any> = ({ unit }) => {
    const breadcrubms = React.useMemo(
        () => [
            { href: route("app"), label: <MdHome className="w-6 h-6" /> },
            { href: route("manage.index"), label: "Centres d'administration" },
            { href: route("manage.unit.index"), label: "Gestion d'unité" },
            {
                href: route("manage.unit.show", route().params.unit as string),
                label: unit.name,
            },
            { label: "Créer division" },
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
                        Créer une nouvelle division pour {unit.name}
                    </Heading>
                    <Text>
                        Votre modèle de tableau de bord de gestion d'accées.
                    </Text>
                </div>

                <CreateForm unit={unit.id} />
            </div>

        </AuthLayout>
    );
};

export default Create;
