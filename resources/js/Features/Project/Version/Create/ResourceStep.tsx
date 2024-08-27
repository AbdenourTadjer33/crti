import React from "react";
import * as Card from "@/Components/ui/card";
import * as Accordion from "@/Components/ui/accordion";
import SearchInput from "@/Components/common/search-input";
import { CreateProjectContext } from "@/Contexts/Project/create-project-context";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { StepperContentProps } from "@/Components/ui/stepper";
import { Button } from "@/Components/ui/button";
import { useDebounce } from "@/Hooks/use-debounce";
import { skipToken, useQuery } from "@tanstack/react-query";
import { searchExistingResources } from "@/Services/api/resources";
import { ChevronDown } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { deepKeys } from "@/Libs/Validation/utils";
import { Heading } from "@/Components/ui/heading";
import { Progress } from "@/Components/ui/infinate-progress";
import { Text } from "@/Components/ui/paragraph";
import { InputError } from "@/Components/ui/input-error";

const ResourceForm = ({
    next,
    prev,
    markStepAsError,
    markStepAsSuccess,
    clearStepError,
}: StepperContentProps) => {
    const { data, processing, validate, clearErrors, setError } =
        React.useContext(CreateProjectContext);

    const goNext = () => {
        const fields = `resources,${deepKeys(
            data.resources,
            "resources"
        )}resources_partner,${deepKeys(
            data.resources_partner,
            "resources_partner"
        )}resources_crti,${deepKeys(data.resources_crti, "resources_crti")}`;

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
            <div className="sm:space-y-6 space-y-4">
                <Heading level={6}>
                    Matériel existant pouvant être utilisé dans l'exécution du
                    projet.
                </Heading>

                <ResourceSelecter />
            </div>

            <div className="sm:space-y-6 space-y-4">
                <Heading level={6}>
                    Matière première, composants et petits équipements à
                    acquérir par le CRTI
                </Heading>

                <ResourceCrti />
            </div>

            {data.is_partner && (
                <div className="sm:space-y-6 space-y-4">
                    <Heading level={6}>
                        Matière première, composants et petits équipements à
                        acquérir par le partenaire socio-économique
                    </Heading>

                    <ResourcePartner />
                </div>
            )}

            <div className="flex gap-4 max-w-lg mx-auto">
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={processing}
                    onClick={prev}
                >
                    Précendant
                </Button>
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

const ResourceSelecter = () => {
    const {} = React.useContext(CreateProjectContext);
    const [search, setSearch] = React.useState("");
    const debouncedValue = useDebounce(search, 300);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const {
        data: resources,
        isFetching,
        isLoading,
        isError,
        isSuccess,
    } = useQuery({
        queryKey: ["search-existing-resources", debouncedValue],
        queryFn: debouncedValue
            ? async ({ signal }) =>
                  searchExistingResources(debouncedValue, { signal })
            : skipToken,
    });

    return (
        <div>
            <Card.Card className="relative flex-1 w-full md:min-h-56 md:rounded-b-lg md:border-b border-b-0 rounded-b-none overflow-hidden">
                <div
                    className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-50 hidden data-[pending=true]:block"
                    data-pending={isFetching || isLoading}
                >
                    <Progress className="bg-indigo-600" />
                </div>
                <Card.CardHeader>
                    <SearchInput
                        inputRef={searchInputRef}
                        value={search}
                        onValueChange={(value) => setSearch(value)}
                    />
                </Card.CardHeader>
                <Card.CardContent className="space-y-2 md:max-h-[30rem] max-h-[20rem] overflow-y-auto snap-mandatory snap-y scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thin">
                    {isSuccess ? (
                        resources.length ? (
                            <></>
                        ) : (
                            <Text>Aucun résultat trouvé</Text>
                        )
                    ) : isError ? (
                        <div className="text-red-600">
                            Oups ! Quelque chose s'est mal passé. Veuillez
                            vérifier votre connexion Internet et réessayer
                        </div>
                    ) : (
                        <Text>
                            Rechercher et ajouter les resources de votre projet.
                            Vous pouvez rechercher la nature ou la reference de
                            la resource.
                        </Text>
                    )}
                </Card.CardContent>
            </Card.Card>
        </div>
    );
};

const ResourceCrti = () => {
    const { data, setData, errors, clearErrors } =
        React.useContext(CreateProjectContext);
    const [accordionState, setAccordionState] = React.useState("");
    const [nature, setNature] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const addNewResource = () => {
        if (!nature.trim().length) {
            alert("you must add the resource name!");
            return;
        }
        const pattern = /^([a-zA-Z0-9-# ]+)\s*\.\s*([0-9]+(?:\.[0-9]+)?)$/;
        const match = nature.match(pattern);

        const index = data.resources_crti.length;
        setData((data) => {
            data.resources_crti.push({
                name: match ? match[1] : nature,
                description: "",
                price: match ? match[2] : "",
            });
            return { ...data };
        });
        setNature("");
        setAccordionState(String(index));
        inputRef.current?.blur();
    };

    return (
        <>
            <Accordion.Accordion
                collapsible
                type="single"
                value={accordionState}
                onValueChange={setAccordionState}
                className="space-y-3"
            >
                {data.resources_crti.map((resource, idx) => (
                    <Accordion.AccordionItem
                        key={idx}
                        value={String(idx)}
                        className="px-1 py-2 border rounded space-y-4"
                    >
                        <AccordionPrimitive.Header className="px-1 flex items-center justify-between gap-2">
                            <div className="w-full grid sm:grid-cols-3 sm:gap-4 gap-2">
                                <div className="sm:col-span-2">
                                    <Label required>Resource</Label>
                                    <Input
                                        value={resource.name}
                                        onChange={(e) => {
                                            clearErrors(
                                                `resources_crti.${idx}.name`
                                            );
                                            setData((data) => {
                                                data.resources_crti[idx].name =
                                                    e.target.value;
                                                return { ...data };
                                            });
                                        }}
                                        placeholder="nature de la ressource*"
                                    />
                                    <InputError
                                        message={
                                            errors[`resources_crti.${idx}.name`]
                                        }
                                    />
                                </div>
                                <div>
                                    <Label required>Prix</Label>
                                    <div className="relative">
                                        <Input
                                            value={resource.price}
                                            onChange={(e) => {
                                                clearErrors(
                                                    `resources_crti.${idx}.price`
                                                );
                                                setData((data) => {
                                                    data.resources_crti[
                                                        idx
                                                    ].price = e.target.value;
                                                    return { ...data };
                                                });
                                            }}
                                            className="pr-10"
                                        />
                                        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 select-none text-gray-600 font-medium sm:text-base text-sm">
                                            DZD
                                        </div>
                                    </div>
                                    <InputError
                                        message={
                                            errors[
                                                `resources_crti.${idx}.price`
                                            ]
                                        }
                                    />
                                </div>
                            </div>

                            <AccordionPrimitive.Trigger asChild>
                                <Button variant="ghost">
                                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                                </Button>
                            </AccordionPrimitive.Trigger>
                        </AccordionPrimitive.Header>
                        <Accordion.AccordionContent className="px-1 flex sm:flex-row flex-col sm:items-end gap-4">
                            <div className="flex-1 space-y-1">
                                <Label>Observation</Label>
                                <Textarea
                                    value={resource.description}
                                    onChange={(e) =>
                                        setData((data) => {
                                            data.resources_crti[
                                                idx
                                            ].description = e.target.value;
                                            return { ...data };
                                        })
                                    }
                                    className="min-h-24"
                                />
                            </div>

                            <Button
                                variant="destructive"
                                onClick={() => {
                                    setData((data) => {
                                        const resources = [
                                            ...data.resources_crti,
                                        ];
                                        resources.splice(idx, 1);
                                        return {
                                            ...data,
                                            resources_crti: resources,
                                        };
                                    });
                                    setAccordionState("");
                                }}
                            >
                                Supprimer
                            </Button>
                        </Accordion.AccordionContent>
                    </Accordion.AccordionItem>
                ))}
            </Accordion.Accordion>

            <div className="relative max-w-screen-lg mx-auto">
                <Input
                    ref={inputRef}
                    value={nature}
                    onChange={(e) => setNature(e.target.value)}
                    placeholder="Nature de la ressource..."
                    className="pr-20"
                    onKeyDown={(e) => {
                        if (e.code === "Enter") {
                            e.preventDefault();
                            addNewResource();
                        }
                    }}
                />
                <Button
                    type="button"
                    className="absolute right-0.5 top-1/2 -translate-y-1/2"
                    variant="ghost"
                    size="sm"
                    onClick={addNewResource}
                >
                    Ajouter
                </Button>
            </div>
        </>
    );
};

const ResourcePartner = () => {
    const { data, setData, errors, clearErrors } =
        React.useContext(CreateProjectContext);
    const [nature, setNature] = React.useState("");
    const [accordionState, setAccordionState] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const addNewResource = () => {
        if (!nature.trim().length) {
            alert("you must add the resource name!");
            return;
        }
        const pattern = /^([a-zA-Z0-9-# ]+)\s*\.\s*([0-9]+(?:\.[0-9]+)?)$/;
        const match = nature.match(pattern);

        const index = data.resources_partner.length;
        setData((data) => {
            data.resources_partner.push({
                name: match ? match[1] : nature,
                description: "",
                price: match ? match[2] : "",
            });
            return { ...data };
        });
        setNature("");
        setAccordionState(String(index));
        inputRef.current?.blur();
    };

    return (
        <>
            <Accordion.Accordion
                collapsible
                type="single"
                value={accordionState}
                onValueChange={setAccordionState}
                className="space-y-3"
            >
                {data.resources_partner.map((resource, idx) => (
                    <Accordion.AccordionItem
                        key={idx}
                        value={String(idx)}
                        className="px-1 py-2 border rounded space-y-4"
                    >
                        <AccordionPrimitive.Header className="px-1 flex items-center justify-between gap-2">
                            <div className="w-full grid sm:grid-cols-3 sm:gap-4 gap-2">
                                <div className="sm:col-span-2">
                                    <Label required>Resource</Label>
                                    <Input
                                        value={resource.name}
                                        onChange={(e) => {
                                            clearErrors(
                                                `resources_partner.${idx}.name`
                                            );
                                            setData((data) => {
                                                data.resources_partner[
                                                    idx
                                                ].name = e.target.value;
                                                return { ...data };
                                            });
                                        }}
                                        placeholder="nature de la ressource*"
                                    />
                                    <InputError
                                        message={
                                            errors[
                                                `resources_partner.${idx}.name`
                                            ]
                                        }
                                    />
                                </div>
                                <div>
                                    <Label required>Prix</Label>
                                    <div className="relative">
                                        <Input
                                            value={resource.price}
                                            onChange={(e) => {
                                                clearErrors(
                                                    `resources_partner.${idx}.price`
                                                );
                                                setData((data) => {
                                                    data.resources_partner[
                                                        idx
                                                    ].price = e.target.value;
                                                    return { ...data };
                                                });
                                            }}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium text-base">
                                            DZD
                                        </span>
                                    </div>
                                    <InputError
                                        message={
                                            errors[
                                                `resources_partner.${idx}.price`
                                            ]
                                        }
                                    />
                                </div>
                            </div>
                            <AccordionPrimitive.Trigger asChild>
                                <Button variant="ghost" size="sm">
                                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                                </Button>
                            </AccordionPrimitive.Trigger>
                        </AccordionPrimitive.Header>
                        <Accordion.AccordionContent className="px-1 flex sm:flex-row flex-col sm:items-end gap-4">
                            <div className="flex-1 space-y-1">
                                <Label>Observation</Label>
                                <Textarea
                                    value={resource.description}
                                    onChange={(e) =>
                                        setData((data) => {
                                            data.resources_partner[
                                                idx
                                            ].description = e.target.value;
                                            return { ...data };
                                        })
                                    }
                                    className="min-h-24"
                                />
                            </div>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    setData((data) => {
                                        const resources = [
                                            ...data.resources_partner,
                                        ];
                                        resources.splice(idx, 1);
                                        return {
                                            ...data,
                                            resources_partner: resources,
                                        };
                                    });
                                    setAccordionState("");
                                }}
                            >
                                Supprimer
                            </Button>
                        </Accordion.AccordionContent>
                    </Accordion.AccordionItem>
                ))}
            </Accordion.Accordion>

            <div className="relative max-w-screen-lg mx-auto">
                <Input
                    ref={inputRef}
                    value={nature}
                    onChange={(e) => setNature(e.target.value)}
                    placeholder="Nature de la ressource..."
                    className="pr-20"
                    onKeyDown={(e) => {
                        if (e.code === "Enter") {
                            e.preventDefault();
                            addNewResource();
                        }
                    }}
                />
                <Button
                    type="button"
                    className="absolute right-0.5 top-1/2 -translate-y-1/2"
                    variant="ghost"
                    size="sm"
                    onClick={addNewResource}
                >
                    Ajouter
                </Button>
            </div>
        </>
    );
};

export default ResourceForm;
