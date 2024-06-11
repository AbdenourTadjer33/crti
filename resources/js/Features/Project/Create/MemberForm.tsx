import React, { useState } from "react";
import { Button } from "@/Components/ui/button";
import { CreateProjectContext } from "./Form";
import { Input, InputError } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandHeader,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import { useDebounce } from "@/Hooks/use-debounce";
import { searchUsers } from "@/Services/api/users";
import { skipToken, useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import { Spinner } from "@/Components/ui/spinner";
import { Skeleton } from "@/Components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";

const MemberForm = () => {
    const { data, setData, errors } = React.useContext(CreateProjectContext);
    return (
        <div>
            <div className="space-y-2">
                <Label className="flex items-center justify-between">
                    Rechercher et ajouter les membres du projet
                    <AddExterneMember />
                </Label>
                <SearchMemebers
                    addMember={(user: User) => {
                        if (
                            !data.members.some(
                                (member) => member.uuid === user.uuid
                            )
                        ) {
                            setData((data) => {
                                data.members.push(user);
                                return { ...data };
                            });
                        }
                    }}
                />
            </div>

            <div>
                {data.members.map((member) => (
                    <div key={member.uuid}>{member.uuid}</div>
                ))}
            </div>
        </div>
    );
};

const SearchMemebers = ({ addMember }: { addMember: (user: User) => void }) => {
    const [search, setSearch] = React.useState("");
    const debouncedValue = useDebounce(search, 300);

    const { data, isFetching, isLoading, isError } = useQuery({
        queryKey: ["search-users", debouncedValue],
        queryFn: debouncedValue
            ? async () => searchUsers(debouncedValue)
            : skipToken,
    });

    return (
        <div className="rounded-lg border dark:border-gray-500">
            <Command loop shouldFilter={false}>
                <CommandHeader>
                    <CommandInput
                        value={search}
                        onValueChange={setSearch}
                        placeholder="Commencez à taper pour rechercher des membres de l'équipe..."
                        autoFocus
                    />
                    {isFetching && <Spinner />}
                </CommandHeader>
                <CommandList>
                    <CommandEmpty className="py-4">
                        {!search ? (
                            <div className="text-gray-800 font-medium text-lg">
                                Commencez à taper pour rechercher des membres de
                                l'équipe...
                            </div>
                        ) : isLoading || isFetching ? (
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
                            <>error</>
                        ) : (
                            <>No result found</>
                        )}
                    </CommandEmpty>
                    <CommandGroup>
                        {data &&
                            data.map((user) => (
                                <CommandItem
                                    key={user.uuid}
                                    value={user.uuid}
                                    className="py-2.5 grid grid-cols-3 gap-4"
                                >
                                    <span>{user.name}</span>
                                    <span>{user.email}</span>
                                    <span
                                        className="text-center hover:underline hover:underline-offset-2 cursor-pointer"
                                        onClick={() => addMember(user)}
                                    >
                                        Ajouter
                                    </span>
                                </CommandItem>
                            ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </div>
    );
};

const AddExterneMember = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Ajouter un member externe</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Ajouter un member externe</DialogTitle>
                </DialogHeader>

                <ExterneMemberForm />
            </DialogContent>
        </Dialog>
    );
};

const ExterneMemberForm = () => {
    const { data, setData } = React.useContext(CreateProjectContext);
    React.useEffect(() => {
        console.log("mount");

        return () => {
            console.log("unmount");
        };
    });
    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <Label>Prénom</Label>
                <Input />
                <InputError />
            </div>
            <div className="space-y-1">
                <Label>Nom</Label>
                <Input />
                <InputError />
            </div>
            <div className="col-span-2">
                <Label>Adresse e-mail</Label>
                <Input />
                <InputError />
            </div>

            <Button className="col-span-2">Ajouté</Button>
        </div>
    );
};

export default MemberForm;
