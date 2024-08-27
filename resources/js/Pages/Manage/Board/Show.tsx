import Breadcrumb from "@/Components/common/breadcrumb";
import { Button, buttonVariants } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import Table from "@/Features/Manage/Board/User/Table";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head, Link } from "@inertiajs/react";
import { House } from "lucide-react";
import React from "react"

const Show: React.FC<any> = ({ board }) => {
    const breadcrumbs = React.useMemo(
        () => [
            { href: route("app"), label: <House className="w-5 h-5" /> },
            { href: route("manage.index"), label: "Centres d'administration" },
            {
                href: route("manage.board.index", route().params.board as string),
                label: "Gestion des conseils scientifique",
            },
            {
                label: board.abbr ?? board.name,
            },
        ],
        []
    );
    return(
             <AuthLayout>
            <Head title={board.name} />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} />

                <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            {board.name} {board.abbr && "-" + board.abbr + "-"}
                        </Heading>

                        <Text className="sm:text-base text-sm">
                            Consultez les informations complètes sur le conseil scientifique {" "}
                            <span className=" font-medium">{board.name}</span>.
                            vous trouverez une liste des membres associées à
                            ce conseil scientifique. Vous pouvez voir les détails et accéder aux
                            options pour le modifier ou le supprimer.
                        </Text>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>{board.abbr}</CardTitle>
                        <CardDescription className="">
                            <span className="font-medium">{board.name}</span>


                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                            {board.description}
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
                <pre>{JSON.stringify(board.users, null, 2)}</pre>

            </div>
        </AuthLayout>

    );
}

export default Show;
