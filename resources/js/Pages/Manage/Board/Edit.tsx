import React from "react";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import Breadcrumb from "@/Components/common/breadcrumb";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head } from "@inertiajs/react";
import { House } from "lucide-react";
import EditForm from "@/Features/Manage/Board/EditForm";

const Edit: React.FC<any> = ({ board }) => {
    const breadcrubms = React.useMemo(
        () => [
            { href: route("app"), label: <House className="w-5 h-5" /> },
            { href: route("manage.index"), label: "Centres d'administration" },
            {
                href: route("manage.board.index"),
                label: "Gestion des conseils scientifiques",
            },
            { href: route("manage.board.show", board.code), label: board.code },
            { label: `Modifier ${board.code}` },
        ],
        [board]
    );

    return (
        <>
            <Head title={`Modifier ${board.code}`} />
            <div className="space-y-4">
                <Breadcrumb items={breadcrubms} />

                <div className="space-y-2">
                    <Heading level={3} className="font-medium">
                        Modifier {board.code}
                    </Heading>
                    <Text className="sm:text-base text-sm">
                        Utilisez ce formulaire pour modifier les détails du
                        conseil scientifique{" "}
                        <span className="font-medium">{board.code}</span>.
                        Cliquez sur "Sauvegarder" pour enregistrer vos
                        changements ou "Annuler" pour revenir sans sauvegarder.
                    </Text>
                </div>
                <EditForm board={board} />
            </div>
        </>
    );
};

// @ts-ignore
Edit.layout = (page) => {
    return <AuthLayout children={page} />;
};

export default Edit;
