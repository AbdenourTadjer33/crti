import React from "react";
import { useForm } from "@inertiajs/react";
import { Calendar } from "@/Components/ui/calendar";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import { format } from "date-fns";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/Components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { FormWrapper } from "@/Components/ui/form";
import { Heading } from "@/Components/ui/heading";

const RegisterForm = () => {
    const { data, setData, errors, post, processing } = useForm<{
        fname: string;
        lname: string;
        dob?: string;
        username: string;
        password: string;
    }>({
        fname: "",
        lname: "",
        dob: undefined,
        username: new URLSearchParams(location.search).get("username") || "",
        password: "",
    });

    const registerHandler = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("register.store"), {
            preserveScroll: true,
            only: ["errors"],
        });
    };

    return (
        <FormWrapper
            className="w-full sm:max-w-xl p-6 space-y-4 md:space-y-6"
            onSubmit={registerHandler}
        >
            <Heading level={3} className="font-medium">
                Créé un compte
            </Heading>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <Label htmlFor="fname">Prénom</Label>
                    <Input
                        id="fname"
                        placeholder="Entrez votre prénom"
                        value={data.fname}
                        onChange={(e) => setData("fname", e.target.value)}
                        autoFocus
                    />
                    <InputError className="mt-1" message={errors.fname} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="lname">Nom</Label>
                    <Input
                        id="lname"
                        placeholder="Entrez votre nom"
                        value={data.lname}
                        onChange={(e) => setData("lname", e.target.value)}
                    />
                    <InputError className="mt-1" message={errors.lname} />
                </div>
            </div>

            <div className="space-y-1">
                <Label>Date de naissance</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full flex items-center justify-between"
                        >
                            {data.dob
                                ? format(new Date(data.dob), "dd/MM/yyy")
                                : "Sélectionnez votre date de naissance"}
                            <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            onSelect={(date) => {
                                setData("dob", format(date!, "yyy/MM/dd"));
                            }}
                            selected={new Date(data.dob!)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <InputError className="mt-1" message={errors.dob} />
            </div>

            <div className="space-y-1">
                <Label htmlFor="username">Adresse e-mail</Label>
                <Input
                    id="username"
                    placeholder="Entrez votre email professionnel"
                    value={data.username}
                    onChange={(e) => setData("username", e.target.value)}
                />
                <InputError className="mt-1" message={errors.username} />
            </div>

            <div className="space-y-1">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="******"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                />
                <InputError className="mt-1" message={errors.password} />
            </div>

            <div>
                <Button
                    variant="primary"
                    disabled={processing}
                    type="submit"
                    className="w-full"
                >
                    S'inscrire
                </Button>
            </div>
        </FormWrapper>
    );
};

export default RegisterForm;
