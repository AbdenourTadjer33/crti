import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
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

import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import { CalendarIcon, ChevronsUpDown, Check, X } from "lucide-react";
import { Label } from "@/Components/ui/label";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandItem,
    CommandHeader,
} from "@/Components/ui/command";
import { FormWrapper } from "@/Components/ui/form";

interface Unit {
    id: number;
    name: string;
    divisions: Division[];
}

interface Division {
    id: number;
    name: string;
}

interface Board {
    id: number;
    name: string;
}

interface CreateFormProps {
    units?: Unit[];
    boards?: Board[];
}

const CreateForm: React.FC<CreateFormProps> = ({ units = [], boards = [] }) => {
    const { data, setData, errors, clearErrors, post, reset, processing } =
        useForm<{
            last_name: string;
            first_name: string;
            sex?: string;
            dob?: string;
            email: string;
            password: string;
            unit_id?: number;
            status: boolean;
        }>({
            last_name: "",
            first_name: "",
            dob: undefined,
            sex: "",
            email: "",
            password: "",
            unit_id: undefined,
            status: true,
        });

    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

    useEffect(() => {
        if (data.unit_id) {
            const unit = units.find((u) => u.id === data.unit_id);
            setSelectedUnit(unit || null);
        } else {
            setSelectedUnit(null);
        }
    }, [data.unit_id, units]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("manage.user.store"), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <FormWrapper className="space-y-4" onSubmit={submitHandler}>
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 gap-4">

                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label required>Nom</Label>
                    <Input
                        value={data.last_name}
                        onChange={(e) => {
                            setData("last_name", e.target.value);
                        }}
                    />
                    <InputError message={errors.last_name} />
                </div>
                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label required>Prénom</Label>
                    <Input
                        value={data.first_name}
                        onChange={(e) => {
                            setData("first_name", e.target.value);
                        }}
                    />
                    <InputError message={errors.first_name} />
                </div>
                <div className="space-y-1 sm:col-span-1 col-span-3">
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
                    <InputError message={errors.sex} />
                </div>
                <div className="space-y-1 sm:col-span-1 col-span-3">
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
                                    if (date) {
                                        setData(
                                            "dob",
                                            format(date, "yyyy-MM-dd")
                                        );
                                    }
                                }}
                                selected={
                                    data.dob ? new Date(data.dob) : undefined
                                }
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <InputError message={errors.dob} />
                </div>
                <div className="space-y-1 sm:col-span-2 col-span-3">
                    <Label required>Adresse e-mail</Label>
                    <Input
                        placeholder="@exemple.com"
                        value={data.email}
                        onChange={(e) => {
                            setData("email", e.target.value);
                        }}
                    />
                    <InputError message={errors.email} />
                </div>
                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label required>Mot de passe</Label>
                    <Input
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    <InputError message={errors.password} />
                </div>
                <div className="space-y-1 sm:col-span-2 col-span-2">
                    <Label>Unité de rattachement</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="justify-between w-full"
                            >
                                {selectedUnit
                                ? selectedUnit.name
                                : "Sélectionnez une unité"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                            <Command>
                                <CommandHeader>
                                    <CommandInput placeholder="Rechercher une unité..." />
                                </CommandHeader>
                                <CommandEmpty>
                                    Aucune unité avec ce nom n'est trouvée.
                                </CommandEmpty>
                                <CommandList>
                                    <CommandGroup>
                                        {units.map(({ id, name }) => (
                                            <CommandItem
                                                key={id}
                                                onSelect={() => {
                                                    if (data.unit_id === id) {
                                                        setData(
                                                            "unit_id",
                                                            undefined
                                                        );
                                                        setSelectedUnit(null); 
                                                    } else {
                                                        setData("unit_id", id);
                                                        setSelectedUnit(
                                                            units.find(
                                                                (u) => u.id === id
                                                            ) || null
                                                        );
                                                    }
                                                }}
                                            >
                                                {data.unit_id === id && (
                                                    <Check className="ml-auto h-4 w-4" />
                                                )}
                                                {name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <InputError message={errors.unit_id} />
                </div>
            </div>


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
                    type="submit"
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
