import React from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { columnDef } from "../Task/columns";
import DataTable from "@/Components/DataTable";
import { TableWraper } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Task } from "@/types/task";
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
import { CreateProjectContext } from "./Form";
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
import { IconBase } from "react-icons/lib";
import { Indicator } from "@/Components/ui/indicator";
import { useSessionStorage } from "@/Hooks/use-session-storage-with-object";
import { useForm } from "@inertiajs/react";
import { DateRange } from "react-day-picker";

const TaskForm = () => {
    const { data, setData, errors } = React.useContext(CreateProjectContext);
    const finalColumnDef = React.useMemo(() => columnDef, [columnDef]);
    const finalData = React.useMemo(() => data.tasks, [data.tasks]);

    const [tableData, setTableData] = React.useState<Task[]>([
        {
            name: "fix the task",
            description: "here you need to fix something",
            timeline: { from: new Date(), to: new Date() },
            outcome: "",
        },
    ]);

    const table = useReactTable({
        columns: finalColumnDef,
        data: finalData,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <>
            <TableWraper>
                <div className="p-4 flex justify-end">
                    <CreateNewTask />
                </div>
                <DataTable
                    options={{
                        table,
                        noDataPlaceholder: () =>
                            "Commencez par ajouter les tâches",
                    }}
                />
            </TableWraper>
        </>
    );
};

const CreateNewTask = () => {
    const { data, setData } = React.useContext(CreateProjectContext);

    const { data: task, setData: setTask } = useForm<{
        name: string;
        description: string;
        user_uuid: string;
        timeline: DateRange | undefined;
        priority: string;
    }>({
        name: "",
        description: "",
        user_uuid: "",
        timeline: undefined,
        priority: "",
    });

    React.useEffect(() => {
        setData((data) => {
        data.tasks[0].push({name: "",
        description: "",
        user_uuid: "",
        timeline: undefined,
        priority: "",
    })
            return { ...data };
        });
    }, []);

    const add = () => {
        setData((data) => {
            data.tasks.push(task);
            return { ...data };
        });
    };

    const cancel = () => {};

    return (
        <Dialog>
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
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label>Tâche</Label>
                        <Input
                            value={task.name}
                            onChange={(e) => setTask("name", e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label>Assigné à</Label>
                        <Select
                            value={task.user_uuid}
                            onValueChange={(uuid) => setTask("user_uuid", uuid)}
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
                                <SelectItem value="Moyenne">Moyenne</SelectItem>
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

                <pre>{JSON.stringify(task, null, 2)}</pre>
            </DialogContent>
        </Dialog>
    );
};

const NewTaskForm = () => {
    const { data, setData } = React.useContext(CreateProjectContext);
    const taskIdx = null;

    React.useEffect(() => {
        const tasks = [...data.tasks];

        tasks.push({
            name: "",
            description: "",
            timeline: undefined,
        });
        setData("tasks", tasks);
    }, []);

    return (
        <div>
            <div className="space-y-1">
                <Label>Tâche</Label>
                <Input
                    value={data.tasks[0].name}
                    onChange={(e) =>
                        setData((data) => {
                            data.tasks[0].name = e.target.value;
                            return { ...data };
                        })
                    }
                />
            </div>
        </div>
    );
};

export default TaskForm;
