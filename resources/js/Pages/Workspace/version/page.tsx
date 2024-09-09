import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import WorkspaceLayout from "@/Layouts/workspace-layout";
import { Head, Link, usePage } from "@inertiajs/react";
import * as Card from "@/Components/ui/card";
import { Button, buttonVariants } from "@/Components/ui/button";
import ReadMore from "@/Components/common/read-more";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import UserAvatar from "@/Components/common/user-hover-avatar";

const Page: React.FC<{ versions: any[] }> = ({ versions }) => {
    if (!versions.length) {
        return (
            <div className="space-y-2">
                <Head title="Aucune Version Proposée pour l’Instant" />
                
                <Heading level={3} className="font-medium">
                    Aucune Version Proposée pour l’Instant
                </Heading>

                <Text className="text-sm sm:text-base">
                    Il n’y a actuellement aucune version proposée pour ce
                    projet. Les membres de l’équipe peuvent suggérer des mises à
                    jour ou des modifications, et elles apparaîtront ici pour
                    votre examen. Vous recevrez une notification dès qu'une
                    nouvelle version sera suggérée.
                </Text>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Head title="Versions Proposées à Examiner" />

            <div className="space-y-2">
                <Heading level={3} className="font-medium">
                    Versions Proposées à Examiner
                </Heading>

                <Text className="text-sm sm:text-base">
                    Découvrez toutes les versions proposées de ce projet par les
                    membres de l'équipe. Passez en revue, comparez et décidez
                    quelles mises à jour accepter ou modifier pour améliorer le
                    projet. Vous recevrez des notifications dès qu'une nouvelle
                    version sera suggérée, vous tenant ainsi informé des
                    dernières contributions.
                </Text>
            </div>

            <ul>
                {versions.map((version, idx) => (
                    <li key={idx}>
                        <Card.Card className="p-2 flex justify-between items-end gap-20">
                            <div className="flex flex-col">
                                <div>
                                    {version.id}
                                    <br />
                                    <ReadMore text={version.reason} />
                                    <br />
                                </div>
                                <div className="flex items-center">
                                    <UserAvatar user={version.user} />
                                </div>
                            </div>
                            <Link
                                href={route(
                                    "workspace.suggested.version.show",
                                    {
                                        project: route().params.project,
                                        version: version.id,
                                    }
                                )}
                                className={buttonVariants({
                                    variant: "primary",
                                })}
                            >
                                Voir
                            </Link>
                        </Card.Card>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// @ts-ignore
Page.layout = (page) => (
    <AuthLayout>
        <WorkspaceLayout children={page} />
    </AuthLayout>
);

export default Page;
