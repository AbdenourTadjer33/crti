import { SuccessCheckAlert } from "@/Components/Alerts/Alert";
import AppLogo from "@/Components/AppLogo";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function Created() {
    return (
        <GuestLayout>
            <Head title="Acount created" />
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
                    <a
                        href="/"
                        className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
                    >
                        <AppLogo />
                    </a>
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 sm:p-8">
                            <SuccessCheckAlert />

                            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-primary-950 md:text-2xl dark:text-primary-50">
                                Merci d'avoir créé un compte
                            </h1>

                            <p className="text-gray-800 text-base text-pretty">
                                Votre compte est actuellement en attente de
                                validation par nos administrateurs.
                                <br /> Une fois votre compte validé, vous
                                recevrez une notification par email confirmant
                                votre accès.
                                <br /> Nous apprécions votre patience. Si vous
                                avez des questions ou des préoccupations,
                                n'hésitez pas à contacter notre équipe
                                d'assistance.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
