import React from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { TableWrapper } from "@/Components/ui/table";
import DataTable from "@/Components/common/data-table";
import { User } from "@/types";
import { columnDef } from "./Columns";

const Table: React.FC<{ users: User[] }> = ({ users }) => {
    const finalData = React.useMemo(() => users, [users]);
    const finalColumnDef = React.useMemo(() => columnDef, []);

    const table = useReactTable({
        columns: finalColumnDef,
        data: finalData ?? [],
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.uuid,
    });

    return (
        <TableWrapper>
            <DataTable
                options={{
                    table,
                }}
            />
        </TableWrapper>
    );
};

export default Table;
