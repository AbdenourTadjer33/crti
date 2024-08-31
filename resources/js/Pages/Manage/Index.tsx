import AuthLayout from "@/Layouts/AuthLayout";
import { Head, Link } from "@inertiajs/react";
import { capitalize } from "@/Utils/helper";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { ArrowRightCircle, House } from "lucide-react";

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
        <>
            <Head title="Centre d'administration" />

            <div className="space-y-4">
                <Breadcrumb items={breadcrumbs} MAX_ITEMS={2} />

                <div className="flex sm:flex-row flex-col justify-between sm:items-center gap-4">
                    <div className="space-y-2">
                        <Heading level={3} className="font-medium">
                            Centre d'administration
                        </Heading>

                        <Text className={"max-w-7xl"}>
                            Votre modèle de tableau de bord de gestion d'accées.
                        </Text>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    {apps.map((app, idx) => (
                        <Link
                            key={idx}
                            href={app.link}
                            className="group bg-white hover:bg-gray-50 p-4 flex items-center justify-between gap-4 rounded shadow w-full max-w-sm"
                        >
                            <Heading level={6} className="text-gray-800">
                                {capitalize(app.title)}
                            </Heading>
                            {/* <Button variant="outline" size="sm"> */}
                            <ArrowRightCircle className="h-6 w-6 text-primary-700 group-hover:text-gray-700" />
                            {/* </Button> */}
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}


// @ts-ignore
Index.layout = (page) => {
    return <AuthLayout children={page} />;
};

export default Index;
