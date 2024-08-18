import * as React from "react";
import { FormWrapper } from "@/Components/ui/form";
import { Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import { Textarea } from "@/Components/ui/textarea";

const EditForm: React.FC<any> = ({ unit }) => {
    const { data, setData, errors, processing, put } = useForm({
        name: unit.name || "",
        abbr: unit.abbr || "",
        description: unit.description || "",
        address: unit.address || "",
    });

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        put(route("manage.unit.update", { unit: unit.id }), {
            preserveScroll: true,
        });
    };

    return (
        <FormWrapper
            className="space-y-4 md:space-y-8"
            onSubmit={submitHandler}
        >
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2 col-span-3">
                    <Label>Nom de l'unité</Label>
                    <Input
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label>Abréviation</Label>
                    <Input
                        value={data.abbr}
                        onChange={(e) => setData("abbr", e.target.value)}
                    />
                    <InputError message={errors.abbr} />
                </div>

                <div className="space-y-1 col-span-3">
                    <Label>Adresse</Label>
                    <Input
                        value={data.address}
                        onChange={(e) => setData("address", e.target.value)}
                    />
                    <InputError message={errors.address} />
                </div>

                <div className="space-y-1 col-span-3">
                    <Label>Description</Label>
                    <Textarea
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                    <InputError message={errors.description} />
                </div>
            </div>

            <div className="mx-auto max-w-lg flex flex-col-reverse sm:flex-row items-center sm:gap-4 gap-2">
                <Button
                    variant="destructive"
                    disabled={processing}
                    className="w-full"
                    asChild
                >
                    <Link href={route("manage.unit.show", unit.id)}>
                        Annuler
                    </Link>
                </Button>

                <Button className="w-full" disabled={processing}>
                    Sauvegarder
                </Button>
            </div>
        </FormWrapper>
    );
};

export default EditForm;
