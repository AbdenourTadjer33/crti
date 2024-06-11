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

const TaskStep = () => {
    const { data: formData, setData: setFormData } =
        React.useContext(CreateProjectContext);
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

    React.useEffect(() => {
        setFormData((prev) => {
            prev.tasks = data;
            return { ...prev };
        });
    }, [data]);

    return (
        <TableWraper>
            <DataTable options={{ table }} />
            <div className="p-4 flex justify-end">
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
                        <MdAdd className="w-4 h-4 mr-2" />
                        Ajouter une tâche
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon">
                                <FaCaretDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>ABC</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </ButtonGroup>
            </div>

        </TableWraper>
    );
};

export default TaskStep;
