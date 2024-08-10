import * as React from "react";
import { Head } from "@inertiajs/react";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/Breadcrumb";
import { House } from "lucide-react";
import Form from "@/Features/Project/Version/Edit/Form";

const Create: React.FC<any> = ({ version }) => {
    const breadcrubms = React.useMemo(
        () => [
            { href: route("app"), label: <House className="w-5 h-5" /> },
            { href: route("project.index"), label: "Projets" },
            {
                href: route("project.show", route().params.project as string),
                label: version.name,
            },
            { label: "Modifier projet " + version.name },
        ],
        []
    );

    return (
        <AuthLayout>
            <Head title={`Modifier projet ${version.name}`} />
            <div className="space-y-4">
                <Breadcrumb items={breadcrubms} />

                <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            Modifier projet {version.name}
                        </Heading>
                        <Text className={"max-w-7xl"}>
                            Votre modèle de tableau de bord de gestion d'accées.
                        </Text>
                    </div>
                </div>

                <Form version={version} />
                <pre>{JSON.stringify(version, null, 2)}</pre>
            </div>
        </AuthLayout>
    );
};

export default Create;
