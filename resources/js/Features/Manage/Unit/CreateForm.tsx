import React from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { FormWrapper } from "@/Components/ui/form";
import { Label } from "@/Components/ui/label";
import { Input, InputError } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";

// export interface UnitForm {
//     name: string;
//     abbr: string;
//     description: string;
//     address: string;
//     divisions: DivisionForm[];
//     infrastructures: InfrastructureForm[];
// }

// export interface DivisionForm {
//     name: string;
//     abbr: string;
//     description: string;
//     members: MemberForm[];
//     valid?: true;
// }

// export interface MemberForm extends User {
//     grade: string;
// }

// export interface InfrastructureForm {
//     name: string;
//     state: string;
//     description: string;
//     valid?: boolean;
// }

// export const CreateUnitContext = React.createContext<{
//     data: UnitForm;
//     errors: Partial<Record<keyof UnitForm | string, string>>;
//     processing: boolean;
//     setData: any;
//     clearErrors: (...fields: (keyof UnitForm)[]) => void;
// }>({
//     data: {
//         name: "",
//         description: "",
//         abbr: "",
//         address: "",
//         divisions: [],
//         infrastructures: [],
//     },
//     errors: {},
//     setData: () => {},
//     clearErrors: () => {},
//     processing: false,
// });

const CreateForm = () => {
    const { data, setData, errors, processing, post, clearErrors } =
        useForm({
            name: "",
            abbr: "",
            description: "",
            address: "",
            divisions: [],
            infrastructures: [],
        });

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("manage.unit.store", {}), {
            preserveScroll: true,
        });
    };

    return (
        <FormWrapper className="space-y-4 md:space-y-8" onSubmit={submitHandler}>
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1 col-span-2">
                    <Label>Nom de l'unité</Label>
                    <Input
                        onChange={(e) => {
                            clearErrors("name");
                            setData("name", e.target.value);
                        }}
                        value={data.name}
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-1 col-span-1">
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
                    <Label>Adresse</Label>
                    <Input
                        value={data.address}
                        onChange={(e) => {
                            clearErrors("address");
                            setData("address", e.target.value);
                        }}
                    />
                    <InputError message={errors.address} />
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
            </div>
            <Button className="w-full">
                Créer
            </Button>
        </FormWrapper>
    );
};

export default CreateForm;
