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
import { cn } from "@/Utils/utils";
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
                label: board.code,
            },
        ],
        []
    );
    return (
        <>
            <Head title={board.code} />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} />

                <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            {board.code}
                        </Heading>

                        <Text className="sm:text-base text-sm">
                            Consultez les informations complètes sur le conseil
                            scientifique{" "}
                            <span className=" font-medium">{board.code}</span>.
                            vous trouverez une liste des membres associées à ce
                            conseil scientifique. Vous pouvez voir les détails
                            et accéder aux options pour le modifier ou le
                            supprimer.
                        </Text>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>{board.code}</CardTitle>
                        <CardSubTitle>
                            {
                                board.users?.find(
                                    (u) => u.uuid === board.president
                                )?.name
                            }{" "}
                            <span className="font-medium">(Président)</span>
                        </CardSubTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Text>
                            Projet{" "}
                            <Link
                                href={route("project.show", board.project.code)}
                                className={cn(
                                    buttonVariants({ variant: "link" }),
                                    "p-0 font-medium"
                                )}
                            >
                                {board.project.name}
                            </Link>
                        </Text>

                        <Table users={board.users} />
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
            </div>
        </>
    );
};

// @ts-ignore
Show.layout = (page) => {
    return <AuthLayout children={page} />;
};

export default Show;
