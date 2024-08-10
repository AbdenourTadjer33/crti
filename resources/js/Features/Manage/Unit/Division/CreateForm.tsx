import React from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { FormWrapper } from "@/Components/ui/form";
import { Label } from "@/Components/ui/label";
import { Input, InputError } from "@/Components/ui/input";
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
import Avatar from "@/Components/Avatar";
import { isAnyKeyBeginWith } from "@/Libs/Validation/utils";

interface CreateFormProps {
    unit: any;
}

const CreateForm: React.FC<CreateFormProps> = ({ unit }) => {
    const { data, setData, errors, processing, post, clearErrors } = useForm<{
        name: string;
        abbr: string;
        description: string;
        members: { uuid: string; name: string; email: string; grade: string }[];
    }>({
        name: "",
        abbr: "",
        description: "",
        members: [],
    });

    const addMember = (user: User) => {
        if (!data.members.some((member) => member.uuid == user.uuid)) {
            setData((data) => {
                data.members.push({ ...user, grade: "" });
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

        post(route("manage.unit.division.store", { unit: unit }), {
            preserveScroll: true,
        });
    };

    return (
        <FormWrapper
            className="space-y-4 md:space-y-8"
            onSubmit={submitHandler}
        >
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2 col-span-3">
                    <Label>Nom de la division</Label>
                    <Input
                        value={data.name}
                        onChange={(e) => {
                            clearErrors("name");
                            setData("name", e.target.value);
                        }}
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label>Abréviation</Label>
                    <Input
                        value={data.abbr}
                        onChange={(e) => {
                            clearErrors("abbr");
                            setData("abbr", e.target.value);
                        }}
                    />
                    <InputError message={errors.abbr} />
                </div>

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

                <div className="space-y-1 col-span-3">
                    <SearchMembers
                        members={data.members}
                        addMember={addMember}
                    />
                </div>

                {!!data.members.length && (
                    <div className="bg-gray-100 rounded p-2 space-y-2.5 col-span-3">
                        {isAnyKeyBeginWith(errors, "members") && (
                            <div className="text-red-500">
                                Vous devez remplire tous les chames grades*
                            </div>
                        )}

                        {data.members.map((member, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="justify-start basis-2/5 sm:text-base text-xs"
                                >
                                    {member.name}
                                </Button>

                                <Input
                                    placeholder="grade"
                                    value={member.grade}
                                    onChange={(e) => {
                                        setData((data) => {
                                            data.members[idx].grade =
                                                e.target.value;
                                            return { ...data };
                                        });
                                        clearErrors(`members.${idx}.grade`);
                                    }}
                                />

                                <Button
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
            </div>

            <div className="mx-auto max-w-lg flex flex-col-reverse sm:flex-row items-center sm:gap-4 gap-2">
                <Button
                    variant="destructive"
                    disabled={processing}
                    className="w-full"
                    asChild
                >
                    <Link href={route("manage.unit.show", unit)}>Annuler</Link>
                </Button>
                <Button disabled={processing} className="w-full">
                    Créer
                </Button>
            </div>
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
                                Commencez à taper pour rechercher des membres de
                                l'équipe...
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
                                            <Avatar
                                                size="sm"
                                                name={user.name}
                                            />
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
