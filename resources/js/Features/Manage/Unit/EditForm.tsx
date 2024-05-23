import * as React from "react";
import { FormWrapper } from "@/Components/ui/form";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input, InputError } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";

const EditForm = () => {
    const { unit } = usePage().props;

    const { data, setData, errors, processing, put } = useForm({
        name: unit.name || "",
        abbr: unit.abbr || "",
        description: unit.description || "",
        address: unit.address || "",
        city: unit.city || "",
        country: unit.country || "",
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
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1 col-span-2">
                    <Label>Nom de l'unité</Label>
                    <Input
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-1">
                    <Label>Abréviation</Label>
                    <Input
                        value={data.abbr}
                        onChange={(e) => setData("abbr", e.target.value)}
                    />
                    <InputError message={errors.abbr} />
                </div>

                <div className="space-y-1 col-span-3">
                    <Label>Description</Label>
                    <Textarea
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                    <InputError message={errors.description} />
                </div>

                <div className="space-y-1">
                    <Label>Adresse</Label>
                    <Input
                        value={data.address}
                        onChange={(e) => setData("address", e.target.value)}
                    />
                    <InputError message={errors.address} />
                </div>

                <div className="space-y-1">
                    <Label>Wilaya</Label>
                    <Input
                        value={data.city}
                        onChange={(e) => setData("city", e.target.value)}
                    />
                    <InputError message={errors.city} />
                </div>

                <div className="space-y-1">
                    <Label>Pays</Label>
                    <Input
                        value={data.country}
                        onChange={(e) => setData("country", e.target.value)}
                    />
                    <InputError message={errors.country} />
                </div>
            </div>

            <div className="mx-auto max-w-lg flex items-center gap-4">
                <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    asChild
                >
                    <Link href={route("manage.unit.index")}>Annuler</Link>
                </Button>
                <Button variant="primary" className="w-full">
                    Modifier
                </Button>
            </div>
        </FormWrapper>
    );
};

export default EditForm;
