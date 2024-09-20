import React from "react";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { User } from "@/types";
import { useDebounce } from "@/Hooks/use-debounce";
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
} from "@/Components/ui/command";
import { cn } from "@/Utils/utils";
import { useForm } from "@inertiajs/react";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { getInitials } from "@/Utils/helper";
import { Dot, X } from "lucide-react";
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectContent,
    SelectValue,
} from "@/Components/ui/select";
import { InputError } from "@/Components/ui/input-error";
import { toast } from "sonner";

interface AddMemberModalProps {
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SearchMemberProps {
    members: User[];
    addMember: (user: User) => void;
    removeMember: (uuid: string) => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
    open,
    onOpenChange,
    grades,
    users,
}) => {
    const { data, setData, post, processing, errors, setError, reset } =
        useForm({
            users: [],
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const endpoint = route("manage.unit.division.attach.users", {
            unit: route().params.unit,
            division: route().params.division,
        });

        if (!data.users.length) {
            setError(
                "users",
                "Vous devez ajouter des utilisateurs avant de soumettre le formulaire "
            );
            return;
        }

        post(endpoint, {
            preserveState: true,
            onSuccess: () => {
                onOpenChange(false);
                setData("users", []);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                onFocusOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
                className="space-y-4 max-w-screen-md h-full min-h-[30rem] max-h-[80vh]"
            >
                <DialogHeader>
                    <DialogTitle>Ajouter des members</DialogTitle>
                    <DialogDescription>
                        Rechercher et ajouter les membres à la division. Vous
                        pouvez rechercher les membres par leur nom ou leur
                        adresse e-mail.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <SearchUsers
                        addUser={(user) => {
                            if (data.users.find((u) => u.uuid === user.uuid)) {
                                toast.error(
                                    "Vous avez déja sélectionner cet utilisateur!"
                                );
                                return;
                            }

                            if (users.find((u) => u.uuid === user.uuid)) {
                                toast.error(
                                    "Cet utilisateur est déja dans cette division"
                                );
                                return;
                            }

                            setData((data) => {
                                data.users.push({ ...user, grade: "" });

                                return { ...data };
                            });
                        }}
                    />
                </div>
                <div className="max-h-80 min-h-60 overflow-auto p-1 divide-y">
                    {data.users.map((user, idx) => (
                        <div key={idx} className="p-2 flex gap-4">
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
                            <div className="ml-auto flex items-center gap-2">
                                <div>
                                    <Select
                                        value={user.grade}
                                        onValueChange={(value) =>
                                            setData((data) => {
                                                data.users[idx].grade = value;
                                                return { ...data };
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-full max-w-xs min-w-[20rem]">
                                            <SelectValue placeholder="Sélectionner un grade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {grades &&
                                                grades?.map((grade, idx) => (
                                                    <SelectItem
                                                        key={idx}
                                                        value={String(
                                                            grade?.id
                                                        )}
                                                    >
                                                        {grade?.name}
                                                    </SelectItem>
                                                ))}
                                        </SelectContent>
                                    </Select>

                                    <InputError
                                        message={errors[`users.${idx}.grade`]}
                                    />
                                </div>

                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                        setData((data) => {
                                            data.users.splice(idx, 1);
                                            return { ...data };
                                        });
                                    }}
                                >
                                    <X className="h-4 w-4 shrink-0" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={submit}>
                    {errors.users && (
                        <InputError message={errors.users} className="mb-2" />
                    )}

                    <DialogFooter className="sm:gap-0 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                        >
                            Fermer
                        </Button>
                        <Button variant="primary" disabled={processing}>
                            Sauvgarder
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const SearchUsers: React.FC<any> = ({ addUser }) => {
    const [search, setSearch] = React.useState("");
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
    });

    return (
        <div className="space-y-2 relative">
            <Command loop shouldFilter={false}>
                <CommandHeader className="border rounded-md">
                    <CommandInput
                        value={search}
                        onValueChange={setSearch}
                        placeholder="Rechercher..."
                    />
                </CommandHeader>

                <CommandList
                    className={cn(
                        !search.length ? "hidden" : "",
                        "bg-white shadow-lg absolute top-full left-0 right-0 z-10"
                    )}
                >
                    {users?.length && (
                        <CommandEmpty>No results found.</CommandEmpty>
                    )}
                    <CommandGroup className="z-50 max-h-40 overflow-auto">
                        {users?.map((user, idx) => (
                            <CommandItem
                                key={idx}
                                onSelect={() => {
                                    addUser(user);
                                    setSearch("");
                                }}
                                className="space-x-2"
                            >
                                <Avatar className="h-8 w-8 text-xs">
                                    <AvatarFallback>
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{user.name}</span>
                                <Dot className="h-4 w-4" />
                                <span className="font-medium">
                                    {user.email}
                                </span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        </div>
    );
};

export default AddMemberModal;
