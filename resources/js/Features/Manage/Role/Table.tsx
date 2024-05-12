import { Role } from "@/types";
import React from "react";
import { columnDef } from "./columns";
import { TableWraper } from "@/Components/ui/table";
import { MdSearch } from "react-icons/md";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { IoMdOptions } from "react-icons/io";
import DataTable from "@/Components/DataTable";
import { Badge } from "@/Components/ui/badge";
import {
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
    Row,
} from "@tanstack/react-table";
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

const Table: React.FC<{ roles: Role[] }> = ({ roles }) => {
    const finaldata = React.useMemo(() => roles, [roles]);
    const finalColumnDef = React.useMemo(() => columnDef, []);

    const table = useReactTable({
        columns: finalColumnDef,
        data: finaldata,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
        getRowCanExpand: () => true,
        getExpandedRowModel: getExpandedRowModel(),
        state: {},
    });

    const subComponent = ({ row }: { row: Row<Role> }) => {
        const permissions = row.original.permissions;

        return (
            <div className="flex flex-wrap gap-2">
                {permissions?.map((permission) => (
                    <Badge variant="indigo" key={permission.id}>
                        {permission.model}@{permission.action}
                    </Badge>
                ))}
            </div>
        );
    };

    return (
        <TableWraper>
            <div className="p-4 flex justify-between gap-2">
                <div className="relative sm:w-80">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <MdSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <Input placeholder="Search" className="pl-10" />
                </div>

                <DropdownMenu>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost">
                                        <IoMdOptions className="w-5 h-5" />
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

            <DataTable table={table} subComponent={subComponent} />
        </TableWraper>
    );
};

export default Table;
