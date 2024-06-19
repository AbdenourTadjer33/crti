import * as React from "react";
import { Fields, Field as FieldType } from "../core/field";
import { Input } from "./common/input";
import { Textarea } from "./common/textarea";
import { Combobox } from "./common/combobox";

const fields: Partial<Record<keyof Fields, React.ComponentType<any>>> = {
    text: Input,
    number: Input,
    textarea: Textarea,
    combobox: Combobox,
};

const Field: React.FC<FieldType> = ({ type = "text", ...props }) => {
    const Component = fields[type];

    if (!Component) {
        throw Error("handle the error");
    }

    return <Component {...props} />;
};
