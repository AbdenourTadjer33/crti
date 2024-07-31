import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import { MdHome } from "react-icons/md";
import Breadcrumb from "@/Components/Breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import Table from "@/Features/Manage/Unit/Division/Table";
import { Button } from "@/Components/ui/button";
import { Plus } from "lucide-react";

const Create: React.FC<any> = ({ divisions, unit }) => {
    const breadcrubms = React.useMemo(
        () => [
            { href: route("app"), label: <MdHome className="w-6 h-6" /> },
            { href: route("manage.index"), label: "Centres d'administration" },
            {
                href: route("manage.unit.index", route().params.unit as string),
                label: "Gestion d'unité",
            },
            {
                href: route("manage.unit.show", route().params.unit as string),
                label: unit.name,
            },

            { label: "Gerer les divisions" },
        ],
        []
    );

    return (
        <AuthLayout>
            <Head title="gerer devision" />

            <div className="space-y-4">
                <Breadcrumb items={breadcrubms} />

                <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            Les divisions de {unit.name}{" "}
                        </Heading>

                        <Text className={"max-w-7xl"}>
                            Votre modèle de tableau de bord de gestion d'accées.
                        </Text>
                    </div>

                    <Button asChild>
                        <Link
                            href={route(
                                "manage.unit.division.create",
                                route().params.unit as string
                            )}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter
                        </Link>
                    </Button>
                </div>

                <Table divisions={divisions} />
            </div>
        </AuthLayout>
    );
};

export default Create;
