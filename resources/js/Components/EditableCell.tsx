import React from "react";
import * as TanstackTable from "@tanstack/react-table";
import Field from "@/Libs/FormBuilder/components/Field";
import { Field as FieldType } from "@/Libs/FormBuilder/core/field";

type EditableCellProps = TanstackTable.CellContext<any, any> &
    FieldType & {
        display?: React.ReactNode;
    };

const EditableCell: React.FC<EditableCellProps> = ({
    cell,
    column,
    getValue,
    renderValue,
    row,
    table,
    display,
    ...props
}) => {
    const initialValue = getValue();

    const [value, setValue] = React.useState(initialValue);

    const updater = () => {
        table.updateData(row.index, column.id, value);
    };

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
        updater();
    }, [value]);

    if (row.getIsOnEditMode()) {
        return (
            <Field
                {...props}
                value={value}
                onValueChange={(value: any) => setValue(value)}
            />
        );
    }

    return display ? display : getValue();
};

export { type EditableCellProps, EditableCell };
