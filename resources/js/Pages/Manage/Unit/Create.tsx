import React from "react";
import { Head } from "@inertiajs/react";
import { route } from "@/Utils/helper";
import AuthLayout from "@/Layouts/AuthLayout";
import { MdHome } from "react-icons/md";
import Breadcrumb from "@/Features/Breadcrumb/Breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { FormWrapper } from "@/Components/ui/form";
import CreateForm from "@/Features/Manage/Unit/CreateForm";

const breadcrubms = [
    { href: route("app"), label: <MdHome className="w-6 h-6" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    { href: route("manage.unit.index"), label: "Gestion d'unité" },
    { label: "Créer unité" },
];

const Create: React.FC<{}> = () => {
    return (
        <AuthLayout>
            <Head title={"Créer unité"} />
            <div className="space-y-4">
                <Breadcrumb items={breadcrubms} />

                <div>
                    <Heading level={3} className="font-medium">
                        Créer une nouvelle unité
                    </Heading>
                    <Text>
                        Votre modèle de tableau de bord de gestion d'accées.
                    </Text>
                </div>

                <FormWrapper>
                    <CreateForm />
                </FormWrapper>
            </div>
        </AuthLayout>
    );
};

export default Create;
