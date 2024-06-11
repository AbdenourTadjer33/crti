import React from "react";
import { Input } from "@/Components/ui/input";
import { format } from "date-fns";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { CalendarIcon, Check, ChevronDown } from "lucide-react";
import { FieldType, FormFieldProps } from "@/Libs/FormBuilder/core/field";
import { CellContext } from "@tanstack/react-table";
import { Button } from "@/Components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandHeader,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";
import { cn } from "@/Utils/utils";
import { capitalize } from "@/Utils/helper";

interface EditableTableCellProps<T extends FieldType>
    extends CellContext<any, any> {
    field: FormFieldProps<T>;
}

function EditableTableCell<T extends FieldType>({
    getValue,
    row,
    column,
    table,
    field,
}: EditableTableCellProps<T>) {
    const initialValue = getValue();

    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const updater = () => {
        table.updateData(row.index, column.id, value);
    };

    switch (field.type) {
        case "number":
        case "text":
            return (
                <Input
                    type={field.type ?? "text"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={updater}
                    className="min-w-52"
                />
            );
        case "textarea":
            return (
                <Textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={updater}
                    className="min-h-12 min-w-52"
                />
            );
        case "list":
            return (
                <Select
                    value={value}
                    onValueChange={(value) => {
                        setValue(value);
                    }}
                    onOpenChange={(open) => {
                        if (!open) {
                            updater();
                        }
                        return open;
                    }}
                >
                    <SelectTrigger className="min-w-52">
                        <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {field.placeholder && (
                                <SelectLabel className="pl-2">
                                    {field.placeholder}
                                </SelectLabel>
                            )}
                            {field.options?.map((option, idx) => {
                                if (typeof option === "string") {
                                    return (
                                        <SelectItem
                                            key={idx}
                                            value={option}
                                            children={option}
                                        />
                                    );
                                }
                                return (
                                    <SelectItem key={idx} value={option.value}>
                                        {option.label ?? option.value}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            );
        case "day":
            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="min-w-52 justify-between w-full"
                        >
                            {!value
                                ? "select date"
                                : format(value, "dd-MM-yyyy")}

                            <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" onBlur={updater}>
                        <Calendar
                            mode="single"
                            selected={value}
                            onSelect={(value) => setValue(value)}
                        />
                    </PopoverContent>
                </Popover>
            );
        case "combobox":
            const [search, setSearch] = React.useState("");

            const Label: React.FC = () => {
                const { options, placeholder, many } = field;

                if (!value || (Array.isArray(value) && value.length === 0)) {
                    return <>{placeholder ?? "select"}</>;
                }

                if (typeof options[0] === "string") {
                    return <>{value}</>;
                }

                const selectedOptions = (
                    options as { label: string; value: string }[]
                )
                    .filter((option) =>
                        many
                            ? (value as string[]).includes(option.value)
                            : option.value === value
                    )
                    .map((option) => option.label)
                    .join(", ");

                return <>{selectedOptions}</>;
            };

            const selectHandler = (selected: string) => {
                if (!field.many) {
                    setValue(selected);
                    return;
                }

                const selectedValues = [...value];

                if (selectedValues.includes(selected)) {
                    selectedValues.splice(selectedValues.indexOf(selected), 1);
                } else {
                    selectedValues.push(selected);
                }

                setValue(selectedValues);
            };

            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="min-w-52 justify-between w-full"
                        >
                            <Label />
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" onBlur={updater}>
                        <Command loop>
                            <CommandHeader>
                                <CommandInput
                                    value={search}
                                    onValueChange={setSearch}
                                    placeholder="rechercher ..."
                                />
                            </CommandHeader>
                            <CommandList>
                                <CommandEmpty>no data found</CommandEmpty>
                                <CommandGroup>
                                    {field.options.map((option, idx) => (
                                        <CommandItem
                                            key={idx}
                                            value={
                                                typeof option == "string"
                                                    ? option
                                                    : option.value
                                            }
                                            onSelect={selectHandler}
                                        >
                                            <Check
                                                className="mr-2 h-4 w-4 data-[checked=false]:opacity-0"
                                                data-checked={
                                                    field.many
                                                        ? value.includes(
                                                              typeof option ==
                                                                  "string"
                                                                  ? option
                                                                  : option.value
                                                          )
                                                        : typeof option ==
                                                          "string"
                                                        ? value == option
                                                        : value == option.value
                                                }
                                            />
                                            {capitalize(
                                                typeof option === "string"
                                                    ? option
                                                    : option.label
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            );
    }
}

export { EditableTableCell };
