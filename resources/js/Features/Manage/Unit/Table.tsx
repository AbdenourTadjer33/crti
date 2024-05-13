import React from "react";
import {Unit} from "@/types";
import {columnDef} from "@/Features/Manage/Unit/columns";
import {getCoreRowModel, getExpandedRowModel, Row, useReactTable} from "@tanstack/react-table";
import {TableWraper} from "@/Components/ui/table";
import {MdSearch} from "react-icons/md";
import {Input} from "@/Components/ui/input";
import DataTable from "@/Components/DataTable";

const Table: React.FC<{ units: Unit[] }> = ({units}) => {
    const finalData = React.useMemo(() => units, [units]);
    const finalColumnDef = React.useMemo(() => columnDef, []);

    const table = useReactTable({
        columns: finalColumnDef,
        data: finalData,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
        getRowCanExpand: () => true,
        getExpandedRowModel: getExpandedRowModel(),
        state: {},
    });

    const subComponent = ({row}: { row: Row<Unit> }) => {
        return <></>;
    }

    return <TableWraper>
        <div className="p-4 flex justify-between gap-2">
            <div className="relative sm:w-80">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                    <MdSearch className="w-5 h-5 text-gray-500 dark:text-gray-400"/>
                </div>
                <Input placeholder="Search" className="pl-10"/>
            </div>
        </div>

        <DataTable table={table} subComponent={subComponent}/>
    </TableWraper>
}

export default Table;
