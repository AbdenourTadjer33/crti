import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { House, Plus } from "lucide-react";
import { Head, Link } from "@inertiajs/react";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { buttonVariants } from "@/Components/ui/button";
import Table from "@/Features/Manage/resource/table";

const breadcrumbs = [
    { href: route("app"), label: <House className="h-5 w-5" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    { label: "Gestion des ressources" },
];

const Index: React.FC<any> = ({ resources }) => {
    return (
        <div className="space-y-4">
            <Head title="Gestion de resources" />
            <Breadcrumb items={breadcrumbs} />

            <div className="flex sm:flex-row flex-col justify-between sm:items-end gap-4">
                <div className="space-y-2">
                    <Heading level={3} className="font-medium">
                        Gestion des ressources
                    </Heading>

                    <Text className="text-sm sm:text-base">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Id explicabo nam facilis ducimus hic, culpa quas quis
                        voluptas commodi vitae accusamus quibusdam. Dolorem quia
                        aspernatur voluptatum deleniti atque sed iste.
                    </Text>
                </div>

                <Link
                    href={route("manage.resource.create")}
                    className={buttonVariants()}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une ressource
                </Link>
            </div>

            <Table resources={resources} />
        </div>
    );
};

// @ts-ignore
Index.layout = (page) => <AuthLayout children={page} />;

export default Index;
