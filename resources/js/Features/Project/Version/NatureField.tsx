import React from "react";
import * as Popover from "@/Components/ui/popover";
import * as Command from "@/Components/ui/command";
import { useUpdateEffect } from "@/Hooks/use-update-effect";
import { addProjectNature } from "@/Services/api/helper_data";
import { Button, buttonVariants } from "@/Components/ui/button";
import { Check, ChevronDown, Plus } from "lucide-react";
import { capitalize } from "@/Utils/helper";
import { cn } from "@/Utils/utils";
import { router } from "@inertiajs/react";

interface NatureFieldProps extends React.HTMLAttributes<HTMLButtonElement> {
    value: string;
    setValue: (value: string) => void;
    natures: undefined | { id: number; name: string; suggested: boolean }[];
}

const NatureField: React.FC<NatureFieldProps> = ({
    value,
    setValue,
    natures,
    ...props
}) => {
    const [data, setData] = React.useState(natures);
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    
    const label = React.useMemo(
        () => data?.find((n) => String(n.id) === value)?.name,
        [value]
    );
    const mainNatures = React.useMemo(
        () => data?.filter((n) => !n.suggested),
        [data]
    );
    const suggestedNatures = React.useMemo(
        () => data?.filter((n) => n.suggested),
        [data]
    );

    const addNewItem = async () => {
        const item = search.trim();
        const response = await addProjectNature(item);

        if (
            (response?.status === 200 || response?.status === 201) &&
            response.data
        ) {
            setData((prev) => {
                return [...prev!, response.data];
            });

            router.reload({ only: ["natures"] });

            setValue(String(response.data.id));
            setSearch("");
        }

        if (response?.status === 422) {
            alert(response.data.message);
        }
    };

    useUpdateEffect(() => setData(natures), [natures]);

    return (
        <Popover.Popover open={open} onOpenChange={setOpen}>
            <Popover.PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-between pr-0"
                    {...props}
                >
                    <div className="w-full truncate text-start">
                        {!value ? "Sélectionner la nature de projet" : label}
                    </div>

                    <div
                        className={buttonVariants({
                            variant: "ghost",
                            size: "sm",
                        })}
                    >
                        <ChevronDown className="shrink-0 h-4 w-4" />
                    </div>
                </Button>
            </Popover.PopoverTrigger>
            <Popover.PopoverContent className="w-auto p-0">
                <Command.Command
                    loop
                    filter={(value, search) => {
                        return data
                            ?.find((v) => String(v.id) === value)
                            ?.name.includes(search)
                            ? 1
                            : 0;
                    }}
                >
                    <Command.CommandHeader>
                        <Command.CommandInput
                            value={search}
                            onValueChange={(search) =>
                                setSearch(capitalize(search))
                            }
                            placeholder="Rechercher ou Ajouter..."
                        />
                        <div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={addNewItem}
                            >
                                <Plus className="shrink-0 h-5 w-5" />
                            </Button>
                        </div>
                    </Command.CommandHeader>
                    <Command.CommandList>
                        <Command.CommandEmpty className="p-4">
                            {!search ? (
                                "Aucun Résultat Trouvé."
                            ) : (
                                <Button
                                    variant="ghost"
                                    className="text-sm gap-1"
                                    onClick={addNewItem}
                                >
                                    Ajouter{" "}
                                    <span className="font-medium">
                                        {search}
                                    </span>
                                </Button>
                            )}
                        </Command.CommandEmpty>
                        <Command.CommandGroup>
                            {mainNatures &&
                                mainNatures.map((nature) => (
                                    <Command.CommandItem
                                        key={nature.id}
                                        value={String(nature.id)}
                                        onSelect={(currentValue) => {
                                            const newValue =
                                                currentValue === value
                                                    ? ""
                                                    : currentValue;
                                            setValue(newValue);

                                            if (newValue) {
                                                setOpen(false);
                                                setSearch("");
                                            }
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === String(nature.id)
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {nature.name}
                                    </Command.CommandItem>
                                ))}
                        </Command.CommandGroup>

                        {!!suggestedNatures?.length && (
                            <Command.CommandGroup heading="Natures suggére">
                                {suggestedNatures &&
                                    suggestedNatures.map((nature) => (
                                        <Command.CommandItem
                                            key={nature.id}
                                            value={String(nature.id)}
                                            onSelect={(currentValue) => {
                                                const newValue =
                                                    currentValue === value
                                                        ? ""
                                                        : currentValue;
                                                setValue(newValue);

                                                if (newValue) {
                                                    setOpen(false);
                                                    setSearch("");
                                                }
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === String(nature.id)
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {nature.name}
                                        </Command.CommandItem>
                                    ))}
                            </Command.CommandGroup>
                        )}
                    </Command.CommandList>
                </Command.Command>
            </Popover.PopoverContent>
        </Popover.Popover>
    );
};

export default NatureField;
