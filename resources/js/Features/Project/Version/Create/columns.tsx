import React from "react";
import { Checkbox } from "@/Components/ui/checkbox";
import { createColumnHelper } from "@tanstack/react-table";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CreateProjectContext } from "@/Contexts/Project/create-project-context";
import { TaskForm } from "@/types/form";
import { Button, buttonVariants } from "@/Components/ui/button";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarIcon, Check, ChevronDown, Edit, X } from "lucide-react";
import { deepKeys, isAnyKeyBeginWith } from "@/Libs/Validation/utils";
import { cn } from "@/Utils/utils";
import { Note } from "@/Components/Note";
import { Input } from "@/Components/ui/input";
import { Calendar } from "@/Components/ui/calendar";
import Avatar from "@/Components/Avatar";
import * as Popover from "@/Components/ui/popover";
import * as Command from "@/Components/ui/command";
import * as Select from "@/Components/ui/select";
import * as Tooltip from "@/Components/ui/tooltip";
import * as Dropdown from "@/Components/ui/dropdown-menu";

const columnHelper = createColumnHelper<TaskForm>();

export const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({ table }) => (
            <div className="flex items-center gap-3">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                />

                <Dropdown.DropdownMenu>
                    <Dropdown.DropdownMenuTrigger>
                        <MdKeyboardArrowDown className="w-4 h-4" />
                    </Dropdown.DropdownMenuTrigger>
                    <Dropdown.DropdownMenuContent>
                        <Dropdown.DropdownMenuItem>
                            Tous séléctionner
                        </Dropdown.DropdownMenuItem>
                        <Dropdown.DropdownMenuItem>
                            Tous supprimer
                        </Dropdown.DropdownMenuItem>
                    </Dropdown.DropdownMenuContent>
                </Dropdown.DropdownMenu>
            </div>
        ),
        cell: ({ row }) => {
            return (
                <div className="group">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="row selecter"
                        className="hidden group-hover:block data-[state=checked]:block"
                    />

                    <div
                        className="group-hover:hidden data-[state=true]:hidden"
                        data-state={row.getIsSelected()}
                    >
                        {row.index + 1}
                    </div>
                </div>
            );
        },
    }),

    columnHelper.accessor("name", {
        header: "tâche",
        cell: ({ table, row, column, getValue }) => {
            const { errors } = React.useContext(CreateProjectContext);
            const isAnyError = isAnyKeyBeginWith(
                errors,
                `tasks.${row.index}.name`
            );

            if (!row.getIsOnEditMode()) {
                return getValue();
            }

            return (
                <Input
                    value={getValue()}
                    onChange={(e) =>
                        table.updateData(
                            row.index,
                            column.id as keyof TaskForm,
                            e.target.value
                        )
                    }
                    className="w-full min-w-[20rem] max-w-sm"
                />
            );
        },
    }),

    columnHelper.accessor("description", {
        header: "description",
        cell: ({ table, row, column, getValue }) => {
            const { errors } = React.useContext(CreateProjectContext);
            const isError = isAnyKeyBeginWith(
                errors,
                `tasks.${row.index}.description`
            );

            return (
                <Note
                    id={row.id}
                    title={row.original.name}
                    trigger={({ isOpen }) => {
                        return (
                            <Tooltip.TooltipProvider>
                                <Tooltip.Tooltip>
                                    <Tooltip.TooltipTrigger asChild>
                                        <div
                                            className={cn(
                                                "transition-all duration-150 bg-yellow-200 data-[open=true]:bg-yellow-300 data-[error=true]:border data-[error=true]:border-red-500 hover:opacity-75 hover:scale-110 h-10 w-10 rounded shadow "
                                            )}
                                            data-open={isOpen}
                                            data-error={isError}
                                        ></div>
                                    </Tooltip.TooltipTrigger>
                                    <Tooltip.TooltipContent>
                                        {!isOpen
                                            ? "Ouvrir le block de description"
                                            : "Fermer le block de description"}
                                    </Tooltip.TooltipContent>
                                </Tooltip.Tooltip>
                            </Tooltip.TooltipProvider>
                        );
                    }}
                    value={getValue()}
                    onValueChange={(value) => {
                        table.updateData(
                            row.index,
                            column.id as keyof TaskForm,
                            value
                        );
                    }}
                />
            );
        },
    }),

    columnHelper.accessor("timeline", {
        header: "echancier",
        cell: ({ table, row, column, getValue }) => {
            const { errors, data } = React.useContext(CreateProjectContext);
            const isError = isAnyKeyBeginWith(
                errors,
                `tasks.${row.index}.timeline`
            );

            if (!row.getIsOnEditMode()) {
                return `De ${format(getValue().from!, "dd/MM/yyy")} à ${format(
                    getValue().to!,
                    "dd/MM/yyy"
                )}`;
            }

            return (
                <Popover.Popover>
                    <Popover.PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full min-w-[15rem] max-w-xs justify-between pr-0"
                        >
                            <div className="w-full truncate text-start">
                                {!getValue() ||
                                (!getValue()?.from && !getValue()?.to)
                                    ? "Date début/fin"
                                    : getValue().from && !getValue().to
                                    ? `De ${format(
                                          getValue().from!,
                                          "dd/MM/yyy"
                                      )}`
                                    : getValue().from &&
                                      getValue().to &&
                                      `De ${format(
                                          getValue().from!,
                                          "dd/MM/yyy"
                                      )} à ${format(
                                          getValue().to!,
                                          "dd/MM/yyy"
                                      )}`}
                            </div>
                            <div
                                className={buttonVariants({
                                    variant: "ghost",
                                    size: "sm",
                                })}
                            >
                                <CalendarIcon className="shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </div>
                        </Button>
                    </Popover.PopoverTrigger>
                    <Popover.PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="range"
                            showOutsideDays={false}
                            selected={getValue()}
                            onSelect={(range) => {
                                table.updateData(
                                    row.index,
                                    column.id as keyof TaskForm,
                                    range
                                );
                            }}
                            disabled={{
                                before: data?.timeline?.from!,
                                after: data?.timeline?.to!,
                            }}
                            defaultMonth={
                                getValue()?.from || data?.timeline?.from
                            }
                        />
                    </Popover.PopoverContent>
                </Popover.Popover>
            );
        },
    }),

    columnHelper.accessor("users", {
        header: "assigné à",
        cell: ({ table, row, column, getValue }) => {
            const { errors, data } = React.useContext(CreateProjectContext);
            const members = React.useMemo(() => data.members, [data.members]);
            const uuids = React.useMemo(() => getValue(), [getValue()]);
            const selectedMembers = React.useMemo(
                () => members.filter((m) => uuids.includes(m.uuid)),
                [members, uuids]
            );
            const isError = isAnyKeyBeginWith(
                errors,
                `tasks.${row.index}.users`
            );

            if (!row.getIsOnEditMode()) {
                return (
                    <div className="flex items-center -space-x-1.5">
                        {selectedMembers.map((member, idx) => (
                            <Tooltip.TooltipProvider key={idx}>
                                <Tooltip.Tooltip>
                                    <Tooltip.TooltipTrigger
                                        className={cn(
                                            `-translate-x-${idx * 1}`
                                        )}
                                    >
                                        <Avatar name={member.name} size="sm" />
                                    </Tooltip.TooltipTrigger>
                                    <Tooltip.TooltipContent asChild>
                                        <div className="flex flex-col">
                                            <div>{member.uuid}</div>
                                            <div>{member.name}</div>
                                            <div>{member.email}</div>
                                        </div>
                                    </Tooltip.TooltipContent>
                                </Tooltip.Tooltip>
                            </Tooltip.TooltipProvider>
                        ))}
                    </div>
                );
            }

            return (
                <Popover.Popover>
                    <Popover.PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full min-w-[24rem] max-w-sm justify-between pr-0"
                        >
                            <div className="w-full truncate text-start">
                                {uuids.length
                                    ? selectedMembers
                                          .map((m) => m.name)
                                          .join(", ")
                                    : "Sélectionner les members pour cette tâche"}
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
                                <Command.CommandInput placeholder="Rechercher" />
                            </Command.CommandHeader>
                            <Command.CommandList>
                                <Command.CommandEmpty className="p-4">
                                    No results found.
                                </Command.CommandEmpty>

                                <Command.CommandGroup>
                                    {members &&
                                        members.map((member, idx) => (
                                            <Command.CommandItem
                                                key={idx}
                                                value={member.uuid}
                                                onSelect={(uuid) => {
                                                    const selectedUuids = [
                                                        ...uuids,
                                                    ];
                                                    if (
                                                        selectedUuids.includes(
                                                            uuid
                                                        )
                                                    ) {
                                                        selectedUuids.splice(
                                                            selectedUuids.indexOf(
                                                                uuid
                                                            ),
                                                            1
                                                        );
                                                    } else {
                                                        selectedUuids.push(
                                                            uuid
                                                        );
                                                    }
                                                    table.updateData(
                                                        row.index,
                                                        column.id as keyof TaskForm,
                                                        selectedUuids
                                                    );
                                                }}
                                            >
                                                <Check
                                                    className={
                                                        "mr-2 h-4 w-4 data-[checked=false]:opacity-0"
                                                    }
                                                    data-checked={uuids?.includes(
                                                        member.uuid
                                                    )}
                                                />
                                                {member.name}
                                            </Command.CommandItem>
                                        ))}
                                </Command.CommandGroup>
                            </Command.CommandList>
                        </Command.Command>
                    </Popover.PopoverContent>
                </Popover.Popover>
            );
        },
    }),

    columnHelper.accessor("priority", {
        header: "priorité",
        cell: ({ table, row, column, getValue }) => {
            const { errors } = React.useContext(CreateProjectContext);
            const isError = isAnyKeyBeginWith(
                errors,
                `tasks.${row.index}.priority`
            );

            if (!row.getIsOnEditMode()) {
                return getValue();
            }

            return (
                <Select.Select
                    value={getValue()}
                    onValueChange={(value) =>
                        table.updateData(
                            row.index,
                            column.id as keyof TaskForm,
                            value
                        )
                    }
                >
                    <Select.SelectTrigger className="min-w-[15rem]">
                        {getValue()
                            ? getValue()
                            : "Sélectionner priorité de la tâche"}
                    </Select.SelectTrigger>
                    <Select.SelectContent>
                        <Select.SelectGroup>
                            <Select.SelectItem value="Basse">
                                Basse
                            </Select.SelectItem>
                            <Select.SelectItem value="Moyenne">
                                Moyenne
                            </Select.SelectItem>
                            <Select.SelectItem value="Haute">
                                Haute
                            </Select.SelectItem>
                        </Select.SelectGroup>
                    </Select.SelectContent>
                </Select.Select>
            );
        },
    }),

    columnHelper.display({
        id: "update-row",
        cell: ({ row, table }) => {
            const { validate, clearErrors } =
                React.useContext(CreateProjectContext);
            const { data, setData } = table.options;
            const fields = React.useMemo(
                () => deepKeys(row.original, `tasks.${row.index}`),
                []
            );

            const removeRow = () => {
                const oldData = [...data];
                const { toggleEditMode, removeRow } = row;

                removeRow();
                // @ts-ignore
                clearErrors(...fields);
                toggleEditMode(false);
                toast.success("Tâche supprimé", {
                    action: {
                        label: "Annuler",
                        onClick: () => {
                            if (setData) {
                                setData(oldData);
                            }
                        },
                    },
                });
            };

            const validateRow = () => {
                validate(fields.join(","), {
                    onSuccess: () => {
                        // @ts-ignore
                        clearErrors(...fields);
                        row.toggleEditMode(false);
                    },
                });
            };

            return (
                <div className="flex items-center justify-end gap-2">
                    {row.getIsOnEditMode() ? (
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8"
                            onClick={validateRow}
                        >
                            <Check className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                                row.toggleEditMode(true);
                            }}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                    )}

                    <Button
                        variant="destructive"
                        onClick={removeRow}
                        size="icon"
                        className="w-8 h-8"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            );
        },
    }),
];
