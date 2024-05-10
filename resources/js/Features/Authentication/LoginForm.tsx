import React from "react";
import { Link, useForm } from "@inertiajs/react";
import { route } from "@/Utils/helper";
import { Input, InputError } from "@/Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";

const LoginForm = () => {
    const { data, setData, post, errors, processing } = useForm({
        username: new URLSearchParams(location.search).get("username") || "",
        password: "",
        remember: false,
    });

    const loginHandler = async (e: React.FormEvent) => {
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
                    autoFocus
                />
                <InputError className="mt-1" message={errors.username} />
            </div>
            <div>
                <Input
                    type="password"
                    id="password"
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
                    href="/"
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
        </form>
    );
};

export default LoginForm;
