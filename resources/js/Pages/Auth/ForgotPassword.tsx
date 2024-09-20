import React from "react";
import { Button } from "@/Components/ui/button";
import { FormWrapper } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import { Label } from "@/Components/ui/label";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";

const ForgotPassword = ({}) => {
    const { alert } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = () => {
        post(route("password.email"));
    };

    return (
        <FormWrapper
            onSubmit={submit}
            className="w-full sm:max-w-xl md:p-6 p-4 py-6 space-y-4"
        >
            <Head title="Mot de passe oublié" />

            <div className="space-y-2">
                <Heading level={3} className="font-medium">
                    Mot de passe oublié
                </Heading>
                <Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic
                    facere eius fugiat rerum eos reprehenderit dicta sit tempore
                    fuga, laboriosam aspernatur eaque deleniti et ex, eveniet
                    laborum quis officiis voluptatum.
                </Text>
            </div>

            <div className="space-y-1">
                <Label htmlFor="email" required>
                    Adresse e-mail
                </Label>
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    placeholder="Entrer votre adresse e-mail"
                    autoFocus
                    autoComplete="username"
                />
                <InputError message={errors.email} />
            </div>

            <div className="flex justify-end">
                {alert && alert?.status == "success" ? (
                    <p className="animate-in fade-in duration-300 text-green-600 text-base">
                        {alert.message}
                    </p>
                ) : (
                    <Button variant="primary" disabled={processing}>
                        Envoyer le lien de réinitialisation du mot de passe
                    </Button>
                )}
            </div>
        </FormWrapper>
    );
};

// @ts-ignore
ForgotPassword.layout = (page) => <GuestLayout children={page} />;

export default ForgotPassword;
