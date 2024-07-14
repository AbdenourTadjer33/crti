import React from "react";
import { CalendarProps } from "../components/common/calendar";
import { ComboboxProps } from "../components/common/combobox";
import { InputProps } from "../components/common/input";
import { TextareaProps } from "../components/common/textarea";


export type OnValueChange = (value: string) => void;
export type OnValuesChange = (values: string[]) => void;

export type Fields = {
    text: InputProps;
    number: InputProps;
    textarea: TextareaProps;
    combobox: ComboboxProps;
    calendar: CalendarProps;
    // list: any;
    // checkbox: any;
}

export type FieldType = keyof Fields;

interface BaseField {
    type: FieldType;
}

type TextField = BaseField & { type: "text" } & Fields["text"];
type NumberField = BaseField & { type: "number" } & Fields["number"];
type TextareaField = BaseField & { type: "textarea" } & Fields["textarea"];
type ComboboxField = BaseField & { type: "combobox" } & Fields["combobox"];
type CalendarField = BaseField & { type: "calendar" } & Fields["calendar"];

export type Field = TextField | NumberField | TextareaField | ComboboxField | CalendarField;


// export interface FieldBase {
// placeholder?: string;
// value?: string;
// onValueChange?: (updateFn: React.SetStateAction<string>) => void;
// }
// 
// export interface BaseFormField extends FieldBase {
// type: Exclude<FieldType, 'list' | 'combobox'>;
// }
// 
// export interface FormField extends FieldBase {
// type: Extract<FieldType, 'list' | 'combobox'>;
// options: string[] | { label: React.ReactNode; value: string }[];
// many?: boolean;
// }
// 
// export type FormFieldProps<T extends FieldType> = T extends 'list' | 'combobox' ? FormField : BaseFormField;

