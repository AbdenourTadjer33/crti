import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { Head } from "@inertiajs/react";

export default function Welcome() {
    return (
        <AuthLayout>
            <Head title="App" />
        </AuthLayout>
    );
}
