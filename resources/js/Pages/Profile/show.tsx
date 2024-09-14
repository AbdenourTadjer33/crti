import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head } from "@inertiajs/react";
import { Heading } from "@/Components/ui/heading";
import Breadcrumb from "@/Components/common/breadcrumb";
import { House } from "lucide-react";
import { Text } from "@/Components/ui/paragraph";
import UpdateProfileInformation from "@/Features/Profile/update-profile-information";
import UpdatePasswordForm from "@/Features/Profile/update-password-form";

const breadcrumbs = [
    { href: route("app"), label: <House className="h-5 w-5" /> },
    { label: "Profile" },
];

const Show: React.FC = ({}) => {
    return (
        <div className="space-y-4">
            <Head title="Profile" />
            <Breadcrumb items={breadcrumbs} MAX_ITEMS={2} />

            <div className="space-y-2">
                <Heading level={3} className="font-medium">
                    Profile
                </Heading>

                <Text>
                    C'est ainsi que les autres vous verront sur l'application.
                </Text>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 max-w-screen-xl">
                    <UpdateProfileInformation />
                </div>
                <div className="flex-1 max-w-screen-sm">
                    <UpdatePasswordForm />
                </div>
            </div>
        </div>
    );
};

// @ts-ignore
Show.layout = (page) => <AuthLayout children={page} />;

export default Show;
