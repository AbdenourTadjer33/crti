import React from "react";
import * as Card from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import { Button, buttonVariants } from "@/Components/ui/button";
import { useForm, usePage } from "@inertiajs/react";
import { Calendar } from "@/Components/ui/calendar";
import { Popover, PopoverContent } from "@/Components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { User } from "@/types";

const UpdateProfileInformation = () => {
    const user = usePage<{
        auth: {
            user: User & { firstName: string; lastName: string };
        };
    }>().props.auth.user;

    const { data, setData, put, errors, processing, recentlySuccessful } =
        useForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            dob: user.dob,
            sex: user.sex,
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        put(route("profile.update"));
    };

    return (
        <Card.Card>
            <Card.CardHeader>
                <Card.CardSubTitle>
                    Informations sur le profil
                </Card.CardSubTitle>
                <Card.CardDescription>
                    Mettez à jour les informations de profil et l'adresse e-mail
                    de votre compte.
                </Card.CardDescription>
            </Card.CardHeader>
            <Card.CardContent>
                <form className="space-y-4" onSubmit={submit}>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="first_name" required>
                                Prénom
                            </Label>
                            <Input
                                id="first_name"
                                value={data.firstName}
                                onChange={(e) =>
                                    setData("firstName", e.target.value)
                                }
                                autoComplete="first_name"
                                required
                            />
                            <InputError message={errors.firstName} />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="last_name" required>
                                Nom
                            </Label>
                            <Input
                                id="last_name"
                                value={data.lastName}
                                onChange={(e) =>
                                    setData("lastName", e.target.value)
                                }
                                autoComplete="last_name"
                                required
                            />
                            <InputError message={errors.lastName} />
                        </div>
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
                            autoComplete="username"
                            required
                        />

                        <InputError message={errors.email} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label required>Date de naissance</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between pr-0"
                                    >
                                        Sélectionne votre date de naissance
                                        <div
                                            className={buttonVariants({
                                                variant: "ghost",
                                                size: "sm",
                                            })}
                                        >
                                            <CalendarIcon className="shrink-0 h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        </div>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-1">
                            <Label required>Sexe</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionne ton sexe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Homme</SelectItem>
                                    <SelectItem value="female">
                                        Femme
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.sex} />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="primary" disabled={processing}>
                            Save
                        </Button>
                        {recentlySuccessful && (
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Saved.
                                </p>
                            </div>
                        )}
                    </div>
                </form>
            </Card.CardContent>
        </Card.Card>
    );
};

export default UpdateProfileInformation;
