import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { FormWrapper } from "@/Components/ui/form";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import { Textarea } from "@/Components/ui/textarea";
import { useDebounce } from "@/Hooks/use-debounce";
import { User } from "@/types";
import { useEventListener } from "@/Hooks/use-event-listener";
import { skipToken, useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/Services/api/users";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandHeader,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
} from "@/Components/ui/command";
import { LoaderCircle, Plus, X } from "lucide-react";
import { Kbd } from "@/Components/ui/kbd";
import { Skeleton } from "@/Components/ui/skeleton";
import { DateRange } from "react-day-picker";
import PeriodField from "./PeriodField";
import SelectProjectField, { Project } from "./SelectProjectField";
import { useUpdateEffect } from "@/Hooks/use-update-effect";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { getInitials } from "@/Utils/helper";

interface CreateProps {
    projects: Project[];
    presidents: User[];
}

const CreateForm: React.FC<CreateProps> = ({ projects, presidents }) => {
    const { data, setData, errors, processing, post, clearErrors, reset } =
        useForm<{
            name: string;
            judgment_period: DateRange;
            description: string;
            president: string;
            project: string;
            members: { uuid: string; name: string; email: string }[];
        }>({
            name: "",
            judgment_period: { from: undefined, to: undefined },
            description: "",
            project: "",
            president: "",
            members: [],
        });

    useUpdateEffect(() => {
        if (!data.president) return;

        const user = presidents.find((p) => p.uuid === data.president);
        addMember(user!);
    }, [data.president]);

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

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("manage.board.store"), {
            only: ["errors", "flash"],
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <FormWrapper
            className="space-y-4 md:space-y-8"
            onSubmit={submitHandler}
        >
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label required>Nom du conseil scientifique</Label>
                    <Input
                        value={data.name}
                        onChange={(e) => {
                            clearErrors("name");
                            setData("name", e.target.value);
                        }}
                    />
                    <InputError message={errors.name} />
                </div>
                <div className="pace-y-1 sm:col-span-1 col-span-3">
                    <Label required>Projet associé</Label>
                    <SelectProjectField
                        projects={projects} // Liste des projets à passer en tant que prop
                        initialSelectedProject={data.project} // Le code du projet initialement sélectionné
                        onProjectChange={(code) =>
                            setData("project", code || "")
                        } // Callback pour mettre à jour l'état avec le code du projet sélectionné
                        error={errors.project} // Gestion des erreurs liée à la sélection du projet
                    />
                    <InputError message={errors.project} />
                </div>
                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label required>Date début/fin</Label>
                    <PeriodField
                        value={data.judgment_period}
                        setValue={(value) => setData("judgment_period", value!)}
                    />
                    <InputError message={errors.judgment_period} />
                </div>
                <div className="space-y-1 col-span-3">
                    <Label required>president du conseil</Label>
                    {/* <SearchMembers
                        members={data.president}
                        addMember={addMember}
                    /> */}
                    {/* <SelectPresidentField
                        presidents={presidents}
                        initialSelectedPresident={data.president}
                        onPresidentChange={(uuid) =>
                            setData("president", uuid || "")
                        }
                        error={errors.president}
                    /> */}
                    <InputError message={errors.president} />
                </div>
                <div className="space-y-1 col-span-3">
                    <Label>Membres du conseil</Label>
                    <SearchMembers
                        members={data.members}
                        addMember={addMember}
                    />
                </div>

                {!!data.members.length && (
                    <div className=" rounded p-2 space-y-2.5 col-span-3">
                        {data.members.map((member, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-2">
                                    <Avatar>
                                        <AvatarFallback>
                                            {getInitials(member.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col text-sm">
                                        <span>
                                            {member.name}{" "}
                                            {data.president === member.uuid && (
                                                <span className="font-medium">
                                                    (président du conseil)
                                                </span>
                                            )}
                                        </span>
                                        <span>{member.email}</span>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="items-center"
                                    size="sm"
                                    onClick={() => removeMember(member.uuid)}
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
                <div className="space-y-1 col-span-3">
                    <Label>Description</Label>
                    <Textarea
                        value={data.description}
                        onChange={(e) => {
                            clearErrors("description");
                            setData("description", e.target.value);
                        }}
                    />
                    <InputError message={errors.description} />
                </div>
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
            <pre>{JSON.stringify({ data }, null, 2)}</pre>
        </FormWrapper>
    );
};

interface SearchMemberProps {
    members: any[];
    addMember: (user: User) => void;
}

const SearchMembers = ({ addMember, members }: SearchMemberProps) => {
    const [search, setSearch] = React.useState("");
    const debouncedValue = useDebounce(search, 300);
    const commandInputRef = React.useRef<HTMLInputElement>(null);

    useEventListener("keydown", (e) => {
        if (e.code === "KeyK" && e.ctrlKey) {
            e.preventDefault();
            commandInputRef.current && commandInputRef.current.focus();
        }
    });

    const { data, isFetching, isLoading, isError, isSuccess } = useQuery({
        queryKey: ["search-users", debouncedValue],
        queryFn: debouncedValue
            ? async ({ signal }) => searchUsers(debouncedValue, { signal })
            : skipToken,
    });

    return (
        <div className="rounded-lg border dark:border-gray-500">
            <Command loop shouldFilter={false} className="outline-none">
                <CommandHeader>
                    <CommandInput
                        ref={commandInputRef}
                        value={search}
                        onValueChange={setSearch}
                        placeholder="Rechercher..."
                        autoFocus
                    />
                    {isFetching && (
                        <LoaderCircle className="animate-spin mr-2" />
                    )}
                    <CommandShortcut>
                        <Kbd>ctrl+K</Kbd>
                    </CommandShortcut>
                </CommandHeader>
                <CommandList>
                    <CommandEmpty className="py-4">
                        {!search ? (
                            <div className="text-gray-800 font-medium text-lg">
                                Commencez à taper pour rechercher des membres
                            </div>
                        ) : isLoading ? (
                            <div className="px-2.5 space-y-4">
                                {Array.from({ length: 3 }, (_, idx) => idx).map(
                                    (_, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-4"
                                        >
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <Skeleton className="h-12 w-full rounded" />
                                        </div>
                                    )
                                )}
                            </div>
                        ) : isError ? (
                            <>erreur</>
                        ) : (
                            <>Aucun resultat trouvé.</>
                        )}
                    </CommandEmpty>
                    {isSuccess && (
                        <CommandGroup className="p-0">
                            {data.map((user) =>
                                members.some(
                                    (member) => member.uuid == user.uuid
                                ) ? null : (
                                    <CommandItem
                                        key={user.uuid}
                                        value={user.uuid}
                                        className="py-2.5 grid sm:grid-cols-3 grid-cols-2 gap-4"
                                    >
                                        <div className="inline-flex items-center space-x-2">
                                            <Avatar>
                                                <AvatarFallback>
                                                    {getInitials(user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>{user.name}</div>
                                        </div>
                                        <div className="hidden sm:block">
                                            {user.email}
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                type="button"
                                                className="justify-between items-center"
                                                onClick={() => addMember(user)}
                                            >
                                                Ajouter
                                                <Plus className="h-4 w-4 ml-2" />
                                            </Button>
                                        </div>
                                    </CommandItem>
                                )
                            )}
                        </CommandGroup>
                    )}
                </CommandList>
            </Command>
        </div>
    );
};

export default CreateForm;
