type Field = "text" | "number" | "textarea" | "list" | "combobox" | "day";

type FieldOptions = string[] | { label: string; value: string }[];

interface BaseFormFieldProps {
    type: Exclude<Field, 'list' | 'combobox'>;
    name?: string;
}

interface ListFormFieldProps {
    type: Extract<Field, 'list' | 'combobox'>
    options: FieldOptions;
    many: boolean;
}

type FormFieldProps<T extends Field> = T extends "list" | "combobox" ? ListFormFieldProps : BaseFormFieldProps;

function FormField<T extends Field>(props: FormFieldProps<T>) { }