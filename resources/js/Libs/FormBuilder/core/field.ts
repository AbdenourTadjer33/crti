import React from "react";
import FormField from "../component";

export type FieldType = "text" | "number" | "textarea" | "list" | "combobox" | "day";

type ClassNames = Partial<Record<FieldType, string>>;

export interface FieldBase {
    classNames?: ClassNames;
    components?: Partial<Record<FieldType, React.ReactElement>>;
    placeholder?: string;
}

export interface BaseFormField extends FieldBase {
    type: Exclude<FieldType, 'list' | 'combobox'>;
    value?: string;
    onValueChange?: (updateFn: React.SetStateAction<string>) => void;
}

export interface FormField extends FieldBase {
    type: Extract<FieldType, 'list' | 'combobox'>;
    options: string[] | { label: string; value: string }[];
    many?: boolean;
    value?: string | string[];
    onValueChange?: (updateFn: React.SetStateAction<string>) => void;
}

export type FormFieldProps<T extends FieldType> = T extends 'list' | 'combobox' ? FormField : BaseFormField;
