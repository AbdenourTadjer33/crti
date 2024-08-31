import SearchInput from "@/Components/common/search-input";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { Button, buttonVariants } from "@/Components/ui/button";
import * as Card  from "@/Components/ui/card";
import { Progress } from "@/Components/ui/infinate-progress";
import { Text } from "@/Components/ui/paragraph";
import { useDebounce } from "@/Hooks/use-debounce";
import { searchUsers } from "@/Services/api/users";
import { getInitials } from "@/Utils/helper";
import { cn } from "@/Utils/utils";
import { skipToken, useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import React from "react";

const SearchUsers: React.FC<any> = ({ addMember }) => {
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
                        Rechercher et ajouter les membres à la division. Vous
                        pouvez rechercher les membres par leur nom ou leur
                        adresse e-mail.
                    </Text>
                )}
            </Card.CardContent>
        </Card.Card>
    );
};

export default SearchUsers;
