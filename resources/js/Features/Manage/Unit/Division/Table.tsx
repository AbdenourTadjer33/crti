import React from "react";
import { Pagination as PaginationType, Unit } from "@/types";
import { columnDef } from "@/Features/Manage/Unit/Division/columns";
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
import { Division } from "@/types/division";
import { Link } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { cn } from "@/Utils/utils";

const Table: React.FC<{ divisions: Division[] }> = ({ divisions }) => {
    // const finalData = React.useMemo(() => divisions.data, [divisions.data]);
    const finalData = React.useMemo(() => divisions, [divisions]);
    const finalColumnDef = React.useMemo(() => columnDef, []);

    const table = useReactTable({
        columns: finalColumnDef,
        data: finalData ?? [],
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
        getExpandedRowModel: getExpandedRowModel(),
    });

    return (
        <>
            <div className="flex justify-end">
                <Link
                    href={route(
                        "manage.unit.division.create",
                        route().params.unit as string
                    )}
                    className={cn(buttonVariants(), "sm:hidden justify-between gap-2")}
                >
                    <Plus className="w-4 h-4" />
                    Ajouter divisions
                </Link>
            </div>
            <TableWrapper>
                <div className="p-4 flex justify-between gap-2">
                    <div className="relative sm:w-80">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <MdSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <Input placeholder="Search" className="pl-10" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={route(
                                "manage.unit.division.create",
                                route().params.unit as string
                            )}
                            className={cn(buttonVariants(), "sm:flex hidden justify-between gap-2")}
                        >
                            <Plus className="w-4 h-4" />
                            Ajouter divisions
                        </Link>

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
        </>
    );
};

export default Table;
