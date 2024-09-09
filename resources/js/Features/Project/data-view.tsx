import React from "react";
import ProjectCard from "./ProjectCard";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { CheckIcon, LayoutGrid, List, PlusCircle, X } from "lucide-react";
import * as ToggleGroup from "@/Components/ui/toggle-group";
import * as Popover from "@/Components/ui/popover";
import * as Command from "@/Components/ui/command";
import { cn } from "@/Utils/utils";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { useDebounce } from "@/Hooks/use-debounce";
import { useUpdateEffect } from "@/Hooks/use-update-effect";
import { router } from "@inertiajs/react";
import { useLocalStorage } from "@/Hooks/use-local-storage";
import * as DropdownMenu from "@/Components/ui/dropdown-menu";

const status = [
    { value: "new", label: "Nouveau projet" },
    { value: "review", label: "En examen" },
    { value: "pending", label: "En instance" },
    { value: "suspended", label: "Suspendu" },
    { value: "rejected", label: "Rejeté" },
    { value: "completed", label: "Achevé" },
];

const sortOptions = [
    { value: "by_activity", label: "Trier par activité" },
    { value: "by_creation_date", label: "Trier par date de création" },
    { value: "by_name", label: "Trier par nom" },
];

const DataView: React.FC<any> = ({ projects }) => {
    const [mode, setMode] = useLocalStorage<string>("projects-mode", "grid");
    const [selectedStatus, setSelectedStatus] = React.useState<string[]>([]);
    const [sort, setSort] = React.useState<string>("by_activity");

    const debounce = useDebounce(
        JSON.stringify({
            status: selectedStatus,
            sort,
        }),
        500
    );

    useUpdateEffect(() => {
        router.get(
            route("project.index"),
            { status: selectedStatus, sort },
            {
                only: ["projects"],
                preserveScroll: true,
                preserveState: true,
            }
        );
    }, [debounce]);
    return (
        <div className="md:space-y-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-2">
                    <Input
                        placeholder="Filtrer les projects..."
                        className="w-[150px] lg:w-[250px]"
                    />

                    <Popover.Popover>
                        <Popover.PopoverTrigger asChild>
                            <Button variant="outline" className="border-dashed">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Status
                                {selectedStatus?.length > 0 && (
                                    <>
                                        <Separator
                                            orientation="vertical"
                                            className="mx-2 h-4"
                                        />
                                        <Badge className="rounded-sm px-1 font-normal lg:hidden">
                                            {selectedStatus.length}
                                        </Badge>
                                        <div className="hidden space-x-1 lg:flex">
                                            {selectedStatus.length > 2 ? (
                                                <Badge className="rounded-sm px-1 font-normal">
                                                    {selectedStatus.length}{" "}
                                                    Sélectionnez
                                                </Badge>
                                            ) : (
                                                status
                                                    .filter((option) =>
                                                        selectedStatus.includes(
                                                            option.value
                                                        )
                                                    )
                                                    .map((option) => (
                                                        <Badge
                                                            key={option.value}
                                                            className="rounded-sm px-1 font-normal"
                                                        >
                                                            {option.label}
                                                        </Badge>
                                                    ))
                                            )}
                                        </div>
                                    </>
                                )}
                            </Button>
                        </Popover.PopoverTrigger>
                        <Popover.PopoverContent
                            className="w-[200px] p-0"
                            align="start"
                        >
                            <Command.Command>
                                <Command.CommandHeader>
                                    <Command.CommandInput placeholder="Status" />
                                </Command.CommandHeader>
                                <Command.CommandList>
                                    <Command.CommandEmpty>
                                        Aucun résultat trouvé.
                                    </Command.CommandEmpty>
                                    <Command.CommandGroup>
                                        {status.map((option) => {
                                            const index =
                                                selectedStatus.findIndex(
                                                    (s) => s === option.value
                                                );
                                            const isSelected = index !== -1;
                                            return (
                                                <Command.CommandItem
                                                    key={option.value}
                                                    onSelect={() => {
                                                        if (isSelected) {
                                                            setSelectedStatus(
                                                                (selected) => {
                                                                    selected.splice(
                                                                        index,
                                                                        1
                                                                    );
                                                                    return [
                                                                        ...selected,
                                                                    ];
                                                                }
                                                            );
                                                        } else {
                                                            setSelectedStatus(
                                                                (selected) => {
                                                                    selected.push(
                                                                        option.value
                                                                    );
                                                                    return [
                                                                        ...selected,
                                                                    ];
                                                                }
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <div
                                                        className={cn(
                                                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                            isSelected
                                                                ? "bg-primary text-primary-foreground"
                                                                : "opacity-50 [&_svg]:invisible"
                                                        )}
                                                    >
                                                        <CheckIcon
                                                            className={cn(
                                                                "h-4 w-4"
                                                            )}
                                                        />
                                                    </div>
                                                    <span>{option.label}</span>
                                                </Command.CommandItem>
                                            );
                                        })}
                                    </Command.CommandGroup>
                                    {selectedStatus.length > 0 && (
                                        <>
                                            <Command.CommandSeparator />
                                            <Command.CommandGroup>
                                                <Command.CommandItem
                                                    onSelect={() =>
                                                        setSelectedStatus([])
                                                    }
                                                    className="justify-center text-center"
                                                >
                                                    Effacer les filtres
                                                </Command.CommandItem>
                                            </Command.CommandGroup>
                                        </>
                                    )}
                                </Command.CommandList>
                            </Command.Command>
                        </Popover.PopoverContent>
                    </Popover.Popover>

                    {selectedStatus.length > 0 && (
                        <Button
                            variant="ghost"
                            className="hover:bg-gray-200/70 px-2 lg:px-3"
                            onClick={() => setSelectedStatus([])}
                        >
                            Réinitialiser
                            <X className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="flex items-stretch gap-2">
                    <DropdownMenu.DropdownMenu>
                        <DropdownMenu.DropdownMenuTrigger asChild>
                            <Button
                                className="h-11 border-none"
                                variant="outline"
                            >
                                {sortOptions.find((s) => s.value === sort)
                                    ?.label ?? "Trier par"}
                            </Button>
                        </DropdownMenu.DropdownMenuTrigger>
                        <DropdownMenu.DropdownMenuContent
                            onCloseAutoFocus={(e) => e.preventDefault()}
                        >
                            {sortOptions.map((option, idx) => (
                                <DropdownMenu.DropdownMenuItem
                                    key={idx}
                                    onClick={() => {
                                        setSort(option.value);
                                    }}
                                >
                                    {option.label}
                                </DropdownMenu.DropdownMenuItem>
                            ))}
                        </DropdownMenu.DropdownMenuContent>
                    </DropdownMenu.DropdownMenu>

                    <ToggleGroup.ToggleGroup
                        type="single"
                        className="hidden md:block rounded p-0.5 bg-white"
                        value={mode}
                        onValueChange={(value) => setMode(value)}
                    >
                        <ToggleGroup.ToggleGroupItem value="grid">
                            <LayoutGrid className="h-5 w-5 " />
                        </ToggleGroup.ToggleGroupItem>
                        <ToggleGroup.ToggleGroupItem value="list">
                            <List className="h-5 w-5 " />
                        </ToggleGroup.ToggleGroupItem>
                    </ToggleGroup.ToggleGroup>
                </div>
            </div>

            <ul
                className="flex data-[display=list]:flex-col data-[display=grid]:flex-row *:w-full md:data-[display=grid]:*:max-w-sm flex-wrap gap-2"
                data-display={mode}
            >
                {projects.map((project, idx) => (
                    <li key={idx} data-display={mode}>
                        <ProjectCard project={project} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DataView;
