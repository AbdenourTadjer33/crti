import * as React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import {MdHome} from "react-icons/md";
import Breadcrumb from "@/Features/Breadcrumb/Breadcrumb";
import {Heading} from "@/Components/ui/heading"
import {Text} from "@/Components/ui/paragraph";
import {Button} from "@/Components/ui/button"
import {MdAdd} from "react-icons/md";


const breadcrumbs = [
    {href: route("app"), label: <MdHome className="w-6 h-6"/>},
    {label: "Mes projets"}
];

const Index = () => {
    return (
        <AuthLayout>
            <Head title="Mes projet" />

            <div className="space-y-4">
            <Breadcrumb items={breadcrumbs}/>

            <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                <div className="space-y-2">
                    <Heading level={3} className="font-medium">
                        Mes projets
                    </Heading>

                    <Text className={"max-w-7xl"}>
                        Votre modèle de tableau de bord de gestion d'accées.
                    </Text>
                </div>

                <Button asChild>
                    <Link href={route('project.create')}>
                        <MdAdd className="w-4 h-4 mr-2"/>Ajouter
                    </Link>
                </Button>
            </div>
        </div>
        </AuthLayout>
    );
};

export default Index;
