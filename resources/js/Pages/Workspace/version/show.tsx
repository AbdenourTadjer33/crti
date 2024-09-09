import React from "react";
import { router, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import AuthLayout from "@/Layouts/AuthLayout";
import WorkspaceLayout from "@/Layouts/workspace-layout";
import * as Card from "@/Components/ui/card";

const Show: React.FC<any> = ({ version }) => {
    const [processing, setProcessing] = React.useState(false);

    function accept() {
        const URL = route("project.version.accept", {
            project: route().params.project,
            version: route().params.version,
        });

        router.visit(URL, {
            method: "post",
            onBefore: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    }

    function reject() {
        const URL = route("project.version.reject", {
            project: route().params.project,
            version: route().params.version,
        });

        router.visit(URL, {
            method: "post",
            onBefore: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Heading level={3} className="font-medium">
                    Version {version.id}
                </Heading>

                <Text className="text-sm sm:text-base">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Deleniti dolorum quasi vero dolor blanditiis aut, soluta
                    totam ipsum in amet eos sunt, est nihil aliquid tempora
                    autem consequatur enim earum.
                </Text>
            </div>

            <Card.Card className="p-4">
                <pre>{JSON.stringify(version, null, 2)}</pre>

                <div className="mx-auto max-w-screen-lg flex items-center gap-4">
                    <Button
                        variant="secondary"
                        className="w-full"
                        onClick={reject}
                        disabled={processing}
                    >
                        Rejeter
                    </Button>
                    <Button
                        variant="primary"
                        className="w-full"
                        onClick={accept}
                        disabled={processing}
                    >
                        Accepter
                    </Button>
                </div>
            </Card.Card>
        </div>
    );
};

// @ts-ignore
Show.layout = (page) => (
    <AuthLayout>
        <WorkspaceLayout children={page} />
    </AuthLayout>
);

export default Show;
