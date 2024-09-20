import { Head } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import React from "react";
import { Link, useForm } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { FormWrapper } from "@/Components/ui/form";
import { Heading } from "@/Components/ui/heading";

const Login = () => {
    const { data, setData, post, errors, processing } = useForm({
        email: new URLSearchParams(location.search).get("username") || "",
        password: "",
        remember: false,
    });

    const loginHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        post(route("login.store"));
    };
    return (
        <FormWrapper
            className="w-full sm:max-w-xl md:p-6 p-4 py-6 space-y-4"
            onSubmit={loginHandler}
        >
            <Head title="Se connecter" />
            <Heading level={3} className="font-medium">
                Connectez-vous à votre compte
            </Heading>

            <div className="space-y-1">
                <Label htmlFor="email" required>
                    Adresse e-mail
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Entrer votre adresse e-mail professionnel"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    autoComplete="username"
                    autoFocus
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
                    placeholder="*****"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                />
                <InputError className="mt-1" message={errors.password} />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <Checkbox
                            id="remember"
                            onCheckedChange={(checked) =>
                                setData("remember", !!checked)
                            }
                            checked={data.remember}
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <Label htmlFor="remember" className="select-none">
                            Souviens-toi de moi
                        </Label>
                    </div>
                </div>
                <Link
                    href={route("password.request")}
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                    Mot de passe oublié?
                </Link>
            </div>
            <div>
                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={processing}
                >
                    Se connecter
                </Button>
            </div>
        </FormWrapper>
    );
};

// @ts-ignore
Login.layout = (page) => <GuestLayout children={page} />;

export default Login;
