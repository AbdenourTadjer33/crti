import React from "react";
import * as Popover from "@/Components/ui/popover";
import * as Command from "@/Components/ui/command";
import { useUpdateEffect } from "@/Hooks/use-update-effect";
import { addProjectDomain } from "@/Services/api/helper_data";
import { Button, buttonVariants } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { capitalize } from "@/Utils/helper";

interface DomainFieldProps extends React.HTMLAttributes<HTMLButtonElement> {
    values: string[];
    setValues: (values: string[]) => void;
    domains: undefined | { id: number; name: string; suggested: boolean }[];
}

const DomainField: React.FC<DomainFieldProps> = ({
    values,
    setValues,
    domains,
    ...props
}) => {
    const [data, setData] = React.useState(domains);
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const label = React.useMemo(
        () =>
            values
                .map((value) => data?.find((d) => String(d.id) === value)?.name)
                .join(", "),
        [values]
    );

    const mainDomains = React.useMemo(
        () => data?.filter((d) => !d.suggested),
        [data]
    );
    const suggestedDomains = React.useMemo(
        () => data?.filter((d) => d.suggested),
        [data]
    );

    const addNewItem = async () => {
        const item = search.trim();
        const response = await addProjectDomain(item);

        if (
            (response?.status === 200 || response?.status === 201) &&
            response?.data
        ) {
            setData((prev) => {
                return [...prev!, response.data];
            });

            router.reload({ only: ["domains"] });
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
                    {...props}
                >
                    <div className="w-full truncate text-start">
                        {!values.length
                            ? "Sélectionner les domaines de projet"
                            : label}
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
                            {mainDomains &&
                                mainDomains.map((domain, idx) => (
                                    <Command.CommandItem
                                        key={idx}
                                        value={String(domain.id)}
                                        onSelect={() => {
                                            const selected = [...values];

                                            if (
                                                values.includes(
                                                    String(domain.id)
                                                )
                                            ) {
                                                selected.splice(
                                                    selected.indexOf(
                                                        String(domain.id)
                                                    ),
                                                    1
                                                );
                                            } else {
                                                selected.push(
                                                    String(domain.id)
                                                );
                                            }

                                            setValues(selected);
                                        }}
                                    >
                                        <Check
                                            className={
                                                "mr-2 h-4 w-4 data-[checked=false]:opacity-0"
                                            }
                                            data-checked={values?.includes(
                                                String(domain.id)
                                            )}
                                        />
                                        {domain.name}
                                    </Command.CommandItem>
                                ))}
                        </Command.CommandGroup>
                        {!!suggestedDomains?.length && (
                            <Command.CommandGroup heading="Domaine suggére">
                                {suggestedDomains &&
                                    suggestedDomains.map((domain, idx) => (
                                        <Command.CommandItem
                                            key={idx}
                                            value={String(domain.id)}
                                            onSelect={() => {
                                                const selected = [...values];

                                                if (
                                                    values.includes(
                                                        String(domain.id)
                                                    )
                                                ) {
                                                    selected.splice(
                                                        selected.indexOf(
                                                            String(domain.id)
                                                        ),
                                                        1
                                                    );
                                                } else {
                                                    selected.push(
                                                        String(domain.id)
                                                    );
                                                }

                                                setValues(selected);
                                            }}
                                        >
                                            <Check
                                                className={
                                                    "mr-2 h-4 w-4 data-[checked=false]:opacity-0"
                                                }
                                                data-checked={values?.includes(
                                                    String(domain.id)
                                                )}
                                            />
                                            {domain.name}
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

export default DomainField;
