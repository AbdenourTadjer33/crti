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
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { deepKeys } from "@/Libs/Validation/utils";
import { Heading } from "@/Components/ui/heading";
import { Progress } from "@/Components/ui/infinate-progress";
import { Text } from "@/Components/ui/paragraph";
import { InputError } from "@/Components/ui/input-error";
import ReadMore from "@/Components/common/read-more";
import * as Tooltip from "@/Components/ui/tooltip";

const ResourceForm = ({
    next,
    prev,
    markStepAsError,
    markStepAsSuccess,
    clearStepError,
}: StepperContentProps) => {
    const { data, setData, processing, validate, clearErrors, setError } =
        React.useContext(CreateProjectContext);

    const goNext = () => {
        let fields = "";
        fields +=
            deepKeys(data.resources, "resources").join(",") + ",resources,";
        fields +=
            deepKeys(data.resources_crti, "resources_crti").join(",") +
            ",resources_crti,";
        fields +=
            deepKeys(data.resources_partner, "resources_partner").join(",") +
            ",resources_partner";
        validate(
            fields
                .split(",")
                .filter((f) => f.length)
                .join(","),
            {
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
            }
        );
    };

    return (
        <>
            <div className="sm:space-y-6 space-y-4">
                <Heading level={6}>
                    Matériel existant pouvant être utilisé dans l'exécution du
                    projet.
                </Heading>

                <ResourceSelecter
                    resources={data.resources}
                    addResource={(resource) => {
                        if (
                            data.resources.some((r) => r.code === resource.code)
                        ) {
                            alert("Cette resource est deja ajouté!");
                            return;
                        }

                        setData((data) => {
                            data.resources.push(resource);
                            return { ...data };
                        });
                    }}
                    removeResource={(code) => {
                        const index = data.resources.findIndex(
                            (r) => r.code === code
                        );

                        setData((data) => {
                            data.resources.splice(index, 1);
                            return { ...data };
                        });
                    }}
                />
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

const ResourceSelecter = ({ addResource, removeResource, resources }) => {
    const [search, setSearch] = React.useState("");
    const debouncedValue = useDebounce(search, 300);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const { data, isFetching, isLoading, isError, isSuccess } = useQuery({
        queryKey: ["search-existing-resources", debouncedValue],
        queryFn: debouncedValue
            ? async ({ signal }) =>
                  searchExistingResources(debouncedValue, { signal })
            : skipToken,
        placeholderData: (previousData) => previousData,
    });

    return (
        <div className="flex md:flex-row flex-col justify-between items-start lg:gap-8 md:gap-4 gap-0">
            <Card.Card className="relative flex-1 w-full md:min-h-96 md:rounded-b-lg md:border-b border-b-0 rounded-b-none overflow-hidden">
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
                        data.length ? (
                            data.map((resource, idx) => (
                                <Card.Card
                                    key={idx}
                                    className="p-4 w-full space-y-2"
                                >
                                    <div className="flex justify-between items-center gap-4">
                                        <Card.CardTitle className="text-base">
                                            {resource.name}
                                        </Card.CardTitle>
                                        <Card.CardSubTitle className="text-sm">
                                            {resource.code}
                                        </Card.CardSubTitle>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        {
                                            <ReadMore
                                                text={
                                                    resource.description ??
                                                    "Aucune description fournie"
                                                }
                                                charLimit={100}
                                                readMoreText="...Lire plus"
                                                readLessText="...Lire moins"
                                            />
                                        }

                                        <Tooltip.TooltipProvider>
                                            <Tooltip.Tooltip>
                                                <Tooltip.TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="self-end"
                                                        onClick={() =>
                                                            addResource({
                                                                code: resource.code,
                                                                name: resource.name,
                                                            })
                                                        }
                                                    >
                                                        <ArrowRight className="h-5 w-5 md:rotate-0 rotate-90" />
                                                    </Button>
                                                </Tooltip.TooltipTrigger>
                                                <Tooltip.TooltipContent>
                                                    Ajouter la ressource
                                                </Tooltip.TooltipContent>
                                            </Tooltip.Tooltip>
                                        </Tooltip.TooltipProvider>
                                    </div>
                                </Card.Card>
                            ))
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

            <Card.Card className="flex-1 w-full md:rounded-t-lg rounded-t-none">
                <Card.CardHeader>
                    <Card.CardTitle>Ressources séléctionner</Card.CardTitle>
                </Card.CardHeader>
                <Card.CardContent className="space-y-2 md:max-h-[30rem] max-h-[20rem] overflow-y-auto snap-mandatory snap-y scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thin">
                    {resources.map((resource, idx) => (
                        <Card.Card
                            key={idx}
                            className="p-4 flex items-center justify-between"
                        >
                            <div className="flex flex-col">
                                <Card.CardSubTitle className="text-sm font-normal">
                                    {resource.code}
                                </Card.CardSubTitle>
                                <Card.CardTitle className="text-base font-medium">
                                    {resource.name}
                                </Card.CardTitle>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => removeResource(resource.code)}
                            >
                                <X />
                            </Button>
                        </Card.Card>
                    ))}
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
                                    <Label
                                        htmlFor={`resources_crti.${idx}.name`}
                                        required
                                    >
                                        Ressource
                                    </Label>
                                    <Input
                                        id={`resources_crti.${idx}.name`}
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
                                    <Label
                                        htmlFor={`resources_crti.${idx}.price`}
                                        required
                                    >
                                        Prix
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id={`resources_crti.${idx}.price`}
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
                                        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 select-none text-gray-600 dark:text-gray-50 font-medium sm:text-base text-sm">
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
                                <Label
                                    htmlFor={`resources_crti.${idx}.description`}
                                >
                                    Observation
                                </Label>
                                <Textarea
                                    id={`resources_crti.${idx}.description`}
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
                                    <Label
                                        htmlFor={`resources_partner.${idx}.name`}
                                        required
                                    >
                                        Ressource
                                    </Label>
                                    <Input
                                        id={`resources_partner.${idx}.name`}
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
                                    <Label
                                        htmlFor={`resources_partner.${idx}.price`}
                                        required
                                    >
                                        Prix
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id={`resources_partner.${idx}.price`}
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
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-50 font-medium text-base">
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
                                <Label
                                    htmlFor={`resources_partner.${idx}.description`}
                                >
                                    Observation
                                </Label>
                                <Textarea
                                    id={`resources_partner.${idx}.description`}
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
