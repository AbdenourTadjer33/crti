import * as React from "react";
import { FormWrapper } from "@/Components/ui/form";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { InputError } from "@/Components/ui/input-error";
import { Board, User } from "@/types";
import {  useQuery } from "@tanstack/react-query";
import * as Card from "@/Components/ui/card";
import { format, isBefore, startOfToday } from "date-fns";
import { useUpdateEffect } from "@/Hooks/use-update-effect";
import UserAvatar from "@/Components/common/user-hover-avatar";
import { DateRange } from "react-day-picker";
import { SearchProjects, SearchUsers } from "./CreateForm";
import * as  Select from "@/Components/ui/select";
import { Calendar } from "@/Components/ui/calendar";
import { X } from "lucide-react";
import { Link, router, useForm } from "@inertiajs/react";


function prepareData(data: any) {
    const formData: any = { ...data };

    if (formData.judgment_period.from) {
        formData.judgment_period.from = format(
            formData.judgment_period.from,
            "yyyy-MM-dd"
        );
    }

    if (formData.judgment_period.to) {
        formData.judgment_period.to = format(
            formData.judgment_period.to,
            "yyyy-MM-dd"
        );
    }

    return formData;
}

const EditForm: React.FC<any> = ({ board }) => {
    const { data: boardData, isLoading } = useQuery({
        queryKey: ["board-details", board],
        queryFn: () => getBoardDetails(board),
    });
    const { data, setData, errors, processing, clearErrors, reset, setError } =
        useForm({
            judgment_period: { from: board.judgment_period.from, to: board.judgment_period.to } || { from: undefined, to: undefined },
            project: board.project.code || "mi94pwcdca",
            president: board.president.uuid || "",
            members: board.users || [],
        });


    React.useEffect(() => {
        if (boardData) {
            setData(prepareData(boardData));
        }
    }, [boardData]);

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

        router.put(route("manage.board.update", board.code), prepareData(data), {
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
                    <SearchProjects selectedProject={data.project} />
                    <InputError message={errors["project"]} />
                </div>
                <div className="space-y-1">
                    <Label required>Periode de jugement</Label>
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
                                                    membres de consiel tout
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
            <pre>{JSON.stringify(data, null ,2)}</pre>
        </FormWrapper>
    )
}

export default EditForm;
    function getBoardDetails(board: Board): any {
        throw new Error("Function not implemented.");
    }
