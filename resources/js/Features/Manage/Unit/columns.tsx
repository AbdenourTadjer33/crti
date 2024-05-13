import {createColumnHelper} from "@tanstack/react-table";
import {Unit} from "@/types";

const columnHelper = createColumnHelper<Unit>();

export const columnDef = [
    columnHelper.display({
        id: 'selecter',
        header: ({table}) => {
            return <></>
        },
        cell: ({row}) => {
            return <></>
        },
        enableHiding: false,
        enableSorting: false,
    }),
    columnHelper.display({
        id: "expander",
        cell: ({row}) => {
            return <></>
        }
    }),

    columnHelper.accessor('id', {
        header: "id",
    }),

    columnHelper.accessor('name', {
        header: "unit",
    }),
];
