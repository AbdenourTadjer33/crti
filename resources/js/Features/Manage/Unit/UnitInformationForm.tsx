import * as React from "react";
import { Label } from "@/Components/ui/label";
import { Input, InputError } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { CreateUnitContext } from "@/Features/Manage/Unit/CreateForm";

const UnitInformationForm = () => {
    const { data, errors, setData, clearErrors } =
        React.useContext(CreateUnitContext);

    return (
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
    );
};

export { UnitInformationForm };
