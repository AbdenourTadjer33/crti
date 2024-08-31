import Breadcrumb from "@/Components/common/breadcrumb";
import * as Card from "@/Components/ui/card";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/Components/ui/resizable";
import CommentCard from "@/Features/Board/CommentCard";
import AddCommentForm from "@/Features/Board/CommentForm";
import ProjectDetails from "@/Features/Project/ProjectDetails";
import { useUser } from "@/Hooks/use-user";
import AuthLayout from "@/Layouts/AuthLayout";
import { Board } from "@/types";
import { Project } from "@/types/project";
import { Head, Link } from "@inertiajs/react";
import { compareDesc, parseISO } from "date-fns";
import { House } from "lucide-react";
import React from "react";

interface ProjectShowProps {
    project: Project;
    board: any;
}

const Show: React.FC<ProjectShowProps> = ({ board, project }) => {
    const breadcrumbs = React.useMemo(
        () => [
            { href: route("app"), label: <House className="w-5 h-5" /> },
            {
                href: route("board.index"),
                label: "espace conseil scientifique",
            },
            {
                label: `${board.code}`,
            },
        ],
        []
    );

    const { uuid } = useUser("uuid");

    const usersWithComments = React.useMemo(
        () => board.users
            .filter((user) => user.comment)
            .sort((a, b) => compareDesc(parseISO(a.updatedAt), parseISO(b.updatedAt))),
        [board.users]
    );
    

    const canComment = React.useMemo(
        () => !usersWithComments.some((u) => u.uuid === uuid),
        [usersWithComments]
    );
    return (
        <>
            <Head title={project.name + " " + "Board"} />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} />

                <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium"></Heading>

                        <Text className="sm:text-base text-sm">
                        Consulter  les détails du projet.
                        Vous trouverez ici des informations complètes sur le projet.
                        Laissez un commentaire ainsi qu'un avis favorable ou défavorable pour exprimer votre opinion.
                        </Text>
                    </div>
                </div>
                <ResizablePanelGroup
                    direction="horizontal"
                    className=" space-x-2"
                >
                    <ResizablePanel>
                        <div className="h-[43rem] overflow-y-auto rounded-lg snap-mandatory snap-x scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thin">
                            <ProjectDetails project={project} />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel className="lg:max-w-lg max-w-md">
                        <Card.Card className="bg-white h-[43rem] w-full flex flex-col items-stretch gap-2">
                            <div className="overflow-y-auto divide-y">
                                {!!usersWithComments.length ? (
                                    usersWithComments.map((user) => (
                                        <CommentCard
                                            key={user.uuid}
                                            user={user}
                                            isPresident={user.uuid === board.president.uuid}
                                        />
                                    ))
                                ) : (
                                    <p className="my-auto text-center">
                                        Aucun commentaire disponible
                                    </p>
                                )}
                            </div>
                            {canComment && (
                                <div className="mt-auto border-t">
                                    <AddCommentForm board={board} />
                                </div>
                            )}
                        </Card.Card>
                    </ResizablePanel>
                </ResizablePanelGroup>
                <pre>
                    {JSON.stringify(board, null, 2)}
                </pre>
            </div>
        </>
    );
};

// @ts-ignore
Show.layout = (page) => {
    return <AuthLayout children={page} />;
};

export default Show;
