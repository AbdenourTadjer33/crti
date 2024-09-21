import React from "react";
import Projects from "@/Features/Workspace/projects";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head } from "@inertiajs/react";
import { House } from "lucide-react";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";

const breadcrumbs = [
    { href: route("app"), label: <House className="h-5 w-5" /> },
    { label: "Espace de travail" },
];

const Page: React.FC<any> = ({ projects }) => (
    <div className="space-y-4">
        <Head title="Espace de travail" />
        <Breadcrumb items={breadcrumbs} MAX_ITEMS={2} />

        <div className="space-y-2">
            <Heading level={3} className="font-medium">
                Espace de travail
            </Heading>

            <Text className="text-sm sm:text-base">
            L'espace de travail est dédié aux chefs de projet et aux membres
            d'équipe pour collaborer sur des projets en cours. Ici, les utilisateurs
            peuvent gérer et suivre facilement leurs projets en sélectionnant parmi une
            liste de projets auxquels ils participent. Que vous supervisiez l'avancement
            en tant que chef de projet ou que vous contribuez en tant que membre de l'équipe,
            l'espace de travail vous offre les outils et les informations nécessaires pour rester
            à jour et engagé dans vos projets.
            </Text>
        </div>

        <Projects projects={projects} />
    </div>
);

// @ts-ignore
Page.layout = (page) => <AuthLayout children={page} />;

export default Page;
