import AuthLayout from "@/Layouts/AuthLayout";
import { Head, Link } from "@inertiajs/react";
import { capitalize } from "@/Utils/helper";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { ArrowRightCircle, House } from "lucide-react";
import { Button } from "@/Components/ui/button";

const apps = [
    {
        title: "Gestion des utilisateurs",
        link: route("manage.user.index"),
    },
    {
        title: "Gestion des roles et permissions",
        link: route("manage.role.index"),
    },
    {
        title: "Gestion des unitées et divisions",
        link: route("manage.unit.index"),
    },
    {
        title: "Gestion des conseils scientifique",
        link: route("manage.board.index"),
    },
    {
        title: "Gestion des projets",
        link: route("manage.project.index"),
    },
    {
        title: "Gestion de resources",
        link: route("manage.resource.index"),
    },
];

const breadcrumbs = [
    { href: route("app"), label: <House className="w-5 h-5" /> },
    { label: "Centre d'administration" },
];

const Index = () => {
    return (
        <div className="space-y-4">
            <Head title="Centre d'administration" />

            <Breadcrumb items={breadcrumbs} MAX_ITEMS={2} />

            <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
                <div className="space-y-2">
                    <Heading level={3} className="font-medium">
                        Centre d'administration
                    </Heading>

                    <Text className="text-sm sm:text-base">
                        Voici votre tableau de bord d'administration, où vous
                        pouvez gérer les utilisateurs, les rôles et permissions,
                        les unités, les conseils scientifiques, les ressources
                        et les projets.
                    </Text>
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                {apps.map((app, idx) => (
                    <Link
                        key={idx}
                        href={app.link}
                        className="group bg-white dark:bg-gray-950 border dark:border-gray-800 hover:shadow-md p-4 flex items-center justify-between gap-4 rounded shadow w-full sm:max-w-sm"
                    >
                        <Heading level={6} className="text-gray-800">
                            {capitalize(app.title)}
                        </Heading>
                        <Button variant="ghost" size="sm" className="hover:text-primary-700 dark:hover:text-primary-600">
                            <ArrowRightCircle className="shrink-0 h-6 w-6" />
                        </Button>
                    </Link>
                ))}
            </div>
        </div>
    );
};

// @ts-ignore
Index.layout = (page) => <AuthLayout children={page} />;

export default Index;
