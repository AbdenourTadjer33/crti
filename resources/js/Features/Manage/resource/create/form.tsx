import React from "react";
import { Button } from "@/Components/ui/button";
import { FormWrapper } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { router, useForm } from "@inertiajs/react";
import { ToggleGroup, ToggleGroupItem } from "@/Components/ui/toggle-group";

const Form: React.FC = () => {
    const { data, setData, errors, processing, post, clearErrors } = useForm({
        code: "",
        name: "",
        description: "",
        state: "",
    });

    return (
        <FormWrapper
            className="space-y-4 md:space-y-6"
            onSubmit={() => post(route("manage.resource.store"))}
        >
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                    <Label required>code</Label>
                    <Input
                        maxLength={15}
                        value={data.code}
                        onChange={(e) => {
                            clearErrors("code");
                            setData("code", e.target.value);
                        }}
                    />
                    <InputError message={errors.code} />
                </div>

                <div className="space-y-1">
                    <Label required>Nature</Label>
                    <Input
                        value={data.name}
                        onChange={(e) => {
                            clearErrors("name");
                            setData("name", e.target.value);
                        }}
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-1">
                    <Label required>État de la ressource</Label>
                    <ToggleGroup
                        type="single"
                        variant="default"
                        className="justify-start"
                        value={data.state}
                        onValueChange={(value) => {
                            clearErrors("state");
                            setData("state", value);
                        }}
                    >
                        <ToggleGroupItem value="1">Bon</ToggleGroupItem>
                        <ToggleGroupItem value="0">A réparer</ToggleGroupItem>
                    </ToggleGroup>
                    <InputError message={errors.state} />
                </div>
            </div>

            <div className="space-y-1">
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

            <div className="mx-auto max-w-lg flex flex-col-everse sm:flex-row items-center sm:gap-4 gap-2">
                <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    onClick={() => router.get(route("manage.resource.index"))}
                    disabled={processing}
                >
                    Annuler
                </Button>
                <Button
                    variant="primary"
                    className="w-full"
                    disabled={processing}
                >
                    Créer
                </Button>
            </div>
        </FormWrapper>
    );
};

export default Form;
