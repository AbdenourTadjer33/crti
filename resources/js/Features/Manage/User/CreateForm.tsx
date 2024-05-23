import { Input, InputError, InputPassword } from "@/Components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Select, SelectItem } from "@/Components/ui/select";
import {
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { router, useForm } from "@inertiajs/react";
import { route } from "@/Utils/helper";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import { CalendarIcon, ChevronsUpDown, Check, University } from "lucide-react";
import { cn } from "@/Utils/utils";
import { Label } from "@/Components/ui/label";
import React from "react";
import { format } from "date-fns";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandItem,
} from "@/Components/ui/command";
import { FormWrapper } from "@/Components/ui/form";

const CreateForm: React.FC<{
    universities: { id: number; name: string }[];
    units: { id: number; name: string }[];
}> = ({ universities, units }) => {
    const { data, setData, errors, clearErrors, post, reset, processing } =
        useForm<{
            fname: string;
            lname: string;
            dob?: string;
            sex?: string;
            grade?: string;
            diploma?: string;
            university?: string;
            email: string;
            status: boolean;
            password: string;
            unit?: string;
        }>({
            fname: "",
            lname: "",
            dob: undefined,
            sex: undefined,
            university: undefined,
            email: "",
            password: "",
            status: true,
        });

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("manage.user.store"), {
            only: ["errors", "flash"],
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <FormWrapper className="space-y-4" onSubmit={submitHandler}>
            <div className="grid lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 gap-4">
                <div>
                    <Label>Nom</Label>
                    <Input
                        value={data.lname}
                        onChange={(e) => {
                            setData("lname", e.target.value);
                        }}
                    />
                    <InputError message={errors.lname} />
                </div>
                <div>
                    <Label>Prénom</Label>
                    <Input
                        value={data.fname}
                        onChange={(e) => {
                            setData("fname", e.target.value);
                        }}
                    />
                    <InputError message={errors.fname} />
                </div>
                <div>
                    <Label>Date de naissance</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full flex items-center justify-between"
                            >
                                {data.dob
                                    ? format(data.dob, "dd/MM/yyy")
                                    : "Sélectionnez une date"}
                                <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                onSelect={(date) => {
                                    setData("dob", format(date!, "yyy/MM/dd"));
                                }}
                                selected={new Date(data.dob!)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <InputError message={errors.dob} />
                </div>
                <div>
                    <Label>Sexe</Label>
                    <Select
                        defaultValue={data.sex}
                        onValueChange={(value) => setData("sex", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="sexe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"male"}>male</SelectItem>
                            <SelectItem value={"female"}>female</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label>Adresse e-mail</Label>
                    <Input
                        value={data.email}
                        onChange={(e) => {
                            setData("email", e.target.value);
                        }}
                    />
                    <InputError message={errors.email} />
                </div>
                <div>
                    <Label>Mot de passe</Label>
                    <InputPassword />
                    <InputError message={errors.password} />
                </div>
            </div>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="justify-between w-full"
                    >
                        {data.university
                            ? universities.find(
                                  ({ id }) => String(id) == data.university
                              )?.name
                            : "sélectionner une université"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Command>
                        <CommandInput placeholder="Rechercher une université..." />
                        <CommandEmpty>
                            Aucune universitie avec ce nom n'est trouvé.
                        </CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {universities.map(({ id, name }) => (
                                    <CommandItem
                                        key={id}
                                        value={name}
                                        onSelect={(currentValue) => {
                                            setData(
                                                "university",
                                                currentValue === data.university
                                                    ? undefined
                                                    : String(id)
                                            );
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                data.university == String(id)
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="justify-between w-full"
                    >
                        {data.unit
                            ? units.find(({ id }) => String(id) == data.unit)
                                  ?.name
                            : "Sélectionnez l'unité de rattachement"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Command>
                        <CommandInput placeholder="Rechercher une unité..." />
                        <CommandEmpty>
                            Aucune unité avec ce nom n'est trouvé.
                        </CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {units.map(({ id, name }) => (
                                    <CommandItem
                                        key={id}
                                        value={name}
                                        onSelect={(value) => {
                                            setData(
                                                "university",
                                                value === data.unit
                                                    ? undefined
                                                    : String(id)
                                            );
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                data.unit == String(id)
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="justify-between w-full"
                    >
                        {data.unit
                            ? units.find(({ id }) => String(id) == data.unit)
                                  ?.name
                            : "Sélectionnez la division de rattachement"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <Command>
                        <CommandInput placeholder="Rechercher une unité..." />
                        <CommandEmpty>
                            Aucune division avec ce nom n'est trouvé.
                        </CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {units.map(({ id, name }) => (
                                    <CommandItem
                                        key={id}
                                        value={name}
                                        onSelect={(value) => {
                                            setData(
                                                "university",
                                                value === data.unit
                                                    ? undefined
                                                    : String(id)
                                            );
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                data.unit == String(id)
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            <pre>{JSON.stringify(data, null, 2)}</pre>

            <div className="flex justify-center gap-2">
                <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    disabled={processing}
                    onClick={() => router.get(route("manage.user.index"))}
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

export default CreateForm;
