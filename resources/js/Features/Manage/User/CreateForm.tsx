import React from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { format } from "date-fns";
import { FormWrapper } from "@/Components/ui/form";
import { generatePassword } from "@/Utils/helper";
import { Checkbox } from "@/Components/ui/checkbox";
import { router, useForm } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { toast } from "sonner";
import { Heading } from "@/Components/ui/heading";
import * as Tooltip from "@/Components/ui/tooltip";

const CreateForm: React.FC<{
    universities: { id: number; name: string }[];
    diplomas: { id: number; name: string }[];
}> = ({ universities, diplomas }) => {
    const { data, setData, errors, post, reset, processing } = useForm<{
        lastName: string;
        firstName: string;
        sex?: string;
        dob?: string;
        email: string;
        password: string;
        greetingEmail: boolean;
        accessPermission: boolean;
        title: string;
        academicQualification: {
            university: string;
            diploma: string;
            graduationDate?: string;
        }[];
    }>({
        lastName: "",
        firstName: "",
        dob: undefined,
        sex: "",
        email: "",
        password: "",
        greetingEmail: false,
        accessPermission: false,
        title: "",
        academicQualification: [],
    });

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("manage.user.store"), {
            preserveState: true,
        });
    };

    return (
        <FormWrapper className="space-y-4" onSubmit={submitHandler}>
            <Heading level={4}>
                Informations générales sur l'utilisateur
            </Heading>

            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label required>Prénom</Label>
                    <Input
                        value={data.firstName}
                        onChange={(e) => {
                            setData("firstName", e.target.value);
                        }}
                    />
                    <InputError message={errors.firstName} />
                </div>

                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label required>Nom</Label>
                    <Input
                        value={data.lastName}
                        onChange={(e) => {
                            setData("lastName", e.target.value);
                        }}
                    />
                    <InputError message={errors.lastName} />
                </div>

                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label required>Sexe</Label>
                    <Select
                        defaultValue={data.sex}
                        onValueChange={(value) => setData("sex", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="sexe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"male"}>Homme</SelectItem>
                            <SelectItem value={"female"}>Femme</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={errors.sex} />
                </div>

                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label required>Date de naissance</Label>
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
                                defaultMonth={
                                    data.dob ? new Date(data.dob) : undefined
                                }
                            />
                        </PopoverContent>
                    </Popover>
                    <InputError message={errors.dob} />
                </div>
            </div>

            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2 col-span-3">
                    <Label required>Adresse e-mail</Label>
                    <Input
                        value={data.email}
                        onChange={(e) => {
                            setData("email", e.target.value);
                        }}
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label className="flex items-center">
                        Mot de passe{" "}
                        <span className="text-red-500 ml-1">*</span>
                        <Button
                            type="button"
                            variant="ghost"
                            className="relative text-xs h-6 ml-auto hauto"
                            onClick={() => {
                                const password = generatePassword();
                                setData("password", password);
                            }}
                        >
                            Générer
                        </Button>
                    </Label>
                    <Input
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                    />
                    <InputError message={errors.password} />
                </div>
            </div>

            <Heading level={4}>
                Informations professionnelles{" "}
                <span className="text-gray-500 dark:text-gray-400">
                    (facultatif)
                </span>
            </Heading>

            <div className="space-y-4">
                <div className="space-y-1 sm:max-w-sm w-full">
                    <Label>Titre professionnel</Label>
                    <Input
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                        placeholder="par exemple: ingénieur, chercheur, etc"
                    />
                    <InputError message={errors.title} />
                </div>

                <div className="space-y-2">
                    {!!data.academicQualification.length && (
                        <div className="lg:grid hidden grid-cols-4 gap-4">
                            <Label required>université</Label>
                            <Label required>Diplôme</Label>
                            <Label required>Date d'obtension du diplôme</Label>
                        </div>
                    )}

                    {data.academicQualification.map((proInfo, idx) => (
                        <div
                            key={idx}
                            className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 lg:bg-transparent lg:p-0 lg:rounded-none lg:border-0 lg:shadow-none bg-gray-100 p-2 rounded-md border shadow"
                        >
                            <div className="space-y-1">
                                <Select
                                    value={proInfo.university}
                                    onValueChange={(value) =>
                                        setData((data) => {
                                            data.academicQualification[
                                                idx
                                            ].university = value;
                                            return { ...data };
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une université" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {universities.map((univ, uIdx) => (
                                            <SelectItem
                                                key={uIdx}
                                                value={univ.name}
                                            >
                                                {univ.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <InputError
                                    message={
                                        errors[
                                            `academicQualification.${idx}.university`
                                        ]
                                    }
                                />
                            </div>
                            <div className="space-y-1">
                                <Select
                                    value={proInfo.diploma}
                                    onValueChange={(value) =>
                                        setData((data) => {
                                            data.academicQualification[
                                                idx
                                            ].diploma = value;
                                            return { ...data };
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="sélectionner un Diplôme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {diplomas.map((diploma, idx) => (
                                            <SelectItem
                                                key={idx}
                                                value={diploma.name}
                                            >
                                                {diploma.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <InputError
                                    message={
                                        errors[
                                            `academicQualification.${idx}.diploma`
                                        ]
                                    }
                                />
                            </div>

                            <div className="space-y-1">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between"
                                        >
                                            {proInfo.graduationDate
                                                ? format(
                                                      proInfo.graduationDate,
                                                      "dd/MM/yyy"
                                                  )
                                                : "Sélectionner une date"}
                                            <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            onSelect={(date) => {
                                                if (date) {
                                                    setData((data) => {
                                                        data.academicQualification[
                                                            idx
                                                        ].graduationDate =
                                                            format(
                                                                date,
                                                                "yyy-MM-dd"
                                                            );
                                                        return { ...data };
                                                    });
                                                }
                                            }}
                                            selected={
                                                proInfo.graduationDate
                                                    ? new Date(
                                                          proInfo.graduationDate
                                                      )
                                                    : undefined
                                            }
                                            defaultMonth={
                                                proInfo.graduationDate
                                                    ? new Date(
                                                          proInfo.graduationDate
                                                      )
                                                    : undefined
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>

                                <InputError
                                    message={
                                        errors[
                                            `academicQualification.${idx}.graduationDate`
                                        ]
                                    }
                                />
                            </div>

                            <Tooltip.TooltipProvider>
                                <Tooltip.Tooltip>
                                    <Tooltip.TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={() => {
                                                setData((data) => {
                                                    data.academicQualification.splice(
                                                        idx,
                                                        1
                                                    );
                                                    return { ...data };
                                                });
                                            }}
                                            className="lg:p-0 lg:h-10 lg:w-10 lg:justify-center"
                                        >
                                            <X className="h-4 w-4 shrink-0 mr-2 lg:mr-0" />
                                            <span className="lg:hidden">
                                                Supprimer
                                            </span>
                                        </Button>
                                    </Tooltip.TooltipTrigger>
                                    <Tooltip.TooltipContent>
                                        Supprimer
                                    </Tooltip.TooltipContent>
                                </Tooltip.Tooltip>
                            </Tooltip.TooltipProvider>
                        </div>
                    ))}
                </div>

                <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                        if (data.academicQualification.length >= 5) {
                            toast.error(
                                "Vous ne pouvez ajouter plus de 5 qualification académique"
                            );
                            return;
                        }

                        setData((data) => {
                            data.academicQualification.push({
                                diploma: "",
                                university: "",
                            });
                            return { ...data };
                        });
                    }}
                >
                    Ajouter une Qualification Académique
                </Button>
            </div>

            <div>
                <label className="flex items-center space-x-2 select-none">
                    <Checkbox
                        checked={data.accessPermission}
                        onCheckedChange={(checked) => {
                            setData((data) => {
                                data.accessPermission = !!checked;
                                if (
                                    !data.accessPermission &&
                                    data.greetingEmail
                                ) {
                                    data.greetingEmail = false;
                                }

                                return { ...data };
                            });
                        }}
                    />
                    <span>
                        Accorder à l'utilisateur l'autorisation d'accès à
                        l'application.
                    </span>
                </label>

                <label className="flex items-center space-x-2 select-none">
                    <Checkbox
                        checked={data.greetingEmail}
                        onCheckedChange={(checked) => {
                            setData((data) => {
                                data.greetingEmail = !!checked;

                                if (data.greetingEmail) {
                                    data.accessPermission = true;
                                }

                                return { ...data };
                            });

                            setData("greetingEmail", !!checked);
                        }}
                    />

                    <span>Envoyer à l'utilisateur un mail de bienvenue.</span>
                </label>
            </div>

            <div className="max-w-lg mx-auto flex justify-center gap-2">
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
