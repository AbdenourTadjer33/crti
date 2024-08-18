import React, { useState } from "react";
import {
    getCoreRowModel,
    getExpandedRowModel,
    Row,
    useReactTable,
} from "@tanstack/react-table";
import { TableWrapper } from "@/Components/ui/table";
import { MdSearch } from "react-icons/md";
import { Input } from "@/Components/ui/input";
import DataTable from "@/Components/DataTable";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Button, buttonVariants } from "@/Components/ui/button";
import { IoMdOptions } from "react-icons/io";
import { columnDef } from "./Columns";
import { User } from "@/types";
import EditGradeDialog from "./EditGradeDialog";

const Table: React.FC<{ users: User[] }> = ({ users }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const finalData = React.useMemo(() => users, [users]);
    const finalColumnDef = React.useMemo(() => columnDef, []);

    const table = useReactTable({
        columns: finalColumnDef,
        data: finalData ?? [],
        getCoreRowModel: getCoreRowModel(),
        // getRowId: (row) => row.id,
        getExpandedRowModel: getExpandedRowModel(),
    });

    const handleOpenDialog = (user: User) => {
        setSelectedUser({
            ...user,
            unitId: user.unitId, // Assurez-vous que ces propriétés sont définies
            divisionId: user.divisionId, // Assurez-vous que ces propriétés sont définies
        });
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleSaveGrade = (newGrade: string) => {
        if (selectedUser) {
            // Mettre à jour le `grade` de l'utilisateur
            const updatedUsers = users.map((user) =>
                user.id === selectedUser.id
                    ? {
                          ...user,
                          division: { ...user.division, grade: newGrade },
                      }
                    : user
            );
            // Mettre à jour les données du tableau
            // Vous devrez gérer la mise à jour des données dans votre application
        }
    };

    return (
        <TableWrapper>
            <div className="p-4 flex justify-between gap-2">
                <div className="relative sm:w-80">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <MdSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <Input placeholder="Search" className="pl-10" />
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost">
                                            <IoMdOptions className="ww-5 h-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    visibilité des colonnes
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <DropdownMenuContent
                            align="end"
                            onCloseAutoFocus={(e) => e.preventDefault()}
                            loop
                            className="w-40"
                        >
                            {table
                                .getAllColumns()
                                .filter((col) => col.getCanHide())
                                .map((col) => {
                                    const title =
                                        typeof col.columnDef.header === "string"
                                            ? col.columnDef.header
                                            : col.id;
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={col.id}
                                            checked={col.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                col.toggleVisibility(!!value)
                                            }
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            {title}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <DataTable
                options={{
                    table,
                    subComponent: ({ row }) => (
                        <button onClick={() => handleOpenDialog(row.original)}>
                            Modifier le grade
                        </button>
                    ),
                }}
            />
            {selectedUser && (
                <EditGradeDialog
                    isOpen={isDialogOpen}
                    onClose={handleCloseDialog}
                    onSave={handleSaveGrade}
                    currentGrade={selectedUser.division?.grade || ""}
                    unitId={selectedUser.unitId || 0}
                    divisionId={selectedUser.divisionId || 0}
                />
            )}
        </TableWrapper>
    );
};

export default Table;
