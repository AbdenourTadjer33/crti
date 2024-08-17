import React from "react";
import { CreateProjectContext } from "@/Contexts/Project/create-project-context";
import { InputError } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { format } from "date-fns";
import { FormProps } from "@/Components/Stepper";
import { DateRange } from "react-day-picker";
import Field from "@/Libs/FormBuilder/components/Field";
import {Editor} from "@/Components/Editor";
import { capitalize } from "@/Utils/helper";
import { deepKeys } from "@/Libs/Validation/utils";

const domains = [
    "Artificial Intelligence",
    "Machine Learning",
    "Data Science",
    "Internet of Things",
    "Robotics",
    "Cybersecurity",
    "Blockchain",
    "Cloud Computing",
    "Augmented Reality",
    "Virtual Reality",
    "Renewable Energy",
    "Healthcare Technology",
    "Financial Technology",
    "E - commerce",
    "Education Technology",
    "Automotive Technology",
    "Smart Cities",
    "Agricultural Technology",
    "Environmental Sustainability",
    "Biotechnology",
    "Telecommunications",
    "Software Development",
    "Hardware Development",
    "Industrial Automation",
    "Media and Entertainment",
];

const projectNatures = [
    "dévloppement d'un produit",
    "dévloppement d'un process",
    "dévloppement de service",
    "expertise",
];

const Identification = ({ next }: FormProps) => {
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
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Intitulé du projet</Label>
                    <Field
                        type="text"
                        value={data.name}
                        onValueChange={(value) => {
                            clearErrors("name");
                            setData("name", value);
                        }}
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-1">
                    <Label>Nature du projet</Label>
                    <Field
                        type="combobox"
                        options={projectNatures}
                        multiple={false}
                        value={data.nature}
                        onValueChange={(value) => { clearErrors("nature");  setData("nature", value)}}
                        trigger={(value) => {
                            return value
                                ? capitalize(value)
                                : "Sélectionner la nature de projet";
                        }}
                        empty={(search) => (
                            <div
                                onClick={() => {
                                    projectNatures.push(search);
                                    clearErrors("nature");
                                    setData("nature", search);
                                }}
                            >
                                Ajouter {search}
                            </div>
                        )}
                    />
                    <InputError message={errors.nature} />
                </div>

                <div className="space-y-1">
                    <Label>Domaine d'application</Label>
                    <Field
                        type="combobox"
                        options={domains}
                        multiple
                        value={data.domains}
                        onValueChange={(value) => {
                            clearErrors("domains");
                            setData("domains", value);
                        }}
                        trigger={(value) => {
                            return value?.length
                                ? value
                                : "Sélectionner les domaines d'application";
                        }}
                        empty={(search) => (
                            <div
                                onClick={() => {
                                    domains.push(search);
                                }}
                            >
                                Ajouter {search}
                            </div>
                        )}
                    />
                    <InputError message={errors.domains} />
                </div>

                <div className="space-y-1">
                    <Label>Date début/fin</Label>
                    <Field
                        type="calendar"
                        mode="range"
                        showOutsideDays={false}
                        value={data.timeline}
                        onValueChange={(value: DateRange) => {
                            clearErrors("timeline");
                            setData("timeline", value);
                        }}
                        labels={{
                            trigger: (value) => {
                                if (!value?.from && !value?.to) {
                                    return "Date début/fin";
                                }

                                if (value?.from && !value?.to) {
                                    return `De ${format(
                                        value.from,
                                        "dd/MM/yyy"
                                    )}`;
                                }

                                return `De ${format(
                                    value.from,
                                    "dd/MM/yyy"
                                )} à ${format(value.to, "dd/MM/yyy")}`;
                            },
                        }}
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
                                // @ts-ignore
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
                        <Field
                            type="text"
                            value={data.partner.name}
                            onValueChange={(value) => {
                                // @ts-ignore
                                clearErrors("partner.name");
                                setData((data) => {
                                    data.partner.name = value;
                                    return { ...data };
                                });
                            }}
                        />
                        <InputError message={errors["partner.name"]} />
                    </div>

                    <div className="space-y-1">
                        <Label>Adresse e-mail du partenaire</Label>
                        <Field
                            type="text"
                            value={data.partner.email}
                            onValueChange={(value) => {
                                // @ts-ignore
                                clearErrors("partner.email");
                                setData((data) => {
                                    data.partner.email = value;
                                    return { ...data };
                                });
                            }}
                        />
                        <InputError message={errors["partner.email"]} />
                    </div>

                    <div className="space-y-1">
                        <Label>N° téléphone du partenaire</Label>
                        <Field
                            type="text"
                            value={data.partner.phone}
                            onValueChange={(value) => {
                                // @ts-ignore
                                clearErrors("partner.phone");
                                setData((data) => {
                                    data.partner.phone = value;
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

interface NatureFieldProps {
    value: string;
    setValue: (value: string) => void;
    natures: undefined | string[];
}

const NatureField: React.FC<NatureFieldProps> = ({
    value,
    setValue,
    natures,
}) => {
    const [data, setData] = React.useState(natures);
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const addNewItem = async () => {
        const item = search.trim();
        const response = await addProjectNature(item);

        if (response?.status === 201) {
            setData((prev) => {
                return [...(prev as []), item];
            });
            return;
        }

        if (response?.status === 422) {
            alert(response.data.message);
        }
    };

    useUpdateEffect(() => setData(natures), [natures]);

    return (
        <Popover.Popover open={open} onOpenChange={setOpen}>
            <Popover.PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-between pr-0"
                    onClick={() => {
                        if (!natures) {
                            router.reload({
                                only: ["natures"],
                                onStart: (e) => setLoading(true),
                                onFinish: (e) => setLoading(false),
                            });
                        }
                    }}
                >
                    <div className="w-full truncate text-start">
                        {value || "Sélectionner la nature de projet"}
                    </div>

                    <div
                        className={buttonVariants({
                            variant: "ghost",
                            size: "sm",
                        })}
                    >
                        <ChevronDown className="shrink-0 h-4 w-4" />
                    </div>
                </Button>
            </Popover.PopoverTrigger>
            <Popover.PopoverContent className="w-auto p-0">
                <Command.Command loop>
                    <Command.CommandHeader>
                        <Command.CommandInput
                            value={search}
                            onValueChange={(search) =>
                                setSearch(capitalize(search))
                            }
                            placeholder="Rechercher ou Ajouter..."
                        />
                        <div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={addNewItem}
                            >
                                <Plus className="shrink-0 h-5 w-5" />
                            </Button>
                        </div>
                    </Command.CommandHeader>
                    <Command.CommandList>
                        {loading ? (
                            <Command.CommandLoading className="flex items-center justify-center gap-2">
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                Chargement...
                            </Command.CommandLoading>
                        ) : (
                            <Command.CommandEmpty className="p-4">
                                {!search ? (
                                    "No results found."
                                ) : (
                                    <Button
                                        variant="ghost"
                                        className="text-sm gap-1"
                                        onClick={addNewItem}
                                    >
                                        Ajouter{" "}
                                        <span className="font-medium">
                                            {capitalize(search)}
                                        </span>
                                    </Button>
                                )}
                            </Command.CommandEmpty>
                        )}

                        <Command.CommandGroup>
                            {data &&
                                data.map((nature, idx) => (
                                    <Command.CommandItem
                                        key={idx}
                                        value={nature}
                                        onSelect={(currentValue) => {
                                            setValue(
                                                currentValue === value
                                                    ? ""
                                                    : currentValue
                                            );
                                            setOpen(false);
                                            setSearch("");
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === nature
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {nature}
                                    </Command.CommandItem>
                                ))}
                        </Command.CommandGroup>
                    </Command.CommandList>
                </Command.Command>
            </Popover.PopoverContent>
        </Popover.Popover>
    );
};

interface DomainFieldProps {
    values: string[];
    setValues: (values: string[]) => void;
    domains: undefined | string[];
}

const DomainField: React.FC<DomainFieldProps> = ({
    values,
    setValues,
    domains,
}) => {
    const [data, setData] = React.useState(domains);
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const addNewItem = async () => {
        const item = search.trim();
        const response = await addProjectDomain(item);

        if (response?.status === 201) {
            setData((prev) => {
                return [...(prev as []), item];
            });
            return;
        }

        if (response?.status === 422) {
            alert(response.data.message);
        }
    };

    useUpdateEffect(() => setData(domains), [domains]);

    return (
        <Popover.Popover open={open} onOpenChange={setOpen}>
            <Popover.PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-between pr-0"
                    onClick={() => {
                        if (!domains) {
                            router.reload({
                                only: ["domains"],
                                onStart: () => setLoading(true),
                                onFinish: () => setLoading(false),
                            });
                        }
                    }}
                >
                    <div className="w-full truncate text-start">
                        {values.join(", ")}
                    </div>
                    <div
                        className={buttonVariants({
                            variant: "ghost",
                            size: "sm",
                        })}
                    >
                        <ChevronDown className="shrink-0 h-4 w-4" />
                    </div>
                </Button>
            </Popover.PopoverTrigger>
            <Popover.PopoverContent className="w-auto p-0">
                <Command.Command loop>
                    <Command.CommandHeader>
                        <Command.CommandInput
                            value={search}
                            onValueChange={(search) =>
                                setSearch(capitalize(search))
                            }
                            placeholder="Rechercher ou Ajouter..."
                        />
                        <div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={addNewItem}
                            >
                                <Plus className="shrink-0 h-5 w-5" />
                            </Button>
                        </div>
                    </Command.CommandHeader>
                    <Command.CommandList>
                        {loading ? (
                            <Command.CommandLoading className="flex items-center justify-center gap-2">
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                Chargement...
                            </Command.CommandLoading>
                        ) : (
                            <Command.CommandEmpty className="p-4">
                                {!search ? (
                                    "No results found."
                                ) : (
                                    <Button
                                        variant="ghost"
                                        className="text-sm gap-1"
                                        onClick={addNewItem}
                                    >
                                        Ajouter{" "}
                                        <span className="font-medium">
                                            {search}
                                        </span>
                                    </Button>
                                )}
                            </Command.CommandEmpty>
                        )}

                        <Command.CommandGroup>
                            {data &&
                                data.map((domain, idx) => (
                                    <Command.CommandItem
                                        key={idx}
                                        value={domain}
                                        onSelect={() => {
                                            const selected = [...values];

                                            if (values.includes(domain)) {
                                                selected.splice(
                                                    selected.indexOf(domain),
                                                    1
                                                );
                                            } else {
                                                selected.push(domain);
                                            }

                                            setValues(selected);
                                        }}
                                    >
                                        <Check
                                            className={
                                                "mr-2 h-4 w-4 data-[checked=false]:opacity-0"
                                            }
                                            data-checked={values?.includes(
                                                domain
                                            )}
                                        />
                                        {domain}
                                    </Command.CommandItem>
                                ))}
                        </Command.CommandGroup>
                    </Command.CommandList>
                </Command.Command>
            </Popover.PopoverContent>
        </Popover.Popover>
    );
};

interface TimelineFieldProps {
    value: DateRange;
    setValue: (value: DateRange | undefined) => void;
}

const TimelineField: React.FC<TimelineFieldProps> = ({ value, setValue }) => {
    console.log(value);
    return (
        <Popover.Popover>
            <Popover.PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-between pr-0"
                >
                    <div className="w-full truncate text-start">
                        {!value || (!value?.from && !value?.to)
                            ? "Date début/fin"
                            : value.from && !value.to
                            ? `De ${format(value.from, "dd/MM/yyy")}`
                            : value.from &&
                              value.to &&
                              `De ${format(value.from, "dd/MM/yyy")} à ${format(
                                  value.to,
                                  "dd/MM/yyy"
                              )}`}
                    </div>
                    <div
                        className={buttonVariants({
                            variant: "ghost",
                            size: "sm",
                        })}
                    >
                        <CalendarIcon className="shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                </Button>
            </Popover.PopoverTrigger>
            <Popover.PopoverContent className="w-auto p-0">
                <Calendar
                    mode="range"
                    showOutsideDays={false}
                    selected={value}
                    onSelect={setValue}
                />
            </Popover.PopoverContent>
        </Popover.Popover>
    );
};

export default Identification;
