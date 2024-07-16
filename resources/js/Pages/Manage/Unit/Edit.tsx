import React from "react";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import Breadcrumb from "@/Components/Breadcrumb";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head } from "@inertiajs/react";
import { MdHome } from "react-icons/md";
import EditForm from "@/Features/Manage/Unit/EditForm";

const breadcrubms = [
    { href: route("app"), label: <MdHome className="w-6 h-6" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    { href: route("manage.unit.index"), label: "Gestion d'unité" },
    { label: "Modifier unité" },
];

const Edit: React.FC<{}> = () => (
    <AuthLayout>
        <Head title="Modifier unité" />
        <div className="space-y-4">
            <Breadcrumb items={breadcrubms} />

            <div>
                <Heading level={3} className="font-medium">
                    Modifier unité
                </Heading>
                <Text>
                    Votre modèle de tableau de bord de gestion d'accées.
                </Text>
            </div>
            <EditForm />
        </div>
    </AuthLayout>
);

export default Edit;