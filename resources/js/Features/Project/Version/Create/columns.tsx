import React from "react";
import { Checkbox } from "@/Components/ui/checkbox";
import { createColumnHelper } from "@tanstack/react-table";
import { MdKeyboardArrowDown } from "react-icons/md";
import { CreateProjectContext } from "@/Contexts/Project/create-project-context";
import { TaskForm } from "@/types/form";
import { Button } from "@/Components/ui/button";
import { Check, Edit, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { deepKeys, isAnyKeyBeginWith } from "@/Libs/Validation/utils";
import * as Tooltip from "@/Components/ui/tooltip";
import * as Dropdown from "@/Components/ui/dropdown-menu";
import Avatar from "@/Components/Avatar";
import { cn } from "@/Utils/utils";
import { Note } from "@/Components/Note";
import { EditableCell } from "@/Components/EditableCell";

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
        cell: (cell) => {
            const { errors } = React.useContext(CreateProjectContext);
            const isAnyError = isAnyKeyBeginWith(
                errors,
                `tasks.${cell.row.index}.name`
            );

            return (
                <EditableCell
                    type="text"
                    className={cn(isAnyError ? "border-red-500" : "")}
                    {...cell}
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
        cell: (cell) => {
            const { errors } = React.useContext(CreateProjectContext);
            const isError = isAnyKeyBeginWith(
                errors,
                `tasks.${cell.row.index}.timeline`
            );

            return (
                <EditableCell
                    type="calendar"
                    mode="range"
                    showOutsideDays={false}
                    className={isError ? "border-red-500" : ""}
                    labels={{
                        trigger: (value) => {
                            if (!value?.from && !value?.to) {
                                return "Date début/fin";
                            }

                            if (value?.from && !value?.to) {
                                return `De ${format(value.from, "dd/MM/yyy")}`;
                            }

                            return `De ${format(
                                value.from,
                                "dd/MM/yyy"
                            )} à ${format(value.to, "dd/MM/yyy")}`;
                        },
                    }}
                    display={
                        cell.getValue()?.from && cell.getValue()?.to ? (
                            <>
                                De {format(cell.getValue().from!, "dd/MM/yyy")}{" "}
                                à {format(cell.getValue().to!, "dd/MM/yyy")}
                            </>
                        ) : (
                            ""
                        )
                    }
                    {...cell}
                />
            );
        },
    }),

    columnHelper.accessor("users", {
        header: "assigné à",
        cell: (cell) => {
            const { errors, data } = React.useContext(CreateProjectContext);
            const { members } = data;
            const isError = isAnyKeyBeginWith(
                errors,
                `tasks.${cell.row.index}.users`
            );

            const Display = () => {
                const data = members.filter((member) =>
                    cell.getValue().includes(member.uuid)
                );

                return (
                    <div className="flex items-center">
                        {data.map((member, idx) => (
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
            };

            return (
                <EditableCell
                    type="combobox"
                    multiple={true}
                    options={members.map((member) => {
                        return { label: member.name, value: member.uuid };
                    })}
                    className={isError ? "border-red-500" : ""}
                    labels={{
                        trigger: (value) => {
                            const selected: string[] = members
                                .filter((member) => value.includes(member.uuid))
                                .map((member) => member.name);

                            if (!selected.length) {
                                return "Members";
                            }

                            if (selected.length === 1) {
                                return selected[0];
                            }

                            return `${selected[0]} et ${
                                selected.length - 1
                            } autre${selected.length - 1 > 1 ? "s" : ""}`;
                        },
                    }}
                    display={<Display />}
                    {...cell}
                />
            );
        },
    }),

    columnHelper.accessor("priority", {
        header: "priorité",
        cell: (cell) => {
            const { errors } = React.useContext(CreateProjectContext);
            const isError = isAnyKeyBeginWith(
                errors,
                `tasks.${cell.row.index}.priority`
            );
            return (
                <EditableCell
                    type="combobox"
                    options={["basse", "Moyenne", "Haute"]}
                    placeholders={{
                        trigger: "Priorité",
                    }}
                    className={isError ? "border-red-500" : ""}
                    {...cell}
                />
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
