import React from "react";
import { Head, usePage } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";

const Welcome = () => {
    return (
        <>
            <Head title="App" />
            <pre>{JSON.stringify(usePage().props, null, 2)}</pre>
        </>
    );
};

// @ts-ignore
Welcome.layout = (page) => {
    return <AuthLayout children={page} />;
};

export default Welcome;
