import Breadcrumb from "@/Components/common/breadcrumb";
import { Button } from "@/Components/ui/button";
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
import { Head, router } from "@inertiajs/react";
import { compareDesc, format, parseISO } from "date-fns";
import { CheckCircleIcon, House, XCircleIcon } from "lucide-react";
import React from "react";

interface ProjectShowProps {
    project: Project;
    board: Board;
}

const Show: React.FC<ProjectShowProps> = ({ board, project }) => {
    const breadcrumbs = React.useMemo(
        () => [
            { href: route("app"), label: <House className="w-5 h-5" /> },
            {
                href: route("board.index"),
                label: "Espace conseil scientifique",
            },
            {
                label: `${board.code}`,
            },
        ],
        []
    );

    const [processing, setProcessing] = React.useState(false);
    const { uuid } = useUser("uuid");

    const president = React.useMemo(
        () => board.users.find((u) => u.uuid === board.president),
        []
    );

    const usersWithComments = React.useMemo(
        () =>
            board.users
                .filter((user) => user.comment)
                .sort((a, b) =>
                    compareDesc(parseISO(a.updatedAt), parseISO(b.updatedAt))
                ),
        [board.users]
    );

    const canComment = React.useMemo(
        () => !usersWithComments.some((u) => u.uuid === uuid),
        [usersWithComments]
    );

    const displayConfirmationCard = React.useMemo(() => {
        if (board.president !== uuid || board.decision !== undefined)
            return false;

        for (const user of board.users) {
            if (!user.comment) return false;
        }

        return true;
    }, [JSON.stringify(board)]);

    return (
        <div className="space-y-4">
            <Head title={board.code} />
            <Breadcrumb items={breadcrumbs} />

            <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                <div className="space-y-2">
                    <Heading level={3} className="font-medium">
                        {board.code}
                    </Heading>

                    <Text className="sm:text-base text-sm">
                        Consulter les détails du projet. Vous trouverez ici des
                        informations complètes sur le projet. Laissez un
                        commentaire ainsi qu'un avis favorable ou défavorable
                        pour exprimer votre opinion.
                    </Text>
                </div>
            </div>

            <Card.Card className="bg-white p-4">
                <Card.CardTitle className="text-xl">
                    Informations sur le conseil
                </Card.CardTitle>

                <ul className="mt-2 space-y-2">
                    <li>
                        <strong>Code du conseil:</strong> {board.code}
                    </li>
                    <li>
                        <strong>Président du conseil:</strong> {president?.name}
                    </li>
                    <li>
                        <strong>Période d'évaluation:</strong>{" "}
                        {format(board.judgment_period.from, "dd/MM/yyyy")} -{" "}
                        {format(board.judgment_period.to, "dd/MM/yyyy")}
                    </li>
                    <li>
                        <strong>Membres:</strong>{" "}
                        {board.users.map((u) => u.name).join(", ")}
                    </li>

                    <li>
                        <strong>Décision:</strong>{" "}
                        {board.decision === undefined
                            ? "Aucune décision"
                            : board.decision
                            ? "Projet accepté"
                            : "Projet refusé"}
                    </li>
                </ul>
            </Card.Card>

            <ResizablePanelGroup direction="horizontal" className=" space-x-2">
                <ResizablePanel>
                    <div className="h-[55rem] overflow-y-auto rounded-lg snap-mandatory snap-x scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thin">
                        <ProjectDetails project={project} />
                    </div>
                </ResizablePanel>
                {displayConfirmationCard && (
                    <>
                        <ResizableHandle withHandle />
                        <ResizablePanel className="w-full">
                            <Card.Card className="p-4 bg-white h-[55rem] w-full flex flex-col">
                                <div className="space-y-2">
                                    <Heading
                                        level={4}
                                        className="font-semibold"
                                    >
                                        Évaluer et décider si le projet doit se
                                        poursuivre ou être arrêté
                                    </Heading>

                                    <Text>
                                        Bienvenue au comité de décision du
                                        projet. En tant que président du conseil
                                        d'administration, vous avez le pouvoir
                                        de prendre des décisions cruciales
                                        concernant l'avenir du projet. Voici ce
                                        que vous pouvez faire
                                    </Text>

                                    <Text>
                                        <strong>
                                            Examiner les détails du projet
                                        </strong>{" "}
                                        : lire attentivement à travers la
                                        présentation du projet, ses objectifs,
                                        et l'état actuel. Assurez-vous de
                                        comprendre les objectifs du projet et
                                        son alignement avec notre stratégie
                                        priorités.
                                    </Text>

                                    <div>
                                        <Text className="space-y-2">
                                            <strong>
                                                Prendre une décision
                                            </strong>
                                            :
                                        </Text>
                                        <ul className="list-inside list-disc">
                                            <li>
                                                <strong>
                                                    Accepter le projet:
                                                </strong>{" "}
                                                Cliquez sur ce bouton si vous
                                                estimez que le projet est prêt à
                                                démarrer et qu'il est aligné
                                                avec nos objectifs stratégiques.
                                                En choisissant cette option, le
                                                statut du projet sera mis à jour
                                                en "En instance," indiquant que
                                                le projet a été accepté et qu'il
                                                peut commencer.
                                            </li>
                                            <li>
                                                <strong>
                                                    Refuser le projet:
                                                </strong>{" "}
                                                Si vous avez des doutes quant à
                                                la faisabilité du projet ou s'il
                                                ne correspond pas aux attentes
                                                et aux objectifs définis,
                                                utilisez ce bouton pour refuser
                                                le projet. Cette action mettra à
                                                jour le statut du projet en
                                                "Rejeté," ce qui signifie que le
                                                projet ne poursuivra pas son
                                                développement.
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 min-w-[30rem] max-w-lg mx-auto mt-auto">
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => {
                                            if (
                                                !confirm(
                                                    "Veuillez confirmer votre action"
                                                )
                                            )
                                                return;
                                            router.post(
                                                route(
                                                    "board.reject",
                                                    route().params.board
                                                ),
                                                {},
                                                {
                                                    onBefore: () =>
                                                        setProcessing(true),
                                                    onFinish: () =>
                                                        setProcessing(false),
                                                }
                                            );
                                        }}
                                    >
                                        Refuser le projet
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="w-full"
                                        onClick={() => {
                                            if (
                                                !confirm(
                                                    "Veuillez confirmer votre action"
                                                )
                                            )
                                                return;

                                            router.post(
                                                route(
                                                    "board.accept",
                                                    route().params.board
                                                ),
                                                {},
                                                {
                                                    onBefore: () =>
                                                        setProcessing(true),
                                                    onFinish: () =>
                                                        setProcessing(false),
                                                }
                                            );
                                        }}
                                        disabled={processing}
                                    >
                                        Accepter le projet
                                    </Button>
                                </div>
                            </Card.Card>
                        </ResizablePanel>
                    </>
                )}
                <ResizableHandle withHandle />
                <ResizablePanel className="lg:max-w-lg max-w-md">
                    <Card.Card className="bg-white h-[55rem] w-full flex flex-col items-stretch gap-2">
                        {!!usersWithComments.length ? (
                            <div className="overflow-y-auto divide-y">
                                {board.decision !== undefined && (
                                    <div className="p-4">
                                        <div
                                            className={`p-4 rounded-md shadow-md ${
                                                board.decision
                                                    ? "bg-green-100"
                                                    : "bg-red-100"
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                {board.decision ? (
                                                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                                ) : (
                                                    <XCircleIcon className="h-6 w-6 text-red-600" />
                                                )}
                                                <div className="ml-4">
                                                    <h3
                                                        className={`text-lg font-bold ${
                                                            board.decision
                                                                ? "text-green-700"
                                                                : "text-red-700"
                                                        }`}
                                                    >
                                                        {board.decision
                                                            ? "Projet accepté"
                                                            : "Projet refusé"}
                                                    </h3>
                                                    <p className="text-sm text-gray-700">
                                                        <strong>
                                                            {president?.name}
                                                        </strong>
                                                        {` à ${
                                                            board.decision
                                                                ? "accepté"
                                                                : "rejeté"
                                                        } le projet.`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {usersWithComments.map((user) => (
                                    <CommentCard
                                        key={user.uuid}
                                        user={user}
                                        isPresident={
                                            user.uuid === board.president
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="my-auto text-center">
                                Aucun commentaire disponible
                            </div>
                        )}

                        {canComment && (
                            <div className="mt-auto border-t">
                                <AddCommentForm board={board} />
                            </div>
                        )}
                    </Card.Card>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

// @ts-ignore
Show.layout = (page) => {
    return <AuthLayout children={page} />;
};

export default Show;
