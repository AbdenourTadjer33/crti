import React from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { Calendar } from "@/Components/ui/calendar";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import { format } from "date-fns";
import { FormWrapper } from "@/Components/ui/form";
import { CalendarIcon } from "lucide-react";
import { Heading } from "@/Components/ui/heading";
import * as Select from "@/Components/ui/select";
import * as Popover from "@/Components/ui/popover";

export default function Register() {
    const { data, setData, errors, post, processing } = useForm<{
        firstName: string;
        lastName: string;
        dob?: string;
        sex: string;
        email: string;
        password: string;
    }>({
        firstName: "",
        lastName: "",
        dob: undefined,
        sex: "",
        email: new URLSearchParams(location.search).get("username") || "",
        password: "",
    });

    const registerHandler = (e: React.FormEvent) => {
        post(route("register.store"));
    };

    return (
        <GuestLayout>
            <Head title="S'inscrire" />

            <FormWrapper
                className="w-full sm:max-w-xl p-6 space-y-4"
                onSubmit={registerHandler}
            >
                <Heading level={3} className="font-medium">
                    Créer un compte
                </Heading>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                        <Label required htmlFor="firstName">
                            Prénom
                        </Label>
                        <Input
                            id="firstName"
                            placeholder="Entrer votre prénom"
                            value={data.firstName}
                            onChange={(e) =>
                                setData("firstName", e.target.value)
                            }
                            autoFocus
                            autoComplete="first-name"
                        />
                        <InputError message={errors.firstName} />
                    </div>

                    <div className="space-y-1">
                        <Label required htmlFor="lastName">
                            Nom
                        </Label>
                        <Input
                            id="lastName"
                            placeholder="Entrer votre nom"
                            value={data.lastName}
                            onChange={(e) =>
                                setData("lastName", e.target.value)
                            }
                            autoComplete="last-name"
                        />
                        <InputError message={errors.lastName} />
                    </div>
                </div>

                <div className="space-y-1">
                    <Label required htmlFor="dob">
                        Date de naissance
                    </Label>
                    <Popover.Popover>
                        <Popover.PopoverTrigger asChild>
                            <Button
                                id="dob"
                                type="button"
                                variant="outline"
                                className="w-full flex items-center justify-between"
                            >
                                {data.dob
                                    ? format(new Date(data.dob), "dd/MM/yyy")
                                    : "Sélectionner votre date de naissance"}
                                <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </Button>
                        </Popover.PopoverTrigger>
                        <Popover.PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                onSelect={(date) => {
                                    setData("dob", format(date!, "yyy/MM/dd"));
                                }}
                                selected={new Date(data.dob!)}
                                initialFocus
                            />
                        </Popover.PopoverContent>
                    </Popover.Popover>
                    <InputError message={errors.dob} />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="sex" required>
                        Sexe
                    </Label>
                    <Select.Select
                        value={data.sex}
                        onValueChange={(value) => setData("sex", value)}
                    >
                        <Select.SelectTrigger id="sex">
                            <Select.SelectValue placeholder="sélectionner votre sexe" />
                        </Select.SelectTrigger>
                        <Select.SelectContent>
                            <Select.SelectItem value="male">
                                Homme
                            </Select.SelectItem>
                            <Select.SelectItem value="female">
                                Femme
                            </Select.SelectItem>
                        </Select.SelectContent>
                    </Select.Select>
                    <InputError message={errors.sex} />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="email" required>Adresse e-mail</Label>
                    <Input
                        id="email"
                        placeholder="Entrer votre adresse e-mail professionnel"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        autoComplete="email"
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="password" required>Mot de passe</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="******"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Link
                        href={route("login.create")}
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none"
                    >
                        Déjà inscrit ?
                    </Link>

                    <Button
                        variant="primary"
                        disabled={processing}
                        type="submit"
                    >
                        S'inscrire
                    </Button>
                </div>
            </FormWrapper>
        </GuestLayout>
    );
}
