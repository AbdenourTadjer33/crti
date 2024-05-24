import RegisterForm from "@/Features/Authentication/RegisterForm";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function Register() {
    return (
        <GuestLayout>
            <Head title="S'inscrire" />
            <RegisterForm />
        </GuestLayout>
    );
}
