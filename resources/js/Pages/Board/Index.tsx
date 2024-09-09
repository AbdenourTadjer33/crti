import AuthLayout from "@/Layouts/AuthLayout";
import { Head } from "@inertiajs/react";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { Board, Pagination } from "@/types";
import Table from "@/Features/Board/Table";
import { House, Info } from "lucide-react";
import Breadcrumb from "@/Components/common/breadcrumb";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";

interface BoardsProps {
    boards: Pagination<Board>;
}
const breadcrumbs = [
    { href: route("board.index"), label: <House className="w-5 h-5" /> },
    { label: "Espace conseil scientifique" },
];

const Index: React.FC<BoardsProps> = ({ boards }) => {
    return (
        <div className="space-y-4">
            <Head title="Espace conseil scientifique" />
            <Breadcrumb items={breadcrumbs} MAX_ITEMS={2} />
            <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
                <div className="space-y-2">
                    <Heading level={3} className="font-medium">
                        Espace conseil scientifique
                    </Heading>
                    <Text>
                        Découvrez les conseils scientifiques auxquels vous
                        participez et contribuez activement à l'évaluation et au
                        succès de nos projets de recherche.
                    </Text>
                </div>
            </div>

            {boards.meta.total === 0 ? (
                <Alert variant="info" className="space-y-2">
                    <AlertTitle className="flex items-center">
                        <Info className="shrink-0 h-6 w-6 mr-2" />
                        Vous n'avez pas de conseil à venir ou en cours
                    </AlertTitle>
                    <AlertDescription>
                        Vous recevez une notification dès que vous êtes associé
                        à un nouveau conseil.
                    </AlertDescription>
                </Alert>
            ) : (
                <Table boards={boards} />
            )}
        </div>
    );
};

// @ts-ignore
Index.layout = (page) => <AuthLayout children={page} />;

export default Index;
