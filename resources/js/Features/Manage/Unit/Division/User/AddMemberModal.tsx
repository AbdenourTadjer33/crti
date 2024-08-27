import Avatar from "@/Components/Avatar";
import { Button } from "@/Components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandHeader, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/Components/ui/command";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Kbd } from "@/Components/ui/kbd";
import { Skeleton } from "@/Components/ui/skeleton";
import { useDebounce } from "@/Hooks/use-debounce";
import { useEventListener } from "@/Hooks/use-event-listener";
import { searchUsers } from "@/Services/api/users";
import { User } from "@/types";
import { skipToken, useQuery } from "@tanstack/react-query";
import { LoaderCircle, Plus, X } from "lucide-react";
import React from "react";

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    members: User[];
    addMember: (user: User) => void;
    removeMember: (uuid: string) => void;
}

interface SearchMemberProps {
    members: User[];
    addMember: (user: User) => void;
    removeMember: (uuid: string) => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
    isOpen,
    onClose,
    members,
    addMember,
    removeMember,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter un membre</DialogTitle>
                    <DialogClose asChild>
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            aria-label="Close"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </DialogClose>
                </DialogHeader>
                <SearchMembers
                    members={members}
                    addMember={addMember}
                    removeMember={removeMember}
                />
                <DialogFooter>
                    <Button type="button" onClick={onClose}>
                        Fermer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const SearchMembers = ({
    addMember,
    members,
    removeMember,
}: SearchMemberProps) => {
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

export default AddMemberModal;
