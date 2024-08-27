import {
    HeaderSelecter,
    RowSelecter,
} from "@/Components/common/data-table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { User } from "@/types";
import { Button } from "@/Components/ui/button";
import { Check, Edit, X } from "lucide-react";
import React, { useState } from "react";
import { EditableCell } from "@/Components/EditableCell";
import { Input } from "@/Components/ui/input";
import { Row } from "react-day-picker";
import { CreateProjectContext } from "@/Contexts/Project/create-project-context";
import { deepKeys, isAnyKeyBeginWith } from "@/Libs/Validation/utils";
import { cn } from "@/Utils/utils";
import { toast } from "sonner";
import { DialogTrigger } from "@/Components/ui/dialog";
import EditGradeDialog from "./EditGradeDialog";

const columnHelper = createColumnHelper<User>();

export const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({ table }) => <HeaderSelecter table={table} />,
        cell: ({ row }) => <RowSelecter row={row} />,
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.accessor("uuid", {
        header: "id",
    }),

    columnHelper.accessor("name", {
        header: "name",

    }),

    columnHelper.accessor("email", {
        header: "e-mail",
    }),

    columnHelper.accessor("division.grade", {
        header: "grade",
    }),



    columnHelper.accessor("division.addedAt", {
        header: "Ajouté le",
        cell: ({ getValue }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        {dayjs(getValue()).fromNow()}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{dayjs(getValue()).format("DD-MM-YYYY HH:mm:ss")}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
    }),

    columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
            const userId = row.original.uuid;
            const [isDialogOpen, setDialogOpen] = React.useState(false);

            const handleEditClick = () => {
                setDialogOpen(true);
            };

            const handleDialogClose = () => {
                setDialogOpen(false);
            };


            return (
                <>
                    <EditGradeDialog
                        isOpen={isDialogOpen}
                        onClose={handleDialogClose}
                        currentGrade={row.original.division?.grade}
                    />
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            className="text-blue-500"
                            onClick={handleEditClick}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="destructive"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </>
            );
        },
        enableHiding: false,
        enableSorting: false,
    }),


];

