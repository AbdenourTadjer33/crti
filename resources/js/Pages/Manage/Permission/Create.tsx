import React from "react";
import { useForm } from "@inertiajs/react";
import { Input, InputError } from "@/Components/ui/input";

const Create: React.FC = () => {
    const { data, setData, errors, clearErrors, processing } = useForm({
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
            />

            <pre className="my-4">
                {JSON.stringify(
                    {
                        data,
                        errors,
                        processing,
                    },
                    null,
                    2
                )}
            </pre>
        </div>
    );
};

export default Create;
