import AuthLayout from "@/Layouts/AuthLayout";
import { Head, Link } from "@inertiajs/react";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { Board, Pagination } from "@/types";
import Table from "@/Features/Board/Table";
import { House } from "lucide-react";
import Breadcrumb from "@/Components/common/breadcrumb";

interface BoardsProps {
    boards: Board[];
}
const breadcrumbs = [
    { href: route("board.index"), label: <House className="w-5 h-5" /> },
    { label: "Espace conseil scientifique" },
];

const Index: React.FC<BoardsProps> = ({ boards }) => {
    return (
        <AuthLayout>
            <Head title="board" />
            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} MAX_ITEMS={2} />
                <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            Espace conseil scientifique
                        </Heading>
                        <Text className={"max-w-7xl"}>
                            Voici la liste de tout les  conseils scientifiques auxquels vous appartenez.
                        </Text>
                    </div>
                </div>
                <div className="space-y-4">
                    <Table boards={boards} />
                </div>
            </div>
        </AuthLayout>
    );
};
export default Index;
