import React from "react";
import * as Card from "@/Components/ui/card";
import SearchInput from "@/Components/common/search-input";
import { skipToken, useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/Services/api/users";
import { useDebounce } from "@/Hooks/use-debounce";
import { User } from "@/types";
import { Button, buttonVariants } from "@/Components/ui/button";
import { StepperContentProps } from "@/Components/ui/stepper";
import { X, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { getInitials } from "@/Utils/helper";
import { cn } from "@/Utils/utils";
import { Progress } from "@/Components/ui/infinate-progress";
import { Text } from "@/Components/ui/paragraph";
import { deepKeys } from "@/Libs/Validation/utils";
import { EditProjectContext } from "@/Contexts/Project/edit-project-context";
import { InputError } from "@/Components/ui/input-error";
import { useUpdateEffect } from "@/Hooks/use-update-effect";

const MemberForm = ({
    prev,
    next,
    markStepAsError,
    markStepAsSuccess,
    clearStepError,
}: StepperContentProps) => {
    const {
        data,
        setData,
        errors,
        processing,
        validate,
        clearErrors,
        setError,
    } = React.useContext(EditProjectContext);

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
        const fields = "members," + deepKeys(data.members, "members").join(",");
        validate(fields, {
            onSuccess() {
                fields.split(",").map((field) => clearErrors(field));
                clearStepError();
                markStepAsSuccess();
                next();
            },
            onError(errors) {
                markStepAsError();
                setError(errors);
            },
        });
    };

    useUpdateEffect(() => {
        if (!data.tasks.length) return;

        const tasks = data.tasks.map((task) => {
            const users = task.users.filter((uuid) =>
                data.members.some((m) => m.uuid === uuid)
            );

            return { ...task, users };
        });

        setData("tasks", tasks);
    }, [JSON.stringify(data.members)]);

    return (
        <>
            <SearchMembers addMember={addMember} removeMember={removeMember} />
            <InputError message={errors["members"]} />

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
        </>
    );
};

const SearchMembers: React.FC<any> = ({ addMember, removeMember }) => {
    const { data } = React.useContext(EditProjectContext);
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

            <Card.Card className="flex-1 w-full md:rounded-t-lg rounded-t-none">
                <Card.CardHeader>
                    <Card.CardTitle>Membres de l'équipe</Card.CardTitle>
                    <Card.CardDescription>
                        Invitez les membres de votre équipe à collaborer.{" "}
                    </Card.CardDescription>
                </Card.CardHeader>
                <Card.CardContent className="grid gap-6">
                    {data.members.map((member) => (
                        <div
                            key={member.uuid}
                            className="flex items-center justify-between space-x-4"
                        >
                            <div className="flex items-center space-x-4">
                                <Avatar>
                                    <AvatarFallback>
                                        {getInitials(member.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium leading-none">
                                        {member.name}{" "}
                                        {member.uuid === data.creator?.uuid && (
                                            <span className="font-semibold">
                                                (Porteur de projet)
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
                                onClick={() => removeMember(member)}
                                disabled={member.uuid === data.creator?.uuid}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    ))}
                </Card.CardContent>
            </Card.Card>
        </div>
    );
};

export default MemberForm;
