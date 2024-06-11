import * as React from "react";
import { FieldType, FormFieldProps } from "./core/field";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";

export default function Field<T extends FieldType>(
    props: FormFieldProps<T>
) {
    switch (props.type) {
        case "text" || "number":
            return <Input type={props.type} value={props?.value} />;
        case "textarea":
            return <Textarea />;
        case "list":
            return <>{JSON.stringify(props.options)}</>;
        default:
            throw new Error(`Unsupported field type: ${props.type}`);
    }
}

export const TestApp = () => {
    return (    
        <>
            <Field type="text" />
        </>
    );
};
