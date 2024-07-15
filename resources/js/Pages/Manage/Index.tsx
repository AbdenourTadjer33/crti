import AuthLayout from "@/Layouts/AuthLayout";
import { Head, Link } from "@inertiajs/react";
import { capitalize } from "@/Utils/helper";

const apps = [
    {
        title: "Gestion d'utilisateurs",
        link: route("manage.user.index"),
    },
    {
        title: "Gestion des roles",
        link: route("manage.role.index"),
    },
    {
        title: "Gestion des permissions",
        link: route("manage.permission.index"),
    },
    {
        title: "Gestion d'unité et divisions",
        link: route("manage.unit.index"),
    },
];

export default function Manage() {
    return (
        <AuthLayout>
            <Head title="manage" />

            <div className="flex items-center gap-2">
                {apps.map((app, idx) => {
                    return (
                        <Link
                            key={idx}
                            href={app.link}
                            className="p-4 bg-white border rounded-md transition duration-75 hover:shadow-md"
                        >
                            {capitalize(app.title)}
                        </Link>
                    );
                })}
            </div>
        </AuthLayout>
    );
}
