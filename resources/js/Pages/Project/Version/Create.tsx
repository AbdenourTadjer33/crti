import * as React from "react";
import { Head } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import { MdHome } from "react-icons/md";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import Form from "@/Features/Project/Create/Form";

const breadcrubms = [
    { href: route("app"), label: <MdHome className="w-6 h-6" /> },
    { href: route("project.index"), label: "Mes projets" },
    { label: "Créer projet" },
];

const create: React.FC<any> = ({ version }) => (
    <AuthLayout>
        <Head title="Créer projet" />
        <div className="space-y-4">
            <Breadcrumb items={breadcrubms} />

            <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                <div className="space-y-2">
                    <Heading level={3} className="font-medium">
                        Créer un nouveau projet
                    </Heading>
                    <Text className={"max-w-7xl"}>
                        Votre modèle de tableau de bord de gestion d'accées.
                    </Text>
                </div>
            </div>

            <Form version={version?.data} params={version?.params} />
        </div>
    </AuthLayout>
);

export default create;
