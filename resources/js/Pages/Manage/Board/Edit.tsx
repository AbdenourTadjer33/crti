import React from "react";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import Breadcrumb from "@/Components/common/breadcrumb";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head } from "@inertiajs/react";
import { House } from "lucide-react";
import EditForm from "@/Features/Manage/Board/EditForm";

const Edit: React.FC<{ board: any }> = ({ board }) => {
    const breadcrubms = React.useMemo(
        () => [
            { href: route("app"), label: <House className="w-5 h-5" /> },
            { href: route("manage.index"), label: "Centres d'administration" },
            { href: route("manage.board.index"), label: "Gestion des conseils scientifique" },
            {
                href: route("manage.board.show", board.id),
                label: board.abbr ?? board.name,
            },
            { label: "Modifier " + board.abbr || board.name },
        ],
        []
    );
    return (
        <AuthLayout>
            <Head title={"Modifier " + board.name} />
            <div className="space-y-4">
                <Breadcrumb items={breadcrubms} />

                <div className="space-y-2">
                    <Heading level={3} className="font-medium">
                        Modifier {board.name}
                    </Heading>
                    <Text className="sm:text-base text-sm">
                        Utilisez ce formulaire pour modifier les détails du
                        conseil scientifique <span className="font-medium">{board.name}</span>
                        , et Cliquez sur "Sauvegarder" pour
                        enregistrer vos changements ou "Annuler" pour revenir
                        sans sauvegarder.{" "}
                    </Text>
                </div>
                <EditForm board={board} />
            </div>
        </AuthLayout>
    );
};
export default Edit;
