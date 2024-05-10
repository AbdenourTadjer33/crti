import { Head } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import LoginForm from "@/Features/Authentication/LoginForm";

export default function () {
    return (
        <GuestLayout>
            <Head title="Se connecter" />
            <h1 className="text-xl font-bold leading-tight tracking-tight text-primary-950 md:text-2xl dark:text-primary-50">
                Connectez-vous à votre compte
            </h1>
            <LoginForm />
        </GuestLayout>
    );
}
