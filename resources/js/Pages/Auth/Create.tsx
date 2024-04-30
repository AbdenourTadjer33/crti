import { Head } from "@inertiajs/react";
import AppLogo from "@/Components/AppLogo";
import GuestLayout from "@/Layouts/GuestLayout";
import AuthForm from "@/Features/Authentication/AuthForm";

export default function Create() {
    return (
        <GuestLayout>
            <Head title="S'authentifier" />
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
                    <a
                        href="/"
                        className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
                    >
                        <AppLogo />
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-primary-950 md:text-2xl dark:text-primary-50">
                                Connectez-vous à votre compte
                            </h1>

                            <AuthForm />
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
