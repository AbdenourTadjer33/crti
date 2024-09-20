import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { FormWrapper } from "@/Components/ui/form";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";

const VerifyEmail: React.FC<any> = ({ status }) => {
    const { post, processing } = useForm({});

    const submit = () => {
        post(route("verification.send"));
    };

    return (
        <FormWrapper
            className="w-full sm:max-w-xl md:p-6 6 p-4 py-6 space-y-4"
            onSubmit={submit}
        >
            <Head title="Vérification d'adresse e-mail" />

            <div className="sm:text-base text-sm text-gray-600">
                Merci de vous être inscrit ! Avant de commencer, pourriez-vous
                vérifier votre adresse e-mail en cliquant sur le lien que nous
                venons de vous envoyer par e-mail ? Si vous n'avez pas reçu
                l'e-mail, nous serons heureux de vous en envoyer un autre.
            </div>

            {status === "verification-link-sent" && (
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    Un nouveau lien de vérification a été envoyé à l'adresse
                    e-mail que vous avez fournie lors de l'inscription.
                </div>
            )}

            <div className="mt-4 flex items-center justify-between">
                <Button variant="primary" disabled={processing}>
                    Renvoyer l'e-mail de vérification
                </Button>

                <Link
                    href={route("logout.destroy")}
                    method="delete"
                    as="button"
                    className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                    disabled={processing}
                >
                    Se déconnecter
                </Link>
            </div>
        </FormWrapper>
    );
};

// @ts-ignore
VerifyEmail.layout = (page) => <GuestLayout children={page} />;

export default VerifyEmail;
