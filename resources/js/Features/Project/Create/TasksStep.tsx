import React from "react";
import {
    createColumnHelper,
    getCoreRowModel,
    RowData,
    useReactTable,
} from "@tanstack/react-table";
import DataTable, { EditableTableCell } from "@/Components/DataTable";
import { TableWraper } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/Components/ui/input";
import { CreateProjectContext, TaskForm } from "./Form";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/Components/ui/calendar";
import { deepDotKeys, validate } from "@/Libs/validation";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Checkbox } from "@/Components/ui/checkbox";
import { useHover } from "@/Hooks/use-hover";
import { EditMode } from "@/Libs/EditMode/EditMode";

declare module "@tanstack/react-table" {
    interface TableMeta<TData extends RowData> {
        updateData: (
            rowIndex: number,
            columnId: keyof TData,
            value: string
        ) => void;
    }
}

const columnHelper = createColumnHelper<TaskForm>();

const columnDef = [
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
        cell: (props) => {
            props.row.getIsOnEditMode() ? (
                <EditableTableCell {...props} />
            ) : (
                props.getValue()
            );
        },
        meta: {
            type: "input",
        },
    }),

    columnHelper.accessor("description", {
        header: "description",

        cell: (props) =>
            props.row.getIsOnEditMode() ? (
                <EditableTableCell {...props} />
            ) : (
                props.getValue()
            ),
        meta: {
            type: "textarea",
        },
    }),

    columnHelper.accessor("begin", {
        header: "Date début",
        cell: (props) =>
            props.row.getIsOnEditMode() ? (
                <EditableTableCell {...props} />
            ) : (
                props.getValue()
            ),
        meta: {
            type: "calendar",
        },
    }),

    columnHelper.accessor("end", {
        header: "Date end",
        cell: (props) =>
            props.row.getIsOnEditMode() ? (
                <EditableTableCell {...props} />
            ) : (
                props.getValue()
            ),
        meta: {
            type: "calendar",
        },
    }),

    columnHelper.accessor("uuid", {
        header: "assigné à",
        cell: (props) =>
            props.row.getIsOnEditMode() ? (
                <EditableTableCell {...props} />
            ) : (
                props.getValue()
            ),
        meta: {
            type: "input",
        },
    }),

    columnHelper.accessor("priority", {
        header: "priorité",
        cell: (props) =>
            props.row.getIsOnEditMode() ? (
                <EditableTableCell {...props} />
            ) : (
                props.getValue()
            ),
        meta: {
            type: "select",
            options: [
                { value: "basse" },
                { value: "Moyenne" },
                { value: "Haute" },
            ],
            placeholder: "Sélectionner la priorité de la tâche",
        },
    }),

    columnHelper.display({
        id: "update-row",
        cell: ({ row }) => {
            return (
                <Button
                    onClick={() => row.toggleEditMode(!row.getIsOnEditMode())}
                >
                    {row.getIsOnEditMode() ? "save" : "edit"}
                </Button>
            );
        },
    }),

    // columnHelper.display({
    // id: "validator",
    // cell: () => <>valider</>,
    // }),
];

const TasksStep = () => {
    const { data, setData, errors } = React.useContext(CreateProjectContext);
    const finalColumnDef = React.useMemo(() => columnDef, [columnDef]);
    const finalData = React.useMemo(() => {
        return { ...data.tasks };
    }, [data.tasks]);

    const table = useReactTable({
        _features: [EditMode],
        columns: finalColumnDef,
        data: data.tasks,
        getCoreRowModel: getCoreRowModel(),
        enableEditMode: true,
        // onDataChange: (rowIndex, columnId, value) => {
        //     // setData((data) => {
        //     // data.tasks[rowIndex][columnId] = "";
        //     // return { ...data };
        //     // })
        // },
        // meta: {
        //     updateData: (
        //         rowIndex: keyof TaskForm[],
        //         columnId: string,
        //         value
        //     ) => {
        //         // setData((data) => {
        //         // const wesh = data.tasks[rowIndex][columnId]
        //         // return { ...data };
        //         // });
        //     },
        // },
    });

    return (
        <TableWraper>
            <div className="p-4 flex justify-end">
                <CreateNewTask />
            </div>
            <DataTable
                options={{
                    table,
                    noDataPlaceholder: () => "Commencez par ajouter les tâches",
                }}
            />

            <pre>{JSON.stringify(data.tasks, null, 2)}</pre>
        </TableWraper>
    );
};

const CreateNewTask = () => {
    const { data, setData } = React.useContext(CreateProjectContext);
    const [open, setOpen] = React.useState(false);
    // const add = async () => {
    //     await validate(
    //         "tasks," +
    //             deepDotKeys(task, `tasks.${data.tasks.length}`).join(","),
    //         data
    //     );
    //     // const
    //     // validate(getDottedKeys(task, `tasks.${data.tasks.length}`), { tasks: [task] });
    //     //
    //     // setData((data) => {
    //     // data.tasks.push(task);
    //     // return { ...data };
    //     // });
    // };

    // const cancel = () => {
    // setOpen(false);
    // };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Ajouter une tâche</Button>
            </DialogTrigger>
            <DialogContent
                className="max-w-3xl max-h-screen"
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Ajouter une tâche</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                    </DialogDescription>
                </DialogHeader>

                <TaskForm1 open={open} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
};

const TaskForm1 = ({ open, setOpen }) => {
    const { data, setData } = React.useContext(CreateProjectContext);
    const [taskIdx, setTaskIdx] = React.useState<number>(0);

    React.useEffect(() => {
        setData((data) => {
            data.tasks.push({
                name: "",
                description: "",
                uuid: "",
                priority: "",
                begin: "",
                end: "",
            });
            return { ...data };
        });

        setTaskIdx(data.tasks.length - 1);
    }, []);

    // React.useEffect(() => {
    //     if (!open) {
    //         console.log("ki yatghla9");
    //     }
    // }, [open]);

    // React.useEffect(() => {}, []);

    const add = () => {
        // validation

        // if (validation) {
        setData((data) => {
            data.tasks[0].isValid = true;
            return { ...data };
        });
        setOpen(false);
        // }
    };

    return (
        <>
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>Tâche</Label>
                    <Input
                        value={data.tasks[taskIdx].name}
                        onChange={(e) =>
                            setData((data) => {
                                data.tasks[taskIdx].name = e.target.value;
                                return { ...data };
                            })
                        }
                    />
                </div>
            </div>
            form
            <div className="flex items-center gap-4">
                <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    onClick={() => setOpen(false)}
                >
                    Annuler
                </Button>
                <Button
                    type="button"
                    variant="default"
                    className="w-full"
                    onClick={add}
                >
                    Ajouter
                </Button>
            </div>
        </>
    );
};

{
    /* <>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Tâche</Label>
                            <Input
                                value={task.name}
                                onChange={(e) =>
                                    setTask("name", e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Assigné à</Label>
                            <Select
                                value={task.user}
                                onValueChange={(uuid) => setTask("user", uuid)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un member" />
                                </SelectTrigger>
                                <SelectContent>
                                    {data.members.length ? (
                                        data.members.map((member) => (
                                            <SelectItem value={member.uuid}>
                                                {member.uuid}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <div className="py-1.5 pl-8 pr-2 text-sm">
                                            Veuillez selectionnez les members de
                                            votre équipe
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                            <Label>Description</Label>
                            <Textarea
                                value={task.description}
                                onChange={(e) =>
                                    setTask("description", e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="capitalize">échéancier</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="justify-between w-full"
                                    >
                                        timeline
                                        <CalendarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="range"
                                        selected={task.timeline}
                                        onSelect={(range) =>
                                            setTask("timeline", range)
                                        }
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="priority">Priorité</Label>
                            <Select
                                value={task.priority}
                                onValueChange={(priority) =>
                                    setTask("priority", priority)
                                }
                            >
                                <SelectTrigger id="priority">
                                    <SelectValue
                                        id="priority"
                                        placeholder="Sélectionner la priorité"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        value="Basse"
                                        className="flex items-center gap-4"
                                    >
                                        Basse
                                    </SelectItem>
                                    <SelectItem value="Moyenne">
                                        Moyenne
                                    </SelectItem>
                                    <SelectItem value="Haute">Haute</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant="destructive"
                            className="w-full"
                            onClick={cancel}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="button"
                            variant="default"
                            className="w-full"
                            onClick={add}
                        >
                            Ajouter
                        </Button>
                    </div>
                </> */
}

export default TasksStep;
