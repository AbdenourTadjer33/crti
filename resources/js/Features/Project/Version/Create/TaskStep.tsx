import React from "react";
import { Button, buttonVariants } from "@/Components/ui/button";
import { CreateProjectContext } from "@/Contexts/Project/create-project-context";
import { CalendarIcon, Check, ChevronDown, X } from "lucide-react";
import { StepperContentProps } from "@/Components/ui/stepper";
import { deepKeys } from "@/Libs/Validation/utils";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { InputError } from "@/Components/ui/input-error";
import { MemberForm } from "@/types/form";
import { Calendar } from "@/Components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/Utils/utils";
import { Editor } from "@/Components/Editor";
import * as Card from "@/Components/ui/card";
import * as Popover from "@/Components/ui/popover";
import * as Command from "@/Components/ui/command";
import * as Select from "@/Components/ui/select";

const TaskStep = ({
    prev,
    next,
    clearStepError,
    markStepAsError,
    markStepAsSuccess,
}: StepperContentProps) => {
    const {
        data,
        setData,
        processing,
        validate,
        clearErrors,
        setError,
        errors,
    } = React.useContext(CreateProjectContext);
    const [task, setTask] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const goNext = () => {
        const fields = "tasks," + deepKeys(data.tasks, "tasks");

        validate(fields, {
            onSuccess() {
                fields.split(",").map((field) => clearErrors(field));
                clearStepError();
                markStepAsSuccess();
                next();
            },
            onError(errors) {
                markStepAsError();
                setError(errors);
            },
        });
    };

    const addNewTask = () => {
        if (!task.trim().length) {
            alert("Ajoutez un nom à la tache");
            return;
        }

        clearErrors("tasks");

        setData((data) => {
            data.tasks.push({
                name: task,
                description: "",
                users: [],
                timeline: { from: undefined, to: undefined },
                priority: "",
            });
            return { ...data };
        });

        setTask("");
        inputRef.current?.blur();
    };

    return (
        <>
            {data.tasks.map((task, idx) => (
                <Card.Card
                    key={idx}
                    className="relative p-4 grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4"
                >
                    <div className="absolute top-0 right-0">
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                                setData((data) => {
                                    data.tasks.splice(idx, 1);
                                    return { ...data };
                                })
                            }
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={`task_name_${idx}`} required>
                            Tâche
                        </Label>
                        <Input
                            id={`task_name_${idx}`}
                            value={task.name}
                            onChange={(e) => {
                                clearErrors(`tasks.${idx}.name`);
                                setData((data) => {
                                    data.tasks[idx].name = e.target.value;
                                    return { ...data };
                                });
                            }}
                        />
                        <InputError message={errors[`tasks.${idx}.name`]} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={`task_timeline_${idx}`} required>
                            Êchancier
                        </Label>
                        <div>
                            <Popover.Popover>
                                <Popover.PopoverTrigger asChild>
                                    <Button
                                        id={`task_timeline_${idx}`}
                                        variant="outline"
                                        className="w-full justify-between pr-0"
                                    >
                                        <div className="w-full truncate text-start">
                                            {!task.timeline ||
                                            (!task.timeline?.from &&
                                                !task.timeline?.to)
                                                ? "Date début/fin"
                                                : task.timeline.from &&
                                                  !task.timeline.to
                                                ? `De ${format(
                                                      task.timeline.from!,
                                                      "dd/MM/yyy"
                                                  )}`
                                                : task.timeline.from &&
                                                  task.timeline.to &&
                                                  `De ${format(
                                                      task.timeline.from!,
                                                      "dd/MM/yyy"
                                                  )} à ${format(
                                                      task.timeline.to!,
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
                                        selected={task.timeline}
                                        onSelect={(range) => {
                                            clearErrors(
                                                `tasks.${idx}.timeline`
                                            );
                                            setData((data) => {
                                                data.tasks[idx].timeline =
                                                    range!;
                                                return { ...data };
                                            });
                                        }}
                                        disabled={{
                                            before: data?.timeline?.from!,
                                            after: data?.timeline?.to!,
                                        }}
                                        defaultMonth={
                                            task.timeline?.from ||
                                            data?.timeline?.from
                                        }
                                    />
                                </Popover.PopoverContent>
                            </Popover.Popover>
                        </div>
                        <InputError message={errors[`tasks.${idx}.timeline`]} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={`task_users_${idx}`} required>
                            Assigné à
                        </Label>
                        <div>
                            <TaskUsersField
                                id={`task_users_${idx}`}
                                values={task.users}
                                members={data.members}
                                onValuesChange={(values) => {
                                    clearErrors(`tasks.${idx}.users`);
                                    setData((data) => {
                                        data.tasks[idx].users = values;
                                        return { ...data };
                                    });
                                }}
                            />
                        </div>
                        <InputError message={errors[`tasks.${idx}.users`]} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={`task_priority_${idx}`} required>
                            Priorité
                        </Label>
                        <Select.Select
                            value={task.priority}
                            onValueChange={(value) => {
                                clearErrors(`tasks.${idx}.priority`);
                                setData((data) => {
                                    data.tasks[idx].priority = value;
                                    return { ...data };
                                });
                            }}
                        >
                            <Select.SelectTrigger id={`task_priority_${idx}`}>
                                {task.priority ||
                                    "Sélectionner priorité de la tâche"}
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
                        <InputError message={errors[`tasks.${idx}.priority`]} />
                    </div>
                    <div className="space-y-1 md:col-span-4 sm:col-span-2">
                        <Label required>Description</Label>
                        <Editor
                            autofocus={false}
                            content={task.description}
                            onContentChange={({ html }) => {
                                clearErrors(`tasks.${idx}.description`);
                                setData((data) => {
                                    data.tasks[idx].description = html;
                                    return { ...data };
                                });
                            }}
                        />
                        <InputError
                            message={errors[`tasks.${idx}.description`]}
                        />
                    </div>
                </Card.Card>
            ))}

            <InputError message={errors["tasks"]} />

            <div className="relative max-w-screen-lg mx-auto">
                <Input
                    ref={inputRef}
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Nouvelle tâche..."
                    className="pr-20"
                    onKeyDown={(e) => {
                        if (e.code === "Enter") {
                            e.preventDefault();
                            addNewTask();
                        }
                    }}
                />
                <Button
                    type="button"
                    className="absolute right-0.5 top-1/2 -translate-y-1/2"
                    variant="ghost"
                    size="sm"
                    onClick={addNewTask}
                >
                    Ajouter
                </Button>
            </div>

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
        </>
    );
};

interface TaskUsersFieldProps extends React.HTMLAttributes<HTMLButtonElement> {
    values: string[];
    members: MemberForm[];
    onValuesChange: (values: string[]) => void;
}

const TaskUsersField: React.FC<TaskUsersFieldProps> = ({
    values,
    members,
    onValuesChange,
    className,
    ...props
}) => {
    const selectedMembers = React.useMemo(
        () => members.filter((m) => values.includes(m.uuid)),
        [members, values]
    );

    return (
        <Popover.Popover>
            <Popover.PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn("w-full justify-between pr-0", className)}
                    {...props}
                >
                    <div className="w-full truncate text-start">
                        {values.length
                            ? selectedMembers.map((m) => m.name).join(", ")
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
                                        onSelect={(value) => {
                                            const selectedValues = [...values];
                                            if (
                                                selectedValues.includes(value)
                                            ) {
                                                selectedValues.splice(
                                                    selectedValues.indexOf(
                                                        value
                                                    ),
                                                    1
                                                );
                                            } else {
                                                selectedValues.push(value);
                                            }
                                            onValuesChange(selectedValues);
                                        }}
                                    >
                                        <Check
                                            className={
                                                "mr-2 h-4 w-4 data-[checked=false]:opacity-0"
                                            }
                                            data-checked={values?.includes(
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
};

export default TaskStep;
