import React, { useState } from "react";
import {
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { TableWrapper } from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import DataTable from "@/Components/common/data-table";
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
import { User } from "@/types";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/Utils/utils";
import { columnDef } from "./Columns";
import AddMemberModal from "./AddMemberModal";

const Table: React.FC<{ users: User[] }> = ({ users }) => {
    const data = React.useMemo(() => users, [users]);
    const columns = React.useMemo(() => columnDef, []);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => setIsDialogOpen(true);
    const handleCloseDialog = () => setIsDialogOpen(false);

    const handleAddMember = (user: User) => {
        // Logique pour ajouter un membre
        handleCloseDialog();
    };

    const handleRemoveMember = (uuid: string) => {
        // Logique pour retirer un membre
    };

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.uuid,
    });

    return (
        <>
            <div className="flex justify-end">
                <Button
                    className={cn(
                        buttonVariants(),
                        "sm:hidden justify-between gap-2"
                    )}
                    onClick={handleOpenDialog}
                >
                    <Plus className="w-4 h-4" />
                    Ajouter un membre
                </Button>
            </div>
            <TableWrapper>
                <div className="p-4 flex justify-between gap-2">
                    <div className="relative sm:w-80">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <Input placeholder="Search" className="pl-10" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            className={cn(
                                buttonVariants(),
                                "sm:flex hidden justify-between gap-2"
                            )}
                            onClick={handleOpenDialog}
                        >
                            <Plus className="w-4 h-4" />
                            Ajouter un membre
                        </Button>
                        <DropdownMenu>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost">
                                                <SlidersHorizontal className="ww-5 h-5" />
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
                                            typeof col.columnDef.header ===
                                            "string"
                                                ? col.columnDef.header
                                                : col.id;
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={col.id}
                                                checked={col.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    col.toggleVisibility(
                                                        !!value
                                                    )
                                                }
                                                onSelect={(e) =>
                                                    e.preventDefault()
                                                }
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
                    }}
                />
            </TableWrapper>

            <AddMemberModal
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                members={users}
                addMember={handleAddMember}
                removeMember={handleRemoveMember}
            />
        </>
    );
};

export default Table;
