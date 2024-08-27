import { SuccessCheckAlert } from "@/Components/Alerts/Alert";
import AppLogo from "@/Components/common/app-logo";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function Created() {
    return (
        <GuestLayout>
            <Head title="Acount created" />

            <SuccessCheckAlert />

            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-primary-950 md:text-2xl dark:text-primary-50">
                Merci d'avoir créé un compte
            </h1>

            <p className="text-gray-800 text-base text-pretty">
                Votre compte est actuellement en attente de validation par nos
                administrateurs.
                <br /> Une fois votre compte validé, vous recevrez une
                notification par email confirmant votre accès.
                <br /> Nous apprécions votre patience. Si vous avez des
                questions ou des préoccupations, n'hésitez pas à contacter notre
                équipe d'assistance.
            </p>
        </GuestLayout>
    );
}
