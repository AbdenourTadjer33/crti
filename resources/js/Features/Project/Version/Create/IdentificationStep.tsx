import React from "react";
import { CreateProjectContext } from "@/Contexts/Project/create-project-context";
import { InputError } from "@/Components/ui/input-error";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { FormProps } from "@/Components/Stepper";
import { Editor } from "@/Components/Editor";
import { capitalize } from "@/Utils/helper";
import { usePage } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import NatureField from "../NatureField";
import DomainField from "../DomainField";
import TimelineField from "../TimelineField";

const Identification = ({ next }: FormProps) => {
    const { domains, natures }: Record<string, undefined | string[]> = usePage()
        .props as any;

    const { data, setData, errors, processing, validate, clearErrors } =
        React.useContext(CreateProjectContext);

    const goNext = async () => {
        const toValidate =
            "name,nature,domains,timeline,description,goals,methodology,is_partner,partner,partner.name,partner.email,partner.phone";

        validate(toValidate, {
            onSuccess() {
                next();
            },
        });
    };

    return (
        <>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                <div className="space-y-1">
                    <Label>Intitulé du projet</Label>
                    <Input
                        value={data.name}
                        onChange={(e) => {
                            clearErrors("name");
                            setData("name", capitalize(e.target.value));
                        }}
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-1">
                    <Label>Nature du projet</Label>
                    <NatureField
                        value={data.nature}
                        setValue={(value) => setData("nature", value)}
                        natures={natures}
                    />
                    <InputError message={errors.nature} />
                </div>

                <div className="space-y-1">
                    <Label>Domaine d'application</Label>
                    <DomainField
                        values={data.domains}
                        setValues={(values) => setData("domains", values)}
                        domains={domains}
                    />
                    <InputError message={errors.domains} />
                </div>

                <div className="space-y-1">
                    <Label>Date début/fin</Label>
                    <TimelineField
                        value={data.timeline}
                        setValue={(value) => setData("timeline", value!)}
                    />
                    <InputError message={errors.timeline} />
                </div>
            </div>

            <div className="space-y-1">
                <Label>Description succincte du projet</Label>
                <Editor
                    content={data.description}
                    onContentChange={({ html }) => {
                        clearErrors("description");
                        setData("description", html);
                    }}
                />
                <InputError message={errors.description} />
            </div>

            <div className="space-y-1">
                <Label>Objectifs du projet</Label>
                <Editor
                    content={data.goals}
                    onContentChange={({ html }) => {
                        clearErrors("goals");
                        setData("goals", html);
                    }}
                />
                <InputError message={errors.goals} />
            </div>

            <div className="space-y-1">
                <Label>Méthodologies pour la mise en œuvre du projet</Label>
                <Editor
                    content={data.methodology}
                    onContentChange={({ html }) => {
                        clearErrors("methodology");
                        setData("methodology", html);
                    }}
                />
                <InputError message={errors.methodology} />
            </div>

            <Label className="inline-flex gap-2">
                <Checkbox
                    defaultChecked={data.is_partner}
                    onCheckedChange={(checked) => {
                        clearErrors("is_partner");
                        if (!checked) {
                            clearErrors(
                                "partner.name",
                                "partner.email",
                                "partner.phone"
                            );
                        }
                        setData("is_partner", !!checked);
                    }}
                />
                Ajouter le partenaire socio-econimique
            </Label>

            {data.is_partner && (
                <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>Nom du partenaire socio-economique</Label>
                        <Input
                            value={data.partner.name}
                            onChange={(e) => {
                                clearErrors("partner.name");
                                setData((data) => {
                                    data.partner.name = e.target.value;
                                    return { ...data };
                                });
                            }}
                        />
                        <InputError message={errors["partner.name"]} />
                    </div>

                    <div className="space-y-1">
                        <Label>Adresse e-mail du partenaire</Label>
                        <Input
                            type="email"
                            value={data.partner.email}
                            onChange={(e) => {
                                clearErrors("partner.email");
                                setData((data) => {
                                    data.partner.email = e.target.value;
                                    return { ...data };
                                });
                            }}
                        />
                        <InputError message={errors["partner.email"]} />
                    </div>

                    <div className="space-y-1">
                        <Label>N° téléphone du partenaire</Label>
                        <Input
                            value={data.partner.phone}
                            onChange={(e) => {
                                clearErrors("partner.phone");
                                setData((data) => {
                                    data.partner.phone = e.target.value;
                                    return { ...data };
                                });
                            }}
                        />
                        <InputError message={errors["partner.phone"]} />
                    </div>
                </div>
            )}

            <div className="flex gap-4 max-w-lg mx-auto">
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={processing}
                    onClick={goNext}
                >
                    Suivant
                </Button>
            </div>
        </>
    );
};

export default Identification;
