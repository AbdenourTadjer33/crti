import Breadcrumb from "@/Components/common/breadcrumb";
import { Button, buttonVariants } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardSubTitle,
    CardTitle,
} from "@/Components/ui/card";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import Table from "@/Features/Manage/Board/User/Table";
import AuthLayout from "@/Layouts/AuthLayout";
import { Board } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { House } from "lucide-react";
import React from "react";

interface BoardsProps {
    board: Board;
}

const Show: React.FC<BoardsProps> = ({ board }) => {
    const breadcrumbs = React.useMemo(
        () => [
            { href: route("app"), label: <House className="w-5 h-5" /> },
            { href: route("manage.index"), label: "Centres d'administration" },
            {
                href: route(
                    "manage.board.index",
                    route().params.board as string
                ),
                label: "Gestion des conseils scientifique",
            },
            {
                label: board.name,
            },
        ],
        []
    );
    return (
        <>
            <Head title={board.name} />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} />

                <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            {board.name}
                        </Heading>

                        <Text className="sm:text-base text-sm">
                            Consultez les informations complètes sur le conseil
                            scientifique{" "}
                            <span className=" font-medium">{board.name}</span>.
                            vous trouverez une liste des membres associées à ce
                            conseil scientifique. Vous pouvez voir les détails
                            et accéder aux options pour le modifier ou le
                            supprimer.
                        </Text>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>{board.name}</CardTitle>
                        <CardSubTitle className="text-base">
                            <Link
                                href={route(
                                    "manage.user.show",
                                    board.president.uuid
                                )}
                            >
                                {board.president.name + " " + "(President)"}
                            </Link>
                        </CardSubTitle>
                        <CardDescription className="">
                            <span className="font-medium">
                                {board.description}
                            </span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Text>
                            <span className="text-sm">
                                Projeet en commission:{" "}
                            </span>
                            {board.project.name}
                        </Text>
                    </CardContent>
                    <CardFooter className="justify-end gap-2">
                        <Link
                            href={route("manage.board.edit", {
                                board: route().params.board as string,
                            })}
                            className={buttonVariants({
                                variant: "secondary",
                            })}
                        >
                            Modifier
                        </Link>
                        <Button variant="destructive">Supprimer</Button>
                    </CardFooter>
                </Card>
                <Table users={board.users} />
            </div>
            <pre>{JSON.stringify(board, null, 2)}</pre>
        </>
    );
};

// @ts-ignore
Show.layout = (page) => {
    return <AuthLayout children={page} />;
};

export default Show;
