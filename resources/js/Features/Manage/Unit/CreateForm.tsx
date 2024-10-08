import React from "react";
import { Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { FormWrapper } from "@/Components/ui/form";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import { Textarea } from "@/Components/ui/textarea";

const CreateForm = () => {
    const { data, setData, errors, processing, post, clearErrors } = useForm({
        name: "",
        abbr: "",
        webpage: "",
        description: "",
        address: "",
        divisions: [],
        infrastructures: [],
    });

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("manage.unit.store", {}), {
            preserveScroll: true,
        });
    };

    return (
        <FormWrapper
            className="space-y-4 md:space-y-6"
            onSubmit={submitHandler}
        >
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label required>Nom de l'unité</Label>
                    <Input
                        onChange={(e) => {
                            clearErrors("name");
                            setData("name", e.target.value);
                        }}
                        value={data.name}
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label required>Abréviation</Label>
                    <Input
                        value={data.abbr}
                        onChange={(e) => {
                            clearErrors("abbr");
                            setData("abbr", e.target.value);
                        }}
                    />
                    <InputError message={errors.abbr} />
                </div>

                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label>Page web</Label>
                    <Input
                        value={data.webpage}
                        onChange={(e) => {
                            clearErrors("webpage");
                            setData("webpage", e.target.value);
                        }}
                    />
                    <InputError message={errors.webpage} />
                </div>

                <div className="space-y-1 col-span-3">
                    <Label required>Adresse</Label>
                    <Input
                        value={data.address}
                        onChange={(e) => {
                            clearErrors("address");
                            setData("address", e.target.value);
                        }}
                    />
                    <InputError message={errors.address} />
                </div>

                <div className="space-y-1 col-span-3">
                    <Label>Description</Label>
                    <Textarea
                        value={data.description}
                        onChange={(e) => {
                            clearErrors("description");
                            setData("description", e.target.value);
                        }}
                    />
                    <InputError message={errors.description} />
                </div>
            </div>

            <div className="mx-auto max-w-lg flex flex-col-reverse sm:flex-row items-center sm:gap-4 gap-2">
                <Button variant="destructive" className="w-full" asChild>
                    <Link href={route("manage.unit.index")}>Annuler</Link>
                </Button>
                <Button variant="primary" className="w-full">
                    Créer
                </Button>
            </div>
        </FormWrapper>
    );
};

export default CreateForm;
