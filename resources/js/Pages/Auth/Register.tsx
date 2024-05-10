import RegisterForm from "@/Features/Authentication/RegisterForm";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function Register() {
    return (
        <GuestLayout>
            <Head title="S'inscrire" />
            <h1 className="text-xl font-bold leading-tight tracking-tight text-primary-950 md:text-2xl dark:text-primary-50">
                Créé un compte
            </h1>
            <RegisterForm />
        </GuestLayout>
    );
}
