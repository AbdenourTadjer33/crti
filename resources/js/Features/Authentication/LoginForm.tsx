import React from "react";
import { Link, useForm } from "@inertiajs/react";
import { Checkbox, Input, InputLabel } from "@/Components/Forms/Input";
import { PrimaryButton } from "@/Components/Buttons/Button";
import { route } from "ziggy-js";
import { InputError } from "@/Components/Forms/InputError";

const LoginForm = ({ username }: { username: string }) => {
    const { data, setData, post, errors } = useForm({
        username: username || "",
        password: "",
        remember: false,
    });

    const loginHandler = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("login.store"), {
            preserveScroll: true,
            only: ["errors"],
        });
    };

    return (
        <form className="space-y-4 md:space-y-6" onSubmit={loginHandler}>
            <div>
                <Input
                    id="username"
                    placeholder="Entrez votre email professionnel"
                    value={data.username}
                    onChange={(e) => setData("username", e.target.value)}
                />
                <InputError className="mt-2" message={errors.username} />
            </div>
            <div>
                <Input
                    type="password"
                    id="password"
                    placeholder="*****"
                    isFocused
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <InputLabel htmlFor="remember" className="select-none">
                            Souviens-toi de moi
                        </InputLabel>
                    </div>
                </div>
                <Link
                    href="/"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                    Mot de passe oublié?
                </Link>
            </div>
            <div>
                <PrimaryButton type="submit" className="w-full">
                    Se connecter
                </PrimaryButton>
            </div>
        </form>
    );
};

export default LoginForm;
