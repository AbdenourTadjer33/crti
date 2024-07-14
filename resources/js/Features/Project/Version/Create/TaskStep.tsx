import React from "react";
import { Button, ButtonGroup } from "@/Components/ui/button";
import { TableWraper } from "@/Components/ui/table";
import { MdAdd } from "react-icons/md";
import { CreateProjectContext } from "@/Contexts/Project/create-project-context";
import DataTable from "@/Components/DataTable";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { columnDef } from "./columns";
import { EditMode } from "@/Libs/EditMode";
import { FaCaretDown } from "react-icons/fa";
import * as Dropdown from "@/Components/ui/dropdown-menu";
import { X } from "lucide-react";
import { FormProps } from "@/Components/Stepper";
import { useSessionStorage } from "@/Hooks/use-session-storage-with-object";

const TaskStep = ({ prev, next }: FormProps) => {
    const { data, setData, processing, errors, validate, clearErrors } =
        React.useContext(CreateProjectContext);

    const goNext = () => {
        const fields = "tasks";

        validate(fields, {
            onSuccess: () => {
                clearErrors(fields);
                next();
            },
        });
    };

    return (
        <div className="space-y-8">
            <TaskTable />

            <pre>{JSON.stringify({ tasks: data.tasks, errors }, null, 2)}</pre>

            <div className="flex gap-4 max-w-lg mx-auto">
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={processing}
                    onClick={prev}
                >
                    Précendant
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={processing}
                    onClick={goNext}
                >
                    Suivant
                </Button>
            </div>
        </div>
    );
};

const TaskTable = () => {
    const { data, setData } = React.useContext(CreateProjectContext);
    const columns = React.useMemo(() => columnDef, [columnDef]);
    const [tasks, setTasks] = React.useState(data.tasks);
    const [onEditMode, setOnEditMode] = useSessionStorage("taskoneditmode", {});
    const [rowSelection, setRowSelection] = useSessionStorage(
        "taskselected",
        {}
    );

    const table = useReactTable({
        _features: [EditMode],
        enableEditMode: true,
        data: tasks,
        setData: setTasks,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (originalRow) => originalRow.id,
        onEditModeChange: setOnEditMode,
        onRowSelectionChange: setRowSelection,
        state: {
            editMode: onEditMode,
            rowSelection,
        },
    });

    const newTask = () => {
        const id = crypto.randomUUID();

        table.addRow({
            id,
            name: "",
            description: "",
            users: [],
            timeline: { from: undefined, to: undefined },
            priority: "",
        });

        setOnEditMode((prev) => {
            return { ...prev, [id]: true };
        });
    };

    React.useEffect(() => {
        setData((data) => {
            data.tasks = tasks;
            return { ...data };
        });
    }, [tasks]);

    return (
        <TableWraper className="shadow-none">
            <div className="p-4 flex gap-4 flex-row-reverse">
                <ButtonGroup>
                    <Button onClick={newTask}>
                        <MdAdd className="h-4 w-4 mr-2" />
                        Ajouter une tâche
                    </Button>
                    <Dropdown.DropdownMenu>
                        <Dropdown.DropdownMenuTrigger asChild>
                            <Button size="icon">
                                <FaCaretDown className="w-4 h-4" />
                            </Button>
                        </Dropdown.DropdownMenuTrigger>
                        <Dropdown.DropdownMenuContent align="end">
                            <Dropdown.DropdownMenuItem>
                                Ajouter avec une nouvelle fénetre
                            </Dropdown.DropdownMenuItem>
                        </Dropdown.DropdownMenuContent>
                    </Dropdown.DropdownMenu>
                </ButtonGroup>

                {!!Object.keys(table.getState().rowSelection).length && (
                    <Button
                        variant="destructive"
                        onClick={() => {
                            table.removeRows(
                                ...table
                                    .getSelectedRowModel()
                                    .rows.map((row) => row.index)
                            );
                            table.resetRowSelection();
                        }}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Supprimer
                    </Button>
                )}
            </div>
            <DataTable
                options={{
                    table,
                    noDataPlaceholder: (
                        <div className="text-lg text-center">
                            Commencez par{" "}
                            <Button
                                variant="link"
                                className="p-0 text-lg"
                                onClick={newTask}
                            >
                                ajouter une tâche
                            </Button>
                        </div>
                    ),
                }}
            />
        </TableWraper>
    );
};

export default TaskStep;
