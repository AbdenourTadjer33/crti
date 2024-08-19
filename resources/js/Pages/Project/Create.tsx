import React from "react";
import { Head } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import { MdHome } from "react-icons/md";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import Breadcrumb from "@/Components/Breadcrumb";
import Form from "@/Features/Project/Version/Create/Form";

const create: React.FC<any> = ({ version }) => {
    const isStarting = React.useMemo(() => !version, []);

    const breadcrubms = React.useMemo(
        () => [
            { href: route("app"), label: <MdHome className="w-6 h-6" /> },
            { href: route("project.index"), label: "Projets" },
            {
                label: isStarting
                    ? "Commencez Votre Projet"
                    : "Continuez Votre Projet",
            },
        ],
        []
    );

    return (
        <AuthLayout>
            <Head
                title={
                    isStarting
                        ? "Commencez Votre Projet"
                        : "Continuez Votre Projet"
                }
            />
            <div className="space-y-4">
                <Breadcrumb items={breadcrubms} />

                <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            {isStarting
                                ? "Commencez Votre Projet"
                                : "Continuez Votre Projet"}
                        </Heading>
                        <Text>
                            {isStarting
                                ? `Votre projet a été initialisé avec succès.
                            Maintenant, commençons à le construire ! Cette page
                            est votre espace de travail pour entrer tous les
                            détails importants de votre projet. Prenez le temps
                            de remplir les informations nécessaires. Si vous
                            devez faire une pause, ne vous inquiétez pas—votre
                            progression sera sauvegardée, et vous pourrez
                            revenir à tout moment pour continuer là où vous vous
                            êtes arrêté.`
                                : `Vous êtes de retour ! Continuez à travailler sur
                            votre projet là où vous vous étiez arrêté. Cette
                            page est conçue pour vous aider à finaliser votre
                            projet en vous permettant de revoir, mettre à jour
                            et compléter toutes les sections nécessaires. Si
                            vous vous étiez précédemment interrompu lors de la
                            création initiale, reprenez simplement là où vous
                            vous étiez arrêté. Votre projet est sauvegardé et
                            vous attend dans l'index des projets—cliquez
                            simplement dessus pour reprendre. Une fois que tout
                            est en place, finalisez votre projet et soumettez-le
                            pour révision.`}
                        </Text>
                    </div>
                </div>

                <Form version={version?.data} params={version?.params} />
            </div>
        </AuthLayout>
    );
};

export default create;
