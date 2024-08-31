import React from "react";
import { Link, router, useForm } from "@inertiajs/react";
import { Button, buttonVariants } from "@/Components/ui/button";
import { FormWrapper } from "@/Components/ui/form";
import { Label } from "@/Components/ui/label";
import { InputError } from "@/Components/ui/input-error";
import { useDebounce } from "@/Hooks/use-debounce";
import { User } from "@/types";
import { skipToken, useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/Services/api/users";
import { ArrowRight, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useUpdateEffect } from "@/Hooks/use-update-effect";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { getInitials } from "@/Utils/helper";
import * as Card from "@/Components/ui/card";
import { Progress } from "@/Components/ui/infinate-progress";
import SearchInput from "@/Components/common/search-input";
import { cn } from "@/Utils/utils";
import { Text } from "@/Components/ui/paragraph";
import UserAvatar from "@/Components/common/user-hover-avatar";
import * as Select from "@/Components/ui/select";
import { Calendar } from "@/Components/ui/calendar";
import { format, isBefore, startOfToday } from "date-fns";

function prepareData(data: any) {
    const formData: any = { ...data };

    if (formData.judgment_period.from) {
        formData.judgment_period.from = format(
            formData.judgment_period.from,
            "yyy-MM-dd"
        );
    }

    if (formData.judgment_period.to) {
        formData.judgment_period.to = format(
            formData.judgment_period.to,
            "yyy-MM-dd"
        );
    }

    return formData;
}

const CreateForm: React.FC = () => {
    const { data, setData, errors, processing, clearErrors, reset, setError } =
        useForm<{
            judgment_period: DateRange;
            president: string;
            project: string;
            members: Pick<User, "uuid" | "name" | "email">[];
        }>({
            judgment_period: { from: undefined, to: undefined },
            project: "",
            president: "",
            members: [],
        });

    const addMember = (user: User) => {
        if (!data.members.some((member) => member.uuid == user.uuid)) {
            setData((data) => {
                data.members.push({ ...user });
                return { ...data };
            });
        }
    };

    const removeMember = (uuid: string) => {
        setData((data) => {
            const members = data.members;
            const idx = members.findIndex((member) => member.uuid === uuid);
            members.splice(idx, 1);
            return { ...data, members };
        });
    };

    const handleDateRangeChange = (range: DateRange | undefined) => {
        const today = startOfToday();

        if (range) {
            const { from, to } = range;
            const validFrom = from && isBefore(from, today) ? today : from;
            const validTo = to && isBefore(to, today) ? undefined : to;

            setData("judgment_period", { from: validFrom, to: validTo });
        } else {
            setData("judgment_period", undefined!);
        }
    };

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        router.post(route("manage.board.store"), prepareData(data), {
            onError: (errors) => setError(errors as any),
            preserveScroll: "errors",
            onSuccess: () => reset(),
        });
    };

    useUpdateEffect(() => {
        if (!data.president) return;

        const user = data.members.find((p) => p.uuid === data.president);
        if (!user) setData("president", "");
    }, [JSON.stringify(data.members)]);

    return (
        <FormWrapper
            className="space-y-4 md:space-y-6"
            onSubmit={submitHandler}
        >
            <div className="flex md:flex-row flex-col lg:gap-10 md:gap-5 gap-4">
                <div className="space-y-1 flex-1">
                    <Label required>Projet associé</Label>
                    <SearchProjects />
                    <InputError message={errors["project"]} />
                </div>
                <div className="space-y-1">
                    <Label required>Periode de judgment</Label>
                    <Calendar
                        mode="range"
                        showOutsideDays={false}
                        selected={data.judgment_period}
                        onSelect={handleDateRangeChange}
                        className="flex p-0"
                        classNames={{
                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 border rounded-md p-4",
                        }}
                    />
                    <InputError message={errors.judgment_period} />
                </div>
            </div>

            <div className="space-y-1">
                <Label required>Membres du conseil</Label>
                <div className="flex md:flex-row flex-col justify-between items-start lg:gap-10 md:gap-5 gap-0">
                    <SearchUsers addMember={addMember} />
                    <Card.Card className="flex-1 w-full md:rounded-t-lg rounded-t-none">
                        <Card.CardHeader>
                            <Card.CardTitle>Membres du conseil</Card.CardTitle>
                        </Card.CardHeader>
                        <Card.CardContent className="grid gap-6">
                            {data.members.map((member) => (
                                <div
                                    key={member.uuid}
                                    className="flex items-center justify-between space-x-4"
                                >
                                    <div className="flex items-center space-x-4">
                                        <UserAvatar user={member} />
                                        <div>
                                            <p className="text-sm font-medium leading-none">
                                                {member.name}{" "}
                                                {member.uuid ===
                                                    data.president && (
                                                    <span className="font-semibold">
                                                        (Président)
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {member.email}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            removeMember(member.uuid)
                                        }
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>
                            ))}
                        </Card.CardContent>
                        {!!data.members.length && (
                            <Card.CardFooter className="flex-col items-start space-y-1">
                                <Label required>Président du conseil</Label>
                                <Select.Select
                                    value={data.president}
                                    onValueChange={(uuid) => {
                                        clearErrors("president");
                                        setData("president", uuid);
                                    }}
                                >
                                    <Select.SelectTrigger>
                                        {!data.president
                                            ? "Select pre"
                                            : data.members.find(
                                                  (m) =>
                                                      m.uuid === data.president
                                              )?.name}
                                    </Select.SelectTrigger>
                                    <Select.SelectContent>
                                        <Select.SelectGroup>
                                            {!!data.members.length ? (
                                                data.members.map((member) => (
                                                    <Select.SelectItem
                                                        key={member.uuid}
                                                        value={member.uuid}
                                                    >
                                                        {member.name}
                                                    </Select.SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2.5 text-sm">
                                                    Veuillez séléctionnez les
                                                    members de consiel tout
                                                    d'abord!
                                                </div>
                                            )}
                                        </Select.SelectGroup>
                                    </Select.SelectContent>
                                </Select.Select>
                                <InputError message={errors["president"]} />
                            </Card.CardFooter>
                        )}
                    </Card.Card>
                </div>
                <InputError message={errors["members"]} />
            </div>

            <div className="mx-auto max-w-lg flex flex-col-reverse sm:flex-row items-center sm:gap-4 gap-2">
                <Button
                    variant="destructive"
                    disabled={processing}
                    className="w-full"
                    asChild
                >
                    <Link href={route("manage.board.index")}>Annuler</Link>
                </Button>
                <Button disabled={processing} className="w-full">
                    Créer
                </Button>
            </div>
        </FormWrapper>
    );
};

export const SearchUsers: React.FC<any> = ({ addMember }) => {
    const [search, setSearch] = React.useState("");
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const debouncedValue = useDebounce(search, 300);

    const {
        data: users,
        isFetching,
        isLoading,
        isError,
        isSuccess,
    } = useQuery({
        queryKey: ["search-users", debouncedValue],
        queryFn: debouncedValue
            ? async ({ signal }) => searchUsers(debouncedValue, { signal })
            : skipToken,
        placeholderData: (previousData) => previousData,
    });

    return (
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
                    users.length ? (
                        users?.map((user) => (
                            <div
                                key={user.uuid}
                                className={cn(
                                    buttonVariants({
                                        variant: "ghost",
                                    }),
                                    "flex justify-between items-center gap-2 py-6 px-2 select-none hover:bg-transparent"
                                )}
                            >
                                <div className="flex items-center space-x-4">
                                    <Avatar>
                                        <AvatarFallback>
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium leading-none">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => addMember(user)}
                                >
                                    <ArrowRight className="h-5 w-5 md:rotate-0 rotate-90" />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <Text>Aucun résultat trouvé</Text>
                    )
                ) : isError ? (
                    <div className="text-red-600">
                        Oups ! Quelque chose s'est mal passé. Veuillez vérifier
                        votre connexion Internet et réessayer
                    </div>
                ) : (
                    <Text>
                        Rechercher et ajouter les membres de votre projet. Vous
                        pouvez rechercher les membres par leur nom ou leur
                        adresse e-mail.
                    </Text>
                )}
            </Card.CardContent>
        </Card.Card>
    );
};

export const SearchProjects: React.FC<any> = ({ addMember }) => {
    const [search, setSearch] = React.useState("");
    const searchInputRef = React.useRef<HTMLInputElement>(null);
    const debouncedValue = useDebounce(search, 300);

    const {
        data: users,
        isFetching,
        isLoading,
        isError,
        isSuccess,
    } = useQuery({
        queryKey: ["search-users", debouncedValue],
        queryFn: debouncedValue
            ? async ({ signal }) => searchUsers(debouncedValue, { signal })
            : skipToken,
        placeholderData: (previousData) => previousData,
    });

    return (
        <div className="flex md:flex-row flex-col justify-between items-start lg:gap-10 md:gap-5 gap-0">
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
                        users.length ? (
                            users?.map((user) => (
                                <div
                                    key={user.uuid}
                                    className={cn(
                                        buttonVariants({
                                            variant: "ghost",
                                        }),
                                        "flex justify-between items-center gap-2 py-6 px-2 select-none hover:bg-transparent"
                                    )}
                                >
                                    <div className="flex items-center space-x-4">
                                        <Avatar>
                                            <AvatarFallback>
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => addMember(user)}
                                    >
                                        <ArrowRight className="h-5 w-5 md:rotate-0 rotate-90" />
                                    </Button>
                                </div>
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
                            Rechercher et ajouter les membres de votre projet.
                            Vous pouvez rechercher les membres par leur nom ou
                            leur adresse e-mail.
                        </Text>
                    )}
                </Card.CardContent>
            </Card.Card>
        </div>
    );
};

export default CreateForm;
