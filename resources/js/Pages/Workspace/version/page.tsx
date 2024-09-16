import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import WorkspaceLayout from "@/Layouts/workspace-layout";
import { Head, Link } from "@inertiajs/react";
import * as Card from "@/Components/ui/card";
import { buttonVariants } from "@/Components/ui/button";
import ReadMore from "@/Components/common/read-more";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import UserAvatar from "@/Components/common/user-hover-avatar";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

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

            <div className="flex items-center flex-wrap gap-2">
                {versions.map((version, idx) => (
                    <Card.Card
                        key={idx}
                        className="p-4 flex justify-between items-end gap-2 max-w-sm"
                    >
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-start gap-2">
                                <div className="flex items-center">
                                    <UserAvatar
                                        user={version.user}
                                        className="sm:h-8 sm:w-8 sm:text-sm"
                                    />
                                </div>

                                <ReadMore
                                    charLimit={75}
                                    text={version.reason}
                                    readMoreText="Lire plus"
                                    readLessText="Lire moins"
                                    classNames={{
                                        readLess: "ml-1",
                                        readMore: "ml-2",
                                        content: "text-justify",
                                    }}
                                />
                            </div>

                            <p>
                                {formatDistanceToNow(version.suggestedAt, {
                                    addSuffix: true,
                                    locale: fr,
                                })}
                            </p>
                        </div>
                        <Link
                            href={route("workspace.suggested.version.show", {
                                project: route().params.project,
                                version: version.id,
                            })}
                            className={buttonVariants({
                                variant: "primary",
                            })}
                        >
                            Voir
                        </Link>
                    </Card.Card>
                ))}
            </div>
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
