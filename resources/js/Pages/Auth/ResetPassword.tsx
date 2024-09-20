import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { FormWrapper } from "@/Components/ui/form";
import { Head, useForm } from "@inertiajs/react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import { Button } from "@/Components/ui/button";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";

const ResetPassword: React.FC<{ token: string; email: string }> = ({
    token,
    email,
}) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit = () => {
        post(route("password.store"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <FormWrapper
            className="w-full sm:max-w-xl md:p-6 p-4 py-6 space-y-4"
            onSubmit={submit}
        >
            <Head title="Réinitialiser le mot de passe" />

            <Heading level={3} className="font-medium">
                Réinitialiser le mot de passe
            </Heading>

            <div className="space-y-1">
                <Label htmlFor="email" required>
                    Adresse e-mail
                </Label>
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    autoComplete="email"
                />
                <InputError message={errors.email} />
            </div>

            <div className="space-y-1">
                <Label htmlFor="password" required>
                    Mot de passe
                </Label>
                <Input
                    id="password"
                    type="password"
                    value={data.password}
                    autoComplete="new-password"
                    autoFocus
                    placeholder="*******"
                    onChange={(e) => setData("password", e.target.value)}
                />
                <InputError message={errors.password} />
            </div>

            <div className="space-y-1">
                <Label htmlFor="password_confirmation" required>
                    Confirmer le mot de passe
                </Label>
                <Input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    autoComplete="new-password"
                    placeholder="*******"
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                />
                <InputError message={errors.password_confirmation} />
            </div>

            <div className="flex items-center justify-end">
                <Button variant="primary" disabled={processing}>
                    Réinitialiser le mot de passe
                </Button>
            </div>
        </FormWrapper>
    );
};

// @ts-ignore
ResetPassword.layout = (page) => <GuestLayout children={page} />;

export default ResetPassword;
