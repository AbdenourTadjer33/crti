import { Input, InputError } from "@/Components/ui/input";
import { useForm } from "@/Libs/useForm";

import React from "react";

const Create: React.FC = () => {
    const {
        data,
        setData,
        validate,
        errors,
        clearErrors,
        processing,
        validating,
    } = useForm(route("manage.unit.store"), "post", {
        name: "",
        description: "",
    });

    return (
        <div className="max-w-screen-sm mx-auto my-20">
            <Input
                onChange={(e) => {
                    setData("name", e.target.value);
                    clearErrors("name");
                }}
                value={data.name}
                onBlur={(e) => validate("name")}
            />

            <pre className="my-4">
                {JSON.stringify(
                    {
                        data,
                        errors,
                        processing,
                        validating,
                    },
                    null,
                    2
                )}
            </pre>
        </div>
    );
};

export default Create;
