import * as React from "react";
import { FormWrapper } from "@/Components/ui/form";
import { Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import { Textarea } from "@/Components/ui/textarea";
import * as Card from "@/Components/ui/card";
import SearchUsers from "./SearchUsers";
import MemberList from "./MemberList";
import { Member } from "@/types/member";


const EditForm: React.FC<any> = ({ unit, division, grades }) => {
    const { data, setData, errors, processing, put, clearErrors } = useForm({
        name: division.name || "",
        abbr: division.abbr || "",
        description: division.description || "",
        webpage: division.webpage || "",
        members:
            division.users.map((user: any) => ({
                uuid: user.uuid,
                name: `${user.first_name} ${user.last_name}`,
                grade: user.pivot.division_grade_id,
            })) || [],
    });

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        put(
            route("manage.unit.division.update", {
                unit: unit.id,
                division: division.id,
            }),
            {
                preserveScroll: true,
            }
        );
    };

    const addMember = (user: Member) => {
        if (!data.members.some((member: Member) => member.uuid == user.uuid)) {
            setData((data) => {
                data.members.push({ ...user, grade: "" });
                return { ...data };
            });
        }
    };

    const removeMember = (uuid: string) => {
        setData((data) => {
            const members = data.members;
            const idx = members.findIndex(
                (member: any) => member.uuid === uuid
            );
            members.splice(idx, 1);
            return { ...data, members };
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
                    Sauvgarder
                </Button>
            </div>
        </FormWrapper>
    );
};

export default EditForm;
