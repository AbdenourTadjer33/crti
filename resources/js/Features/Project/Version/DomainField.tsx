import React from "react";
import * as Popover from "@/Components/ui/popover";
import * as Command from "@/Components/ui/command";
import { useUpdateEffect } from "@/Hooks/use-update-effect";
import { addProjectDomain } from "@/Services/api/helper_data";
import { Button, buttonVariants } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { Check, ChevronDown, LoaderCircle, Plus } from "lucide-react";
import { capitalize } from "@/Utils/helper";
import { cn } from "@/Utils/utils";

interface DomainFieldProps {
    values: string[];
    setValues: (values: string[]) => void;
    domains: undefined | string[];
}

const DomainField: React.FC<DomainFieldProps> = ({
    values,
    setValues,
    domains,
}) => {
    const [data, setData] = React.useState(domains);
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const addNewItem = async () => {
        const item = search.trim();
        const response = await addProjectDomain(item);

        if (response?.status === 201) {
            setData((prev) => {
                return [...(prev as []), item];
            });
            return;
        }

        if (response?.status === 422) {
            alert(response.data.message);
        }
    };

    useUpdateEffect(() => setData(domains), [domains]);

    return (
        <Popover.Popover open={open} onOpenChange={setOpen}>
            <Popover.PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-between pr-0"
                    onClick={() => {
                        if (!domains) {
                            router.reload({
                                only: ["domains"],
                                onStart: () => setLoading(true),
                                onFinish: () => setLoading(false),
                            });
                        }
                    }}
                >
                    <div className="w-full truncate text-start">
                        {values.length
                            ? values.join(", ")
                            : "Sélectionner les domaines de projet"}
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
                <Command.Command loop>
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
                        {loading ? (
                            <Command.CommandLoading className="flex items-center justify-center gap-2">
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                Chargement...
                            </Command.CommandLoading>
                        ) : (
                            <Command.CommandEmpty className="p-4">
                                {!search ? (
                                    "No results found."
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
                        )}

                        <Command.CommandGroup>
                            {data &&
                                data.map((domain, idx) => (
                                    <Command.CommandItem
                                        key={idx}
                                        value={domain}
                                        onSelect={() => {
                                            const selected = [...values];

                                            if (values.includes(domain)) {
                                                selected.splice(
                                                    selected.indexOf(domain),
                                                    1
                                                );
                                            } else {
                                                selected.push(domain);
                                            }

                                            setValues(selected);
                                        }}
                                    >
                                        <Check
                                            className={
                                                "mr-2 h-4 w-4 data-[checked=false]:opacity-0"
                                            }
                                            data-checked={values?.includes(
                                                domain
                                            )}
                                        />
                                        {domain}
                                    </Command.CommandItem>
                                ))}
                        </Command.CommandGroup>
                    </Command.CommandList>
                </Command.Command>
            </Popover.PopoverContent>
        </Popover.Popover>
    );
};

export default DomainField;