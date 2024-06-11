import React from "react";
import { Checkbox } from "@/Components/ui/checkbox";
import { createColumnHelper } from "@tanstack/react-table";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useHover } from "@/Hooks/use-hover";
import { CreateProjectContext, TaskForm } from "../Create/Form";
import { EditableTableCell } from "@/Components/common/editable-table-cell";
import { Button } from "@/Components/ui/button";
import { Check, Edit, X } from "lucide-react";
import { format, isDate } from "date-fns";

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
                <MdKeyboardArrowDown className="w-4 h-4" />
            </div>
        ),
        cell: ({ row }) => {
            const hoverRef = React.useRef(null);
            const isHover = useHover(hoverRef);
            return (
                <div ref={hoverRef}>
                    {isHover || row.getIsSelected() ? (
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) =>
                                row.toggleSelected(!!value)
                            }
                            aria-label="select row"
                        />
                    ) : (
                        <>{Number(row.id) + 1}</>
                    )}
                </div>
            );
        },
    }),

    columnHelper.accessor("name", {
        header: "tâche",
        cell: (props) =>
            props.row.getIsOnEditMode() ? (
                <EditableTableCell field={{ type: "text" }} {...props} />
            ) : (
                props.getValue()
            ),
    }),

    columnHelper.accessor("description", {
        header: "description",
        cell: (props) =>
            props.row.getIsOnEditMode() ? (
                <EditableTableCell field={{ type: "textarea" }} {...props} />
            ) : (
                props.getValue()
            ),
    }),

    columnHelper.accessor("begin", {
        header: "Date début",
        cell: (props) =>
            props.row.getIsOnEditMode() ? (
                <EditableTableCell field={{ type: "day" }} {...props} />
            ) : isDate(props.getValue()) ? (
                format(props.getValue(), "dd-mm-yyy")
            ) : (
                ""
            ),
    }),

    columnHelper.accessor("end", {
        header: "Date end",
        cell: (props) =>
            props.row.getIsOnEditMode() ? (
                <EditableTableCell field={{ type: "day" }} {...props} />
            ) : isDate(props.getValue()) ? (
                format(props.getValue(), "dd-mm-yyy")
            ) : (
                ""
            ),
        meta: {
            type: "calendar",
        },
    }),

    columnHelper.accessor("uuid", {
        header: "assigné à",
        cell: (props) => {
            const { data } = React.useContext(CreateProjectContext);
            return props.row.getIsOnEditMode() ? (
                <EditableTableCell
                    field={{
                        type: "combobox",
                        options: data.members.map((member) => {
                            return {
                                label: member.name,
                                value: member.uuid,
                            };
                        }),
                        placeholder: "Sélectionner les members",
                        many: true,
                    }}
                    {...props}
                />
            ) : (
                props.getValue()
            );
        },
    }),

    columnHelper.accessor("priority", {
        header: "priorité",
        cell: (props) =>
            props.row.getIsOnEditMode() ? (
                <EditableTableCell
                    field={{
                        type: "combobox",
                        options: ["basse", "Moyenne", "Haute"],
                        placeholder: "Sélectionner la priorité de la tâche",
                    }}
                    {...props}
                />
            ) : (
                props.getValue()
            ),
    }),

    columnHelper.display({
        id: "update-row",
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-4">
                    <Button
                        variant="primary"
                        size="icon"
                        onClick={() =>
                            row.toggleEditMode(!row.getIsOnEditMode())
                        }
                    >
                        {row.getIsOnEditMode() ? <Check /> : <Edit />}
                    </Button>
                    <Button
                        onClick={() => row.removeRow()}
                        variant="destructive"
                        size="icon"
                    >
                        <X />
                    </Button>
                </div>
            );
        },
    }),
];
