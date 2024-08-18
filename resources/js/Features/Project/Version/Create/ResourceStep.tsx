import React from "react";
import { CreateProjectContext } from "@/Contexts/Project/create-project-context";
import { FormProps } from "@/Components/Stepper";
import { Heading } from "@/Components/ui/heading";
import { Button } from "@/Components/ui/button";
import * as Accordion from "@/Components/ui/accordion";
import { useSessionStorage } from "@/Hooks/use-session-storage-with-object";
import * as Command from "@/Components/ui/command";
import { useDebounce } from "@/Hooks/use-debounce";
import { skipToken, useQuery } from "@tanstack/react-query";
import { searchExistingResources } from "@/Services/api/resources";
import { ChevronDown, LoaderCircle, X } from "lucide-react";
import { Kbd } from "@/Components/ui/kbd";
import { Skeleton } from "@/Components/ui/skeleton";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Label } from "@/Components/ui/label";
import { deepKeys } from "@/Libs/Validation/utils";

const ResourceForm = ({ next, prev }: FormProps) => {
    const { data, processing, validate, clearErrors } =
        React.useContext(CreateProjectContext);
    const [accordionState, setAccordionState] = useSessionStorage(
        "accordion-state",
        ["1"]
    );

    const goNext = () => {
        const fields = `resources,${deepKeys(
            data.resources,
            "resources"
        )}resources_partner,${deepKeys(
            data.resources_partner,
            "resources_partner"
        )}resources_crti,${deepKeys(data.resources_crti, "resources_crti")}`;

        validate(fields, {
            onSuccess: () => {
                clearErrors(fields);
                next();
            },
        });
    };

    return (
        <div className="space-y-8">
            <Accordion.Accordion
                type="multiple"
                value={accordionState}
                onValueChange={(value) => {
                    setAccordionState(value);
                }}
            >
                <Accordion.AccordionItem value="1">
                    <Accordion.AccordionTrigger>
                        Matériel existant pouvant être utilisé dans l'exécution
                        du projet.
                    </Accordion.AccordionTrigger>
                    <Accordion.AccordionContent>
                        <ResourceSelecter />
                    </Accordion.AccordionContent>
                </Accordion.AccordionItem>
                <Accordion.AccordionItem value="2">
                    <Accordion.AccordionTrigger>
                        Matière première, composants et petits équipements à
                        acquérir par le CRTI
                    </Accordion.AccordionTrigger>
                    <Accordion.AccordionContent>
                        <ResourceCrti />
                    </Accordion.AccordionContent>
                </Accordion.AccordionItem>
                {data.is_partner && (
                    <Accordion.AccordionItem value="3">
                        <Accordion.AccordionTrigger>
                            Matière première, composants et petits équipements à
                            acquérir par le partenaire socio-économique
                        </Accordion.AccordionTrigger>
                        <Accordion.AccordionContent>
                            <ResourcePartner />
                        </Accordion.AccordionContent>
                    </Accordion.AccordionItem>
                )}
            </Accordion.Accordion>

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
        </div>
    );
};

const ResourceSelecter = () => {
    const {} = React.useContext(CreateProjectContext);
    const [search, setSearch] = React.useState("");
    const debouncedValue = useDebounce(search, 300);
    const commandInputRef = React.useRef<HTMLInputElement>(null);

    const { data, isFetching, isLoading, isError, isSuccess } = useQuery({
        queryKey: ["search-existing-resources", debouncedValue],
        queryFn: debouncedValue
            ? async ({ signal }) =>
                  searchExistingResources(debouncedValue, { signal })
            : skipToken,
    });

    return (
        <div className="px-4">
            <Command.Command loop shouldFilter={false} className="outline-none">
                <Command.CommandHeader>
                    <Command.CommandInput
                        ref={commandInputRef}
                        value={search}
                        onValueChange={setSearch}
                        placeholder="Rechercher..."
                        autoFocus
                    />
                    {isFetching && (
                        <LoaderCircle className="animate-spin mr-2" />
                    )}
                    <Command.CommandShortcut>
                        <Kbd>ctrl+K</Kbd>
                    </Command.CommandShortcut>
                </Command.CommandHeader>
                <Command.CommandList className="max-h-none">
                    <Command.CommandEmpty className="py-4">
                        {!search ? (
                            <div className="text-gray-800 font-medium text-lg">
                                Commencez à taper pour rechercher des resourecs
                                existant peuvent étre utiliser dans ce projet
                            </div>
                        ) : isLoading ? (
                            <div className="px-2.5 space-y-4">
                                {Array.from({ length: 3 }, (_, idx) => idx).map(
                                    (_, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-4"
                                        >
                                            <Skeleton className="h-12 w-12 rounded" />
                                        </div>
                                    )
                                )}
                            </div>
                        ) : isError ? (
                            <>error</>
                        ) : (
                            <>Aucun resultat trouvé.</>
                        )}
                    </Command.CommandEmpty>
                    {isSuccess && (
                        <Command.CommandGroup className="p-0">
                            {/* {data.map(resource) =>} */}
                        </Command.CommandGroup>
                    )}
                </Command.CommandList>
            </Command.Command>
        </div>
    );
};

const ResourceCrti = () => {
    const { data, setData, errors } = React.useContext(CreateProjectContext);
    const [nature, setNature] = React.useState("");
    const [accordionState, setAccordionState] = React.useState("");

    console.log(errors);

    return (
        <div className="space-y-4">
            <Accordion.Accordion
                type="single"
                value={accordionState}
                onValueChange={setAccordionState}
                className="space-y-3"
            >
                {data.resources_crti.map((resource, idx) => (
                    <Accordion.AccordionItem
                        key={idx}
                        value={String(idx)}
                        className="p-2 border rounded space-y-2"
                    >
                        <AccordionPrimitive.Header className="px-1 flex items-center gap-1">
                            <Input
                                value={resource.name}
                                onChange={(e) =>
                                    setData((data) => {
                                        data.resources_crti[idx].name =
                                            e.target.value;
                                        return { ...data };
                                    })
                                }
                            />
                            <AccordionPrimitive.Trigger asChild>
                                <Button variant="ghost" size="sm">
                                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                                </Button>
                            </AccordionPrimitive.Trigger>
                        </AccordionPrimitive.Header>
                        <Accordion.AccordionContent className="p-1 flex gap-4">
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
                            <div className="flex flex-col justify-between gap-1">
                                <div className="space-y-1">
                                    <Label>Prix</Label>
                                    <Input
                                        value={resource.price}
                                        onChange={(e) =>
                                            setData((data) => {
                                                data.resources_crti[idx].price =
                                                    e.target.value;
                                                return { ...data };
                                            })
                                        }
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
                            </div>
                        </Accordion.AccordionContent>
                    </Accordion.AccordionItem>
                ))}
            </Accordion.Accordion>

            <div className="relative max-w-xl mx-auto">
                <Input
                    value={nature}
                    onChange={(e) => setNature(e.target.value)}
                    placeholder="Nature de la ressource..."
                    className="pr-20"
                />
                <Button
                    className="absolute right-0.5 top-1/2 -translate-y-1/2"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        if (nature.trim().length) {
                            const index = data.resources_crti.length;
                            setData((data) => {
                                data.resources_crti.push({
                                    name: nature,
                                    description: "",
                                    price: "",
                                });
                                return { ...data };
                            });
                            setNature("");
                            setAccordionState(String(index));
                            return;
                        }

                        alert("you must add the resource name!");
                    }}
                >
                    Ajouter
                </Button>
            </div>
        </div>
    );
};

const ResourcePartner = () => {
    return <div>resources partner</div>;
};

export default ResourceForm;
