import React from "react";
import { Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { FormWrapper } from "@/Components/ui/form";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import { Textarea } from "@/Components/ui/textarea";
import { User } from "@/types";
import * as Card from "@/Components/ui/card";
import MemberList from "./MemberList";
import SearchUsers from "./SearchUsers";

const CreateForm: React.FC<any> = ({ unit, grades }) => {
    const { data, setData, errors, processing, post, clearErrors } = useForm<{
        name: string;
        abbr: string;
        description: string;
        members: { uuid: string; name: string; email: string; grade: string }[];
        webpage: string;
    }>({
        name: "",
        abbr: "",
        description: "",
        members: [],
        webpage: "",
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
                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label required>Nom de la division</Label>
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
                    <Label required>Abréviation</Label>
                    <Input
                        value={data.abbr}
                        onChange={(e) => {
                            clearErrors("abbr");
                            setData("abbr", e.target.value);
                        }}
                    />
                    <InputError message={errors.abbr} />
                </div>

                <div className="space-y-1 sm:col-span-1 col-span-3">
                    <Label>Page web</Label>
                    <Input
                        value={data.webpage}
                        onChange={(e) => {
                            clearErrors("webpage");
                            setData("webpage", e.target.value);
                        }}
                    />
                    <InputError message={errors.webpage} />
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
                    <Label>Ajouter les members de la division</Label>
                    <div className="flex md:flex-row flex-col justify-between items-start lg:gap-10 md:gap-5 gap-0">
                        <SearchUsers
                            members={data.members}
                            addMember={addMember}
                        />
                        <Card.Card className="flex-1 w-full md:rounded-t-lg rounded-t-none">
                            <Card.CardHeader>
                                <Card.CardTitle>
                                    Membres de la division
                                </Card.CardTitle>
                            </Card.CardHeader>
                            <Card.CardContent className="grid gap-6 ">
                                {data.members.map((member, idx) => (
                                    <MemberList
                                        key={idx}
                                        idx={idx}
                                        errors={errors}
                                        member={member}
                                        removeMember={() =>
                                            removeMember(member.uuid)
                                        }
                                        setGrade={(grade) =>
                                            setData((data) => {
                                                data.members[idx].grade = grade;
                                                return { ...data };
                                            })
                                        }
                                        grades={grades}
                                    />
                                ))}
                                <InputError message={errors["members"]} />
                            </Card.CardContent>
                        </Card.Card>
                    </div>
                </div>
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
                <Button variant="primary" className="w-full">
                    Créer
                </Button>
            </div>
        </FormWrapper>
    );
};





export default CreateForm;
