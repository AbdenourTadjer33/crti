import React from "react";
import { Input, InputError } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Popover } from "@/Components/ui/popover";
import { PopoverTrigger } from "@/Components/ui/popover";
import { PopoverContent } from "@/Components/ui/popover";
import { Textarea } from "@/Components/ui/textarea";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandHeader,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import { CreateProjectContext } from "./Form";
import { Button } from "@/Components/ui/button";
import { CalendarIcon, Check, ChevronDown } from "lucide-react";
import { cn } from "@/Utils/utils";
import { capitalize } from "@/Utils/helper";
import { format } from "date-fns";
import { useToast } from "@/Components/ui/use-toast";
import { Calendar } from "@/Components/ui/calendar";
import { FormProps } from "@/Components/Stepper";

const Identification = ({ next }: FormProps) => {
    const { data, setData, errors, processing, validate, clearErrors } =
        React.useContext(CreateProjectContext);

    const goNext = async () => {
        const toValidate =
            "name,nature,domain,timeline,description,objectives,methodology,is_partner,partner,partner.name,partner.email,partner.phone";

        validate(toValidate, {
            onSuccess() {
                next();
            },
        });
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
                <Label>Intitulé du projet</Label>
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
                <Label>Nature du projet</Label>
                <ProjectNature />
                <InputError message={errors.nature} />
            </div>

            <div className="space-y-1">
                <Label>Domaine d'application</Label>
                <DomainField />
                <InputError message={errors.domain} />
            </div>

            <div className="space-y-1">
                <Label>Date début/fin</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="justify-between w-full"
                        >
                            {data.timeline
                                ? `De ${
                                      data.timeline.from &&
                                      format(data.timeline.from, "dd/MM/yyy")
                                  } à ${
                                      data.timeline.to &&
                                      format(data.timeline.to, "dd/MM/yyy")
                                  }`
                                : "sélectionnez la date du début-fin"}
                            <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="range"
                            selected={data.timeline}
                            onSelect={(range) => {
                                clearErrors("timeline");
                                setData("timeline", range);
                            }}
                        />
                    </PopoverContent>
                </Popover>
                <InputError message={errors.timeline} />
            </div>

            <div className="space-y-1 col-span-3">
                <Label>Description succincte du projet</Label>
                <Textarea
                    value={data.description}
                    onChange={(e) => {
                        clearErrors("description");
                        setData("description", e.target.value);
                    }}
                />
                <InputError message={errors.description} />
            </div>

            <div className="space-y-1 col-span-3">
                <Label>Objectifs du projet</Label>
                <Textarea
                    value={data.objectives}
                    onChange={(e) => {
                        clearErrors("objectives");
                        setData("objectives", e.target.value);
                    }}
                />
                <InputError message={errors.objectives} />
            </div>

            <div className="space-y-1 col-span-3">
                <Label>Méthodologies pour la mise en œuvre du projet</Label>
                <Textarea
                    value={data.methodology}
                    onChange={(e) => {
                        clearErrors("methodology");
                        setData("methodology", e.target.value);
                    }}
                />
                <InputError message={errors.methodology} />
            </div>

            <Label className="col-span-3 inline-flex gap-2">
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
                <>
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
                </>
            )}

            <div className="col-span-3">
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
            </div>
        </div>
    );
};

const projectNatures = [
    "dévloppement d'un produit",
    "dévloppement d'un process",
    "dévloppement de service",
    "expertise",
];

const ProjectNature = () => {
    const { data, setData, clearErrors } =
        React.useContext(CreateProjectContext);
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const add = (search: string) => {
        if (!search) {
            return;
        }
        projectNatures.push(search);
        clearErrors("nature");
        setData("nature", search);
        setOpen(false);
        setSearch("");
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                >
                    {data.nature
                        ? capitalize(data.nature)
                        : "Sélectionnez la nature de projet"}
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Command loop>
                    <CommandHeader>
                        <CommandInput
                            value={search}
                            onValueChange={setSearch}
                            placeholder="rechercher ..."
                        />
                    </CommandHeader>
                    <CommandList>
                        <CommandEmpty
                            className="py-4 cursor-pointer"
                            onClick={() => add(search)}
                        >
                            Ajouter{" "}
                            <span className="font-medium">{search}</span>.
                        </CommandEmpty>
                        <CommandGroup>
                            {projectNatures.map((nature, idx) => (
                                <CommandItem
                                    key={idx}
                                    value={nature}
                                    onSelect={(currentValue) => {
                                        clearErrors("nature");
                                        setData("nature", currentValue);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            data.nature === nature
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {capitalize(nature)}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

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

const DomainField = () => {
    const { data, setData, clearErrors } =
        React.useContext(CreateProjectContext);
    const [search, setSearch] = React.useState("");

    const selectHandler = (value: string) => {
        const selectedDomains = [...data.domain];

        if (selectedDomains.includes(value)) {
            selectedDomains.splice(selectedDomains.indexOf(value), 1);
        } else {
            selectedDomains.push(value);
        }

        clearErrors("domain");
        setData("domain", selectedDomains);
    };

    const add = (search: string) => {
        domains.push(search);
        setSearch("");
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between overflow-hidden"
                >
                    {data.domain.length > 0
                        ? data.domain.join(",")
                        : "Domaine d'application"}
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Command loop>
                    <CommandHeader>
                        <CommandInput
                            value={search}
                            onValueChange={setSearch}
                            placeholder="Rechercher..."
                        />
                    </CommandHeader>
                    <CommandList>
                        <CommandEmpty className="py-4" asChild>
                            {!search ? (
                                <div className="text-red-500">
                                    Aucun domaine n'est trouvé.
                                </div>
                            ) : (
                                <div onClick={() => add(search)}>
                                    Ajouter{" "}
                                    <span className="font-medium">
                                        {search}
                                    </span>
                                </div>
                            )}
                        </CommandEmpty>
                        <CommandGroup>
                            {domains.map((domain) => (
                                <CommandItem
                                    key={domain}
                                    value={domain}
                                    onSelect={selectHandler}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            data.domain.includes(domain)
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {capitalize(domain)}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default Identification;
