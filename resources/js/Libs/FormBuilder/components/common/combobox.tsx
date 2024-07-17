import * as React from "react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandHeader,
    CommandInput,
    CommandList,
    CommandItem,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/Utils/utils";
import { Button, buttonVariants } from "@/Components/ui/button";
import { OnValueChange, OnValuesChange } from "../../core/field";

interface Option {
    label: string;
    value: string;
}

interface placeholders {
    trigger?: string;
}

type ClassNames = {
    trigger?: string;
    content?: string;
};

interface CommonCombobox extends React.HTMLAttributes<HTMLElement> {
    options: Option[] | string[];
    components?: any;
    placeholders?: placeholders;
    search?: string;
    setSearch?: React.Dispatch<React.SetStateAction<string>>;
    classNames?: ClassNames;
    empty?: (search: string) => React.ReactNode;
}

interface SingleSelectProps extends CommonCombobox {
    multiple?: false;
    value?: string;
    onValueChange?: OnValueChange;
    trigger?: (value?: string) => React.ReactNode;
    labels?: {
        trigger?: ((value: string) => React.ReactNode) | React.ReactNode;
    };
}

interface MultiSelectProps extends CommonCombobox {
    multiple?: true;
    value?: string[];
    onValueChange?: OnValuesChange;
    trigger?: (value?: string[]) => React.ReactNode;
    labels?: {
        trigger?: ((value: string[]) => React.ReactNode) | React.ReactNode;
    };
}

type ComboboxProps = SingleSelectProps | MultiSelectProps;

const SingleCombobox: React.FC<SingleSelectProps> = ({
    value,
    onValueChange,
    options,
    search,
    setSearch,
    trigger,
    classNames,
    empty,
}) => {
    const [open, setOpen] = React.useState(false);
    const [_search, _setSearch] = React.useState("");

    const selectHandler = (selected: string) => {
        if (onValueChange) {
            onValueChange(selected);
            setOpen(false);
            return;
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full justify-between gap-4 relative overflow-hidden",
                    classNames?.trigger
                )}
            >
                {trigger ? trigger(value) : value ? value : "select"}

                <div
                    className={cn(
                        buttonVariants({ size: "sm", variant: "ghost" }),
                        "absolute top-1/2 -translate-y-1/2 right-0"
                    )}
                >
                    <ChevronDown className="h-4 w-4" />
                </div>
            </PopoverTrigger>
            <PopoverContent className={cn("w-auto p-0", classNames?.content)}>
                <Command loop>
                    <CommandHeader>
                        <CommandInput
                            value={search ?? _search}
                            onValueChange={setSearch ?? _setSearch}
                            placeholder="rechercher..."
                        />
                    </CommandHeader>
                    <CommandList>
                        <CommandEmpty>
                            {empty
                                ? empty(search ?? _search)
                                : "no result found"}
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option, idx) => {
                                const itemLabel =
                                    typeof option === "string"
                                        ? option
                                        : option.label;
                                const itemValue =
                                    typeof option === "string"
                                        ? option
                                        : option.value;

                                return (
                                    <CommandItem
                                        key={idx}
                                        value={itemValue}
                                        onSelect={selectHandler}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4 data-[checked=false]:opacity-0"
                                            )}
                                            data-checked={itemValue === value}
                                        />
                                        {itemLabel}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

const MultipleCombobox: React.FC<MultiSelectProps> = ({
    value,
    onValueChange,
    options,
    search,
    setSearch,
    classNames,
    trigger,
    empty,
}) => {
    const [_search, _setSearch] = React.useState("");
    const selectHandler = (selectedValue: string) => {
        if (value && onValueChange) {
            const selectedValues = [...value];

            if (selectedValues.includes(selectedValue)) {
                selectedValues.splice(selectedValues.indexOf(selectedValue), 1);
            } else {
                selectedValues.push(selectedValue);
            }

            onValueChange(selectedValues);
        }
    };

    return (
        <Popover>
            <PopoverTrigger
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full justify-between gap-4 relative overflow-hidden",
                    classNames?.trigger
                )}
            >
                {trigger
                    ? trigger(value)
                    : value?.length
                    ? value.join(",")
                    : "select"}
                <div
                    className={cn(
                        buttonVariants({ size: "sm", variant: "ghost" }),
                        "absolute top-1/2 -translate-y-1/2 right-0"
                    )}
                >
                    <ChevronDown className="h-4 w-4" />
                </div>
            </PopoverTrigger>
            <PopoverContent className={cn("w-auto p-0", classNames?.content)}>
                <Command loop>
                    <CommandHeader>
                        <CommandInput
                            value={search ?? _search}
                            onValueChange={setSearch ?? _setSearch}
                            placeholder="rechercher..."
                        />
                    </CommandHeader>
                    <CommandList>
                        <CommandEmpty>
                            {empty
                                ? empty(search ?? _search)
                                : "no result found"}
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option, idx) => {
                                const itemLabel =
                                    typeof option === "string"
                                        ? option
                                        : option.label;
                                const itemValue =
                                    typeof option === "string"
                                        ? option
                                        : option.value;

                                return (
                                    <CommandItem
                                        key={idx}
                                        value={itemLabel}
                                        onSelect={() =>
                                            selectHandler(itemValue)
                                        }
                                    >
                                        <Check
                                            className={
                                                "mr-2 h-4 w-4 data-[checked=false]:opacity-0"
                                            }
                                            data-checked={value?.includes(
                                                itemValue
                                            )}
                                        />
                                        {itemLabel}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

const Combobox: React.FC<ComboboxProps> = ({ multiple = false, ...props }) => {
    if (multiple) {
        return <MultipleCombobox {...(props as MultiSelectProps)} />;
    }

    return <SingleCombobox {...(props as SingleSelectProps)} />;
};

export { type ComboboxProps, Combobox };
