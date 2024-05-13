import React from "react";
import { flexRender, Table as TanstackTable, Row } from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { PaginationLinks, PaginationMeta } from "@/types";
import Pagination from "./Pagination";

export default function DataTable({
    table,
    subComponent,
    pagination,
}: {
    table: TanstackTable<any>;
    subComponent?: (props: { row: Row<any> }) => React.ReactElement;
    pagination?: {
        links: PaginationLinks;
        meta: PaginationMeta;
    };
}) {
    return (
        <>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <React.Fragment key={row.id}>
                                <TableRow
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                                {row.getCanExpand() &&
                                typeof subComponent != "undefined"
                                    ? row.getIsExpanded() && (
                                          <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                                              <TableCell
                                                  colSpan={
                                                      row.getVisibleCells()
                                                          .length
                                                  }
                                              >
                                                  {subComponent({ row })}
                                              </TableCell>
                                          </TableRow>
                                      )
                                    : null}
                            </React.Fragment>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={table.getAllColumns().length}
                                className="h-24 text-center"
                            >
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="bg-white dark:bg-gray-700 py-2">
                {pagination &&
                    pagination.meta.per_page < pagination.meta.total && (
                        <Pagination
                            links={pagination.links}
                            meta={pagination.meta}
                        />
                    )}
            </div>
        </>
    );
}
