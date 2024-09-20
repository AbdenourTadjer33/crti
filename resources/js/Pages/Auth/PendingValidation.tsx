import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { FormWrapper } from "@/Components/ui/form";
import { Head, Link } from "@inertiajs/react";
import { Heading } from "@/Components/ui/heading";

const PendingValidation = () => {
    return (
        <FormWrapper className="w-full sm:max-w-xl md:p-6 6 p-4 py-6 space-y-4">
            <Head title="Votre compte est en cours de révision" />

            <Heading level={3}>Votre compte est en cours de révision</Heading>

            <div className="sm:text-base text-sm text-gray-600">
                Merci d'avoir vérifié votre email ! Votre compte est
                actuellement en cours d'examen par notre équipe. Vous recevrez
                une notification dès qu'un administrateur approuvera votre
                compte. Une fois approuvé, vous pourrez accéder à l'application.
            </div>

            <div className="flex items-center justify-between">
                <Link
                    href={route("logout.destroy")}
                    method="delete"
                    as="button"
                    className="ml-auto rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                >
                    Se déconnecter
                </Link>
            </div>
        </FormWrapper>
    );
};

// @ts-ignore
PendingValidation.layout = (page) => <GuestLayout children={page} />;

export default PendingValidation;
