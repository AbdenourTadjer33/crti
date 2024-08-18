import React from "react";
import { skipToken, useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/Services/api/users";
import { useDebounce } from "@/Hooks/use-debounce";
import { EditProjectContext } from "@/Contexts/Project/edit-project-context";
import { User } from "@/types";
import { Button } from "@/Components/ui/button";
import { InputError } from "@/Components/ui/input-error";
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
import { Skeleton } from "@/Components/ui/skeleton";
import { FormProps } from "@/Components/Stepper";
import { Heading } from "@/Components/ui/heading";
import { LoaderCircle, Plus, TriangleAlert, X } from "lucide-react";
import Avatar from "@/Components/Avatar";
import { deepKeys } from "@/Libs/Validation/utils";
import { useToast } from "@/Components/ui/use-toast";
import { useUser } from "@/Hooks/use-user";
import { Kbd } from "@/Components/ui/kbd";
import { useEventListener } from "@/Hooks/use-event-listener";

interface SearchMemberProps {
    addMember: (user: User) => void;
    removeMember: (user: Partial<User>) => void;
}

const MemberForm = ({ prev, next }: FormProps) => {
    const { data, setData, errors, processing, validate, clearErrors } =
        React.useContext(EditProjectContext);

    const { toast } = useToast();

    const addMember = (user: User) => {
        if (!data.members.some((member) => member.uuid == user.uuid)) {
            setData((data) => {
                data.members.push(user);
                return { ...data };
            });
        }
    };

    const removeMember = (user: Partial<User>) => {
        setData((data) => {
            const members = data.members;
            const idx = members.findIndex(
                (member) => member.uuid === user.uuid
            );
            members.splice(idx, 1);
            return { ...data, members };
        });
    };

    const goNext = () => {
        if (!data.members.length) {
            toast({
                header: (
                    <div className="inline-flex items-center gap-2 text-red-600 dark:text-red-500">
                        <TriangleAlert className="h-6 w-6" />
                        <Heading level={6} className="text-base font-medium">
                            Erreur
                        </Heading>
                    </div>
                ),
                description: (
                    <p className="text-base">Vous devez ajouter des members</p>
                ),
            });
            return;
        }

        const fields = "members," + deepKeys(data.members, "members").join(",");
        validate(fields, {
            onSuccess: () => {
                clearErrors("members");
                next();
            },
        });
    };

    return (
        <div className="space-y-8">
            <Heading level={6}>Ajouter les membres du projet</Heading>

            <SearchMembers addMember={addMember} removeMember={removeMember} />

            <InputError message={errors.members} />

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

const SearchMembers = ({ addMember, removeMember }: SearchMemberProps) => {
    const { uuid } = useUser();
    const { members } = React.useContext(EditProjectContext).data;
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
                <CommandList className="max-h-none">
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
                    {!!members.length && (
                        <CommandGroup className="p-0">
                            {members.map((member, idx) => (
                                <CommandItem
                                    key={idx}
                                    value={member.uuid}
                                    className="py-2.5 grid sm:grid-cols-3 grid-cols-2 gap-4"
                                >
                                    <div className="inline-flex items-center space-x-2">
                                        <Avatar size="sm" name={member.name} />
                                        <div className="">{member.name}</div>
                                    </div>
                                    <div className="hidden sm:block">
                                        {member.email}
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            variant="destructive"
                                            className="justify-between items-center"
                                            onClick={() => removeMember(member)}
                                            disabled={uuid === member.uuid}
                                        >
                                            Supprimer
                                            <X className="h-4 w-4 ml-2" />
                                        </Button>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </CommandList>
            </Command>
        </div>
    );
};

export default MemberForm;
