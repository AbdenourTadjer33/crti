import { Head } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import LoginForm from "@/Features/Authentication/LoginForm";

export default function () {
    return (
        <GuestLayout>
            <Head title="Se connecter" />
            <LoginForm />
        </GuestLayout>
    );
}
