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

import { Button, ButtonGroup } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import {
    CalendarIcon,
    ChevronsUpDown,
    Check,
    University,
    X,
    Users,
} from "lucide-react";
import { cn } from "@/Utils/utils";
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
} from "@/Components/ui/command";
import { FormWrapper } from "@/Components/ui/form";
import { TableWrapper } from "@/Components/ui/table";
import { MdAdd } from "react-icons/md";
import * as Dropdown from "@/Components/ui/dropdown-menu";
import { FaCaretDown } from "react-icons/fa";
import DataTable from "@/Components/DataTable";
import { Switch } from "@/Components/ui/switch";
import { Text } from "@/Components/ui/paragraph";
import { Badge } from "@/Components/ui/badge";

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
            password_confirmation: string;
            unit_id?: number;
            divisions?: { id: number; grade?: string }[];
            boards?: number[];
            status: boolean;
        }>({
            last_name: "",
            first_name: "",
            dob: undefined,
            sex: "",
            email: "",
            password: "",
            password_confirmation: "",
            unit_id: undefined,
            divisions: [],
            boards: [],
            status: true,
        });

    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [selectedDivisions, setSelectedDivisions] = useState<Division[]>([]);
    const [selectedBoards, setSelectedBoards] = useState<Board[]>([]);

    useEffect(() => {
        if (data.unit_id) {
            const unit = units.find((u) => u.id === data.unit_id);
            setSelectedUnit(unit || null);
        } else {
            setSelectedUnit(null);
            setSelectedDivisions([]);
            setData("divisions", []);
            setData("boards", []);
        }
    }, [data.unit_id, units]);

    const handleDivisionSelect = (division: Division) => {
        if (!selectedDivisions.some((d) => d.id === division.id)) {
            setSelectedDivisions([...selectedDivisions, division]);
            setData("divisions", [
                ...data.divisions!,
                { id: division.id, grade: "" },
            ]);
        }
    };

    const removeDivision = (divisionId: number) => {
        setSelectedDivisions(
            selectedDivisions.filter((d) => d.id !== divisionId)
        );
        setData(
            "divisions",
            data.divisions!.filter((d) => d.id !== divisionId)
        );
    };

    const updateDivisionGrade = (divisionId: number, grade: string) => {
        const updatedDivisions = data.divisions!.map((d) =>
            d.id === divisionId ? { ...d, grade } : d
        );
        setData("divisions", updatedDivisions);
    };

    const handleBoardSelect = (board: Board) => {
        if (!selectedBoards.some((b) => b.id === board.id)) {
            setSelectedBoards([...selectedBoards, board]);
            setData("boards", [...data.boards!, board.id]);
        }
    };

    const removeBoard = (boardId: number) => {
        setSelectedBoards(selectedBoards.filter((b) => b.id !== boardId));
        setData(
            "boards",
            data.boards!.filter((id) => id !== boardId)
        );
    };

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
                <div className="flex items-center justify-center gap-3 space-y-1 sm:col-span-1 col-span-3 row-span-2">
                    <Switch
                        checked={data.status}
                        onCheckedChange={(checked) =>
                            setData("status", checked)
                        }
                    />
                    <Text>Statut {data.status ? "Activé" : "Désactivé"}</Text>
                    <InputError message={errors.status} />
                </div>
                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label>Nom</Label>
                    <Input
                        value={data.last_name}
                        onChange={(e) => {
                            setData("last_name", e.target.value);
                        }}
                    />
                    <InputError message={errors.last_name} />
                </div>
                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label>Prénom</Label>
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
                    <Label>Adresse e-mail</Label>
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
                    <Label>Mot de passe</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="******"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    <InputError message={errors.password} />
                </div>
                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label>Confime mot de passe</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="******"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                    />
                    <InputError message={errors.password} />
                </div>
            </div>
            <div className="space-y-1 sm:col-span-1 col-span-3">
                <Label>Unité de rattachement</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            className="justify-between w-full"
                        >
                            {data.unit_id
                                ? units.find(({ id }) => id === data.unit_id)
                                      ?.name
                                : "Sélectionnez une unité"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                        <Command>
                            <CommandInput placeholder="Rechercher une unité..." />
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
                                                    ); // Déselectionne l'unité
                                                    setSelectedUnit(null); // Réinitialise l'unité sélectionnée
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
            {selectedUnit && (
                <div className="space-y-1 sm:col-span-5 col-span-3">
                    <Label>Divisions</Label>
                    <div className="flex flex-wrap gap-2">
                        {selectedUnit.divisions.map(
                            (division) =>
                                !selectedDivisions.some(
                                    (d) => d.id === division.id
                                ) && (
                                    <Badge
                                        key={division.id}
                                        variant="blue"
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleDivisionSelect(division)
                                        }
                                    >
                                        {division.name}
                                    </Badge>
                                )
                        )}
                    </div>
                    {selectedDivisions.length > 0 && (
                        <div className="space-y-2 mt-4">
                            <Label>Divisions Sélectionnées</Label>
                            {selectedDivisions.map((division) => (
                                <div
                                    key={division.id}
                                    className="flex items-center gap-4"
                                >
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="justify-start basis-2/5 sm:text-base text-xs"
                                    >
                                        {division.name}
                                    </Button>
                                    <Input
                                        placeholder="Grade"
                                        value={
                                            data.divisions!.find(
                                                (d) => d.id === division.id
                                            )?.grade || ""
                                        }
                                        onChange={(e) =>
                                            updateDivisionGrade(
                                                division.id,
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className="items-center"
                                        onClick={() =>
                                            removeDivision(division.id)
                                        }
                                    >
                                        <X className="h-4 w-4 sm:mr-2" />
                                        <span className="hidden sm:block">
                                            Supprimer
                                        </span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <div className="space-y-1 sm:col-span-5 col-span-3">
                <Label>Ajouter comme membre d'un conseil scientifique</Label>
                <div className="flex flex-wrap gap-2">
                    {boards.map(
                        (board) =>
                            !selectedBoards.some((b) => b.id === board.id) && (
                                <Badge
                                    key={board.id}
                                    variant="blue"
                                    className="cursor-pointer"
                                    onClick={() => handleBoardSelect(board)}
                                >
                                    {board.name}
                                </Badge>
                            )
                    )}
                </div>
                {selectedBoards.length > 0 && (
                    <div className="space-y-2 mt-4">
                        <Label>conseils Sélectionnés</Label>
                        <div className="flex flex-wrap gap-5">
                            {selectedBoards.map((board) => (
                                <Badge
                                    key={board.id}
                                    variant="blue"
                                    className="flex items-center gap-1 justify-start sm:text-base text-xs"
                                >
                                    <span>{board.name}</span>
                                    <X
                                        className="h-4 w-4"
                                        onClick={() => removeBoard(board.id)}
                                    />
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
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
            {/* <pre>{JSON.stringify(boards, null, 2)}</pre>

            <pre>{JSON.stringify(units, null, 2)}</pre>
            <pre>{JSON.stringify(data, null, 2)}</pre> */}
        </FormWrapper>
    );
};

export default CreateForm;
