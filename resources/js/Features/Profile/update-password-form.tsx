import React from "react";
import * as Card from "@/Components/ui/card";
import { useForm } from "@inertiajs/react";
import { Label } from "@/Components/ui/label";
import { InputError } from "@/Components/ui/input-error";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";

const UpdatePasswordForm = () => {
    const { data, setData, put, errors, processing, recentlySuccessful } =
        useForm({
            current: "",
            password: "",
            confirmation: "",
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // put(route(''))
    };

    return (
        <Card.Card>
            <Card.CardHeader>
                <Card.CardSubTitle>
                    Mettre à jour le mot de passe
                </Card.CardSubTitle>
                <Card.CardDescription>
                    Assurez-vous que votre compte utilise un mot de passe long
                    et aléatoire pour restez en sécurité.
                </Card.CardDescription>
            </Card.CardHeader>
            <Card.CardContent>
                <form className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="current_password" required>
                            Mot de passe actuel
                        </Label>

                        <Input
                            id="current_password"
                            type="password"
                            value={data.current}
                            onChange={(e) => setData("current", e.target.value)}
                            autoComplete="current-password"
                            required
                        />

                        <InputError message={errors.current} />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="password" required>
                            Nouveau mot de passe
                        </Label>

                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            required
                        />

                        <InputError message={errors.password} />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="password_confirmation" required>
                            Confirmez le mot de passe
                        </Label>

                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.confirmation}
                            onChange={(e) =>
                                setData("confirmation", e.target.value)
                            }
                            required
                        />

                        <InputError message={errors.confirmation} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="primary">Save</Button>

                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Saved.
                            </p>
                        </div>
                    </div>
                </form>
            </Card.CardContent>
        </Card.Card>
    );
};

export default UpdatePasswordForm;
