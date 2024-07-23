import React from "react";
import { Head, usePage } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";

export default function Welcome() {
    return (
        <AuthLayout>
            <Head title="App" />
                <pre>{JSON.stringify(usePage().props, null, 2)}</pre>
        </AuthLayout>
    );
}
