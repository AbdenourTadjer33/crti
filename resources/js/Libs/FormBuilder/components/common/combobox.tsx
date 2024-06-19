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
import { Button } from "@/Components/ui/button";
import { OnValueChange, OnValuesChange } from "../../core/field";

interface CommonCombobox extends React.HTMLAttributes<HTMLElement> {
    options: string[] | { label: string; value: string }[];
    components?: any;
    placeholders?: any;
    search?: string;
    setSearch?: React.Dispatch<React.SetStateAction<string>>;
}

interface SingleSelectProps extends CommonCombobox {
    many?: false;
    value?: string;
    onValueChange?: OnValueChange;
}

interface MultiSelectProps extends CommonCombobox {
    many?: true;
    value?: string[];
    onValueChange?: OnValuesChange;
}

type ComboboxProps = SingleSelectProps | MultiSelectProps;

const SingleCombobox: React.FC<SingleSelectProps> = ({
    value,
    onValueChange,
    options,
    search,
    setSearch,
}) => {
    const selectHandler = (selected: string) => {
        if (onValueChange) {
            onValueChange(selected);
            return;
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="justify-between gap-4 w-full"
                >
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Command loop>
                    <CommandHeader>
                        <CommandInput
                            value={search}
                            onValueChange={setSearch}
                            placeholder="rechercher..."
                        />
                    </CommandHeader>
                    <CommandList>
                        <CommandEmpty>No data found</CommandEmpty>
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
                                        {itemLabel}

                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4 data-[checked=false]:opacity-0"
                                            )}
                                            data-checked={itemValue === value}
                                        />
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
}) => {
    const selectHandler = (selected: string) => {
        if (value && onValueChange) {
            const selectedValues = [...value];

            if (selectedValues.includes(selected)) {
                selectedValues.splice(selectedValues.indexOf(selected), 1);
            } else {
                selectedValues.push(selected);
            }

            onValueChange(selectedValues);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="justify-between gap-4 w-full"
                >
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Command loop>
                    <CommandHeader>
                        <CommandInput
                            value={search}
                            onValueChange={setSearch}
                            placeholder="rechercher..."
                        />
                    </CommandHeader>
                    <CommandList>
                        <CommandEmpty>No data found</CommandEmpty>
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
                                        {itemLabel}

                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4 data-[checked=false]:opacity-0"
                                            )}
                                            data-checked={value?.includes(
                                                itemValue
                                            )}
                                        />
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

const Combobox: React.FC<ComboboxProps> = ({ many = false, ...props }) => {
    if (many) {
        return <MultipleCombobox {...(props as MultiSelectProps)} />;
    }

    return <SingleCombobox {...(props as SingleSelectProps)} />;
};

export {
    type ComboboxProps,
    Combobox
};