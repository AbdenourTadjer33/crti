import React from "react";
import { Head } from "@inertiajs/react";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import { House } from "lucide-react";

import Form from "@/Features/Project/Version/Edit/Form";

const Create: React.FC<any> = ({ version }) => {
    const { data, params } = version;
    const breadcrubms = React.useMemo(
        () => [
            { href: route("app"), label: <House className="w-5 h-5" /> },
            { href: route("project.index"), label: "Projets" },
            {
                href: route("project.show", route().params.project as string),
                label: data.name,
            },
            {
                label: (
                    <>
                        Continue la version de{" "}
                        <span className="font-medium">{data.name}</span>
                    </>
                ),
            },
        ],
        []
    );

    return (
        <AuthLayout>
            <Head title={`Continue la version de ${data.name}`} />
            <div className="space-y-4">
                <Breadcrumb items={breadcrubms} />

                <div className="space-y-2">
                    <Heading level={3} className="font-medium">
                        Continue la version de{" "}
                        <span className="font-semibold">
                            {data.name}
                        </span>
                    </Heading>
                    <Text>
                        Sur cette page, vous pouvez consulter l'état actuel du
                        projet et proposer des mises à jour en soumettant une
                        nouvelle version. Apportez toutes les modifications
                        nécessaires aux détails du projet et soumettez votre
                        version pour examen. Une fois soumise, votre version
                        sera disponible pour que les autres membres puissent
                        l'examiner et éventuellement la finaliser en tant que
                        version officielle du projet.
                    </Text>
                </div>

                <Form version={version?.data} params={version?.params} />
            </div>
        </AuthLayout>
    );
};

export default Create;
