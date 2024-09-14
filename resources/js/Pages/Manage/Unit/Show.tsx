import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { Button, buttonVariants } from "@/Components/ui/button";
import { Globe, House, MapPin } from "lucide-react";
import Table from "@/Features/Manage/Unit/Division/Table";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardSubTitle,
    CardTitle,
} from "@/Components/ui/card";

const Show: React.FC<any> = ({ unit }) => {
    const breadcrumbs = React.useMemo(
        () => [
            { href: route("app"), label: <House className="w-5 h-5" /> },
            { href: route("manage.index"), label: "Centres d'administration" },
            {
                href: route("manage.unit.index"),
                label: "Gestion d'unité",
            },
            { label: unit.abbr },
        ],
        []
    );

    return (
        <div className="space-y-4">
            <Head title={unit.name} />
            <Breadcrumb items={breadcrumbs} />

            <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                <div className="space-y-2">
                    <Heading level={3} className="font-medium">
                        {`${unit.name} -${unit.abbr}-`}
                    </Heading>

                    <Text className="sm:text-base text-sm">
                        Consultez les informations complètes sur l'unité{" "}
                        <span className=" font-medium">{unit.name}</span>. vous
                        trouverez une liste des divisions associées à cette
                        unité. Vous pouvez voir les détails de chaque division,
                        et accéder à des options pour les modifier ou les
                        supprimer.
                    </Text>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{unit.abbr}</CardTitle>
                    <CardSubTitle>{unit.name}</CardSubTitle>
                    <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                        {unit.webpage && (
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                <a
                                    href={unit.webpage}
                                    target="_blank"
                                    className="text-blue-700 underline"
                                >
                                    {unit.webpage}
                                </a>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{unit.address}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Text>{unit?.description}</Text>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                    <Link
                        href={route(
                            "manage.unit.edit",
                            route().params.unit as string
                        )}
                        className={buttonVariants({
                            variant: "secondary",
                        })}
                    >
                        Modifier
                    </Link>
                    <Button variant="destructive">Supprimer</Button>
                </CardFooter>
            </Card>

            <Table divisions={unit.divisions} />
        </div>
    );
};

// @ts-ignore
Show.layout = (page) => <AuthLayout children={page} />;

export default Show;
