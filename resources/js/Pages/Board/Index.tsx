import AuthLayout from "@/Layouts/AuthLayout";
import { Head, Link } from "@inertiajs/react";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { useEffect } from "react";
import { Board } from "@/types";
import { BoardPresidentCard } from "@/Features/Board/BoardPresidentCard";
import Table from "@/Features/Board/Table";


interface BoardsProps {
    boardsAsMember: Board[];
    boardsAsPresident: Board[];
}

export default function Boards({ boardsAsMember, boardsAsPresident }: BoardsProps) {

    return (
        <AuthLayout>
            <Head title="board" />

            <div className="space-y-4">
                <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            Espace conseil scientifique
                        </Heading>

                        <Text className={"max-w-7xl"}>
                            Votre modèle de tableau de bord de gestion d'accées.
                        </Text>
                    </div>
                </div>
                <div className="space-y-4">
                    <Heading level={4}>Président du conseil</Heading>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {boardsAsPresident.map((board) => (
                                <BoardPresidentCard
                                    key={board.id}w
                                    board={board}
                                />
                            ))}
                    </div>
                    <pre>{JSON.stringify(boardsAsPresident, null, 2)}</pre>
                </div>
                <div className="space-y-4">
                    <Heading level={4}>Membre de conseil</Heading>
                    {/* <Table boards={}/> */}
                    <pre>{JSON.stringify(boardsAsMember, null, 2)}</pre>
                </div>
            </div>
        </AuthLayout>
    );
}
