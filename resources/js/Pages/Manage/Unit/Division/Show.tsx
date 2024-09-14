import React from "react";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Button, buttonVariants } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import Table from "@/Features/Manage/Unit/Division/User/Table";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head, Link, router } from "@inertiajs/react";
import { House } from "lucide-react";

const Show: React.FC<any> = ({ unit, division }) => {
    const breadcrumbs = React.useMemo(
        () => [
            { href: route("app"), label: <House className="w-5 h-5" /> },
            { href: route("manage.index"), label: "Centres d'administration" },
            {
                href: route("manage.unit.index", route().params.unit as string),
                label: "Gestion d'unité",
            },
            {
                href: route("manage.unit.show", route().params.unit as string),
                label: unit.abbr,
            },
            { label: division.abbr },
        ],
        []
    );

    return (
        <div className="space-y-4">
            <Head title={division.name} />
            <Breadcrumb items={breadcrumbs} />

            <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                <div className="space-y-2">
                    <Heading level={3} className="font-medium">
                        {division.name}{" "}
                        {division.abbr && "-" + division.abbr + "-"}
                    </Heading>

                    <Text className="sm:text-base text-sm"></Text>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{division.abbr}</CardTitle>
                    <CardDescription className="">
                        <span className="font-medium">{division.name}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                        {division.description}
                    </Text>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                    <Link
                        href={route("manage.unit.division.edit", {
                            unit: route().params.unit as string,
                            division,
                        })}
                        className={buttonVariants({
                            variant: "secondary",
                        })}
                    >
                        Modifier
                    </Link>
                    <Button
                        variant="destructive"
                        onClick={() => {
                            if (
                                !confirm(
                                    "Vous voulez vraiment supprimer cette division ?"
                                )
                            )
                                return;
                            router.delete(
                                route("manage.unit.division.destroy", {
                                    unit: unit.id,
                                    division: division.id,
                                })
                            );
                        }}
                    >
                        Supprimer
                    </Button>
                </CardFooter>
            </Card>

            <Table users={division.users} />
        </div>
    );
};

// @ts-ignore
Show.layout = (page) => <AuthLayout children={page} />;

export default Show;
