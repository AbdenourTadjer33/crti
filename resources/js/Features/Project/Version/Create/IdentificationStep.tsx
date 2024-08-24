import React from "react";
import { CreateProjectContext } from "@/Contexts/Project/create-project-context";
import { InputError } from "@/Components/ui/input-error";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { StepperContentProps } from "@/Components/ui/stepper";
import { Editor } from "@/Components/Editor";
import { capitalize } from "@/Utils/helper";
import { usePage } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import NatureField from "../NatureField";
import DomainField from "../DomainField";
import TimelineField from "../TimelineField";
import * as Card from "@/Components/ui/card";
import { LabelInfo } from "@/Components/ui/label-info";
import { Text } from "@/Components/ui/paragraph";

const Identification = ({
    next,
    markStepAsError,
    markStepAsSuccess,
    clearStepError,
}: StepperContentProps) => {
    const { domains, natures }: Record<string, undefined | string[]> = usePage()
        .props as any;

    const {
        data,
        setData,
        errors,
        processing,
        validate,
        clearErrors,
        setError,
    } = React.useContext(CreateProjectContext);

    const goNext = async () => {
        const fields =
            "name,nature,domains,timeline,description,goals,methodology,is_partner,partner,partner.organisation,partner.sector,partner.contact_name,partner.contact_post,partner.contact_email,partner.contact_phone,deliverables,estimated_amount";
        validate(fields, {
            onSuccess() {
                fields.split(",").map((field) => clearErrors(field));
                clearStepError();
                markStepAsSuccess();
                next();
            },
            onError(errors) {
                markStepAsError();
                setError(errors);
            },
        });
    };

    return (
        <>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="name" required>
                        Intitulé du projet
                    </Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => {
                            clearErrors("name");
                            setData("name", capitalize(e.target.value));
                        }}
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="nature" required>
                        Nature du projet
                    </Label>
                    <NatureField
                        id="nature"
                        value={data.nature}
                        setValue={(value) => {
                            clearErrors("nature");
                            setData("nature", value);
                        }}
                        natures={natures}
                    />
                    <InputError message={errors.nature} />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="domains" required>
                        Domaine d'application
                    </Label>
                    <DomainField
                        id="domains"
                        values={data.domains}
                        setValues={(values) => {
                            clearErrors("domains");
                            setData("domains", values);
                        }}
                        domains={domains}
                    />
                    <InputError message={errors.domains} />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="timeline" required>
                        Date début/fin
                    </Label>
                    <TimelineField
                        id="timeline"
                        value={data.timeline}
                        setValue={(value) => {
                            clearErrors("timeline");
                            setData("timeline", value!);
                        }}
                    />
                    <InputError message={errors.timeline} />
                </div>
            </div>

            <div className="space-y-1">
                <Label required>Description succincte du projet</Label>
                <Editor
                    autofocus={false}
                    content={data.description}
                    onContentChange={({ html }) => {
                        clearErrors("description");
                        setData("description", html);
                    }}
                />
                <InputError message={errors.description} />
            </div>

            <div className="space-y-1">
                <Label required>Objectifs du projet</Label>
                <Editor
                    autofocus={false}
                    content={data.goals}
                    onContentChange={({ html }) => {
                        clearErrors("goals");
                        setData("goals", html);
                    }}
                />
                <InputError message={errors.goals} />
            </div>

            <div className="space-y-1">
                <Label required>
                    Méthodologies pour la mise en œuvre du projet
                </Label>
                <Editor
                    autofocus={false}
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
                <Card.Card className="p-4 space-y-4">
                    <Card.CardSubTitle>
                        Informations sur le partenaire socio-économique
                    </Card.CardSubTitle>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 md:gap-4 gap-2">
                        <div className="space-y-1">
                            <Label htmlFor="partner_organisation" required>
                                <LabelInfo className="ms-4">
                                    <Text className="text-gray-800">
                                        Le nom officiel de l'organisation
                                        <br />
                                        socio-économique partenaire.
                                    </Text>
                                </LabelInfo>
                                Partenaire socio-economique
                            </Label>
                            <Input
                                id="partner_organisation"
                                value={data.partner.organisation}
                                onChange={(e) => {
                                    clearErrors("partner.organisation");
                                    setData((data) => {
                                        data.partner.organisation =
                                            e.target.value;
                                        return { ...data };
                                    });
                                }}
                            />
                            <InputError
                                message={errors["partner.organisation"]}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="partner_sector" required>
                                Secteur socio-économique du partenaire
                            </Label>
                            <Input
                                id="partner_sector"
                                value={data.partner.sector}
                                onChange={(e) => {
                                    clearErrors("partner.sector");
                                    setData((data) => {
                                        data.partner.sector = e.target.value;
                                        return { ...data };
                                    });
                                }}
                                placeholder="par exemple, agriculture, soins de santé, énergie..."
                            />
                            <InputError message={errors[`partner.sector`]} />
                        </div>
                    </div>

                    <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-4 gap-2">
                        <div className="space-y-1">
                            <Label htmlFor="partner_contact_name" required>
                                Nom du contact
                            </Label>
                            <Input
                                id="partner_contact_name"
                                value={data.partner.contact_name}
                                onChange={(e) => {
                                    clearErrors("partner.contact_name");
                                    setData((data) => {
                                        data.partner.contact_name =
                                            e.target.value;
                                        return { ...data };
                                    });
                                }}
                            />
                            <InputError
                                message={errors[`partner.contact_name`]}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="partner_contact_post" required>
                                Poste du Contact
                            </Label>
                            <Input
                                id="partner_contact_post"
                                value={data.partner.contact_post}
                                onChange={(e) => {
                                    clearErrors("partner.contact_post");
                                    setData((data) => {
                                        data.partner.contact_post =
                                            e.target.value;
                                        return { ...data };
                                    });
                                }}
                            />
                            <InputError
                                message={errors[`partner.contact_post`]}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="partner_contact_email" required>
                                Adresse e-mail du contact
                            </Label>
                            <Input
                                id="partner_contact_email"
                                type="email"
                                value={data.partner.contact_email}
                                onChange={(e) => {
                                    clearErrors("partner.contact_email");
                                    setData((data) => {
                                        data.partner.contact_email =
                                            e.target.value;
                                        return { ...data };
                                    });
                                }}
                            />
                            <InputError
                                message={errors["partner.contact_email"]}
                            />
                        </div>

                        <div className="space-y-1">
                            <Label required>N° téléphone du contact</Label>
                            <Input
                                value={data.partner.contact_phone}
                                onChange={(e) => {
                                    clearErrors("partner.contact_phone");
                                    setData((data) => {
                                        data.partner.contact_phone =
                                            e.target.value;
                                        return { ...data };
                                    });
                                }}
                            />
                            <InputError
                                message={errors["partner.contact_phone"]}
                            />
                        </div>
                    </div>
                </Card.Card>
            )}

            <DeliverableField values={data.deliverables} />

            <Card.Card className="p-4 space-y-4">
                <Label htmlFor="estimated_amount" required>
                    Montant Globale estimé pour la réalisation du projet
                </Label>

                <div className="space-y-1">
                    <div className="relative">
                        <Input
                            id="estimated_amount"
                            value={data.estimated_amount}
                            onChange={(e) => {
                                clearErrors("estimated_amount");
                                setData("estimated_amount", e.target.value);
                            }}
                            className="pr-10"
                        />
                        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 select-none text-gray-600 font-medium sm:text-base text-sm">
                            DZD
                        </div>
                    </div>
                    <InputError message={errors["estimated_amount"]} />
                </div>
            </Card.Card>

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

interface DeliverableFieldProps {
    values: string[];
}

const DeliverableField: React.FC<DeliverableFieldProps> = ({ values }) => {
    const { clearErrors, setData, errors } =
        React.useContext(CreateProjectContext);
    const [state, setState] = React.useState("");

    const addNew = () => {
        if (!state.trim().length) {
            alert("add deliverable name");
            return;
        }

        clearErrors("deliverables");

        setData((data) => {
            data.deliverables.push(state);
            return { ...data };
        });

        setState("");
    };

    return (
        <Card.Card className="p-4 space-y-4">
            <Label required>Produit livrable du projet</Label>

            <div className="space-y-2">
                {values?.map((deliverable, idx) => (
                    <div key={idx} className="relative">
                        <Input
                            value={deliverable}
                            onChange={(e) => {
                                setData((data) => {
                                    data.deliverables[idx] = capitalize(
                                        e.target.value
                                    );
                                    return { ...data };
                                });
                            }}
                        />
                        <Button
                            size="sm"
                            variant="destructive"
                            className="absolute right-0.5 top-1/2 -translate-y-1/2"
                            onClick={() => {
                                setData((data) => {
                                    data.deliverables.splice(idx, 1);
                                    return { ...data };
                                });
                            }}
                        >
                            Supprimer
                        </Button>
                    </div>
                ))}
            </div>

            <div className="space-y-1">
                <div className="relative">
                    <Input
                        value={state}
                        onChange={(e) => setState(capitalize(e.target.value))}
                        className="pr-20"
                        onKeyDown={(e) => {
                            if (e.code === "Enter") {
                                e.preventDefault();
                                addNew();
                            }
                        }}
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        className="absolute right-0.5 top-1/2 -translate-y-1/2"
                        size="sm"
                        onClick={addNew}
                    >
                        Ajouter
                    </Button>
                </div>
                <InputError message={errors["deliverables"]} />
            </div>
        </Card.Card>
    );
};

export default Identification;
