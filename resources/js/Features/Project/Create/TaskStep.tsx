import React from "react";
import { Button, ButtonGroup } from "@/Components/ui/button";
import { TableWraper } from "@/Components/ui/table";
import { MdAdd } from "react-icons/md";
import { CreateProjectContext } from "./Form";
import DataTable from "@/Components/DataTable";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { columnDef } from "../Task/columns";
import { EditMode } from "@/Libs/EditMode";
import { FaCaretDown } from "react-icons/fa";
import {
    DropdownMenuContent,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/Components/ui/dropdown-menu";
import { X } from "lucide-react";
import { FormProps } from "@/Components/Stepper";

const TaskStep = ({ prev, next }: FormProps) => {
    const {
        data: formData,
        setData: setFormData,
        processing,
        errors,
        validate,
    } = React.useContext(CreateProjectContext);
    const columns = React.useMemo(() => columnDef, []);
    const [data, setData] = React.useState(formData.tasks);

    const table = useReactTable({
        _features: [EditMode],
        enableEditMode: true,
        data: data,
        columns,
        setData,
        getCoreRowModel: getCoreRowModel(),
    });

    const goNext = () => {
        validate("", {
            onSuccess: () => {
                next();
            },
        });
        next();
    };

    React.useEffect(() => {
        setFormData((prev) => {
            prev.tasks = data;
            return { ...prev };
        });
    }, [data]);

    return (
        <div className="space-y-8">
            <TableWraper className="shadow-none">
                <div className="p-4 flex gap-4 flex-row-reverse"></div>
                <DataTable options={{ table }} />
                <div className="p-4 flex  gap-4 flex-row-reverse">
                    <ButtonGroup>
                        <Button
                            onClick={() => {
                                table.addRow({
                                    name: "",
                                    description: "",
                                    uuid: [],
                                    begin: "",
                                    end: "",
                                    priority: "",
                                });
                            }}
                        >
                            Ajouter une tâche
                            <MdAdd className="h-4 w-4 ml-2" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button size="icon">
                                    <FaCaretDown className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    Ajouter avec une nouvelle fénetre
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </ButtonGroup>

                    {!!Object.keys(table.getState().rowSelection).length && (
                        <Button variant="destructive">
                            Supprimer
                            <X className="h-4 w-4 ml-2" />
                        </Button>
                    )}
                </div>
            </TableWraper>

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

export default TaskStep;
