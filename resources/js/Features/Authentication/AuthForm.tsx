import React from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "@inertiajs/react";
import { Input } from "@/Components/Forms/Input";
import { PrimaryButton } from "@/Components/Buttons/Button";
import axios, { AxiosError } from "axios";
import { route } from "ziggy-js";
import { InputError } from "@/Components/Forms/InputError";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthForm() {
    const { data, setData, errors, setError } = useForm({
        username: "",
    });

    const [searchParam, setSearchParams] = useSearchParams();
    const CHECK_ROUTE = route("api.auth.check.user");

    const checkHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(CHECK_ROUTE, data);

            if (response.status === 200) {
                setSearchParams({ status: "in" });
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            const { status, data }: { status: number; data: any } =
                axiosError.response!;

            if (status === 422) {
                setError("username", data.message);
            }

            if (status === 404) {
                setSearchParams({ status: "up" });
            }
        }
    };

    if ("in" === searchParam.get("status")) {
        return <LoginForm username={data.username} />;
    }

    if ("up" === searchParam.get("status")) {
        return <RegisterForm username={data.username} />;
    }

    return (
        <form className="space-y-4 md:space-y-6" onSubmit={checkHandler}>
            <div>
                <Input
                    id="username"
                    isFocused
                    placeholder="Entrez votre email professionnel"
                    value={data.username}
                    onChange={(e) =>
                        setData({
                            ...data,
                            username: e.target.value,
                        })
                    }
                />
                <InputError className="mt-2" message={errors.username} />
            </div>

            <div>
                <PrimaryButton type="submit" className="w-full">
                    Continuer
                </PrimaryButton>
            </div>
        </form>
    );
}
