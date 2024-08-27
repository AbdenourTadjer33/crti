import * as React from "react";
import * as TanstackTable from "@tanstack/react-table";
import * as Table from "@/Components/ui/table";
import Pagination from "./pagination";
import { PaginationLinks, PaginationMeta } from "@/types";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

interface DataTableOptions {
    table: TanstackTable.Table<any>;
    subComponent?: (props: { row: TanstackTable.Row<any> }) => React.ReactNode;
    pagination?: { links: PaginationLinks; meta: PaginationMeta };
    noDataPlaceholder?: React.ReactNode;
    footer?: (props: any) => React.ReactNode;
}

interface HeaderSelecterProps {
    table: TanstackTable.Table<any>;
}

interface RowSelecterProps {
    row: TanstackTable.Row<any>;
}

interface RowExpanderProps {
    row: TanstackTable.Row<any>;
}

export default function DataTable({ options }: { options: DataTableOptions }) {
    console.log();
    return (
        <>
            <Table.Table>
                <Table.TableHeader>
                    {options.table.getHeaderGroups().map((headerGroup) => (
                        <Table.TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Table.TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : TanstackTable.flexRender(
                                              header.column.columnDef.header,
                                              header.getContext()
                                          )}
                                </Table.TableHead>
                            ))}
                        </Table.TableRow>
                    ))}
                </Table.TableHeader>
                <Table.TableBody>
                    {options.table.getRowModel().rows?.length ? (
                        options.table.getRowModel().rows.map((row) => (
                            <React.Fragment key={row.id}>
                                <Table.TableRow
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <Table.TableCell key={cell.id}>
                                            {TanstackTable.flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Table.TableCell>
                                    ))}
                                </Table.TableRow>
                                {row.getCanExpand() &&
                                typeof options.subComponent != "undefined"
                                    ? row.getIsExpanded() && (
                                          <Table.TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                                              <Table.TableCell
                                                  colSpan={
                                                      row.getVisibleCells()
                                                          .length
                                                  }
                                              >
                                                  {options.subComponent({
                                                      row,
                                                  })}
                                              </Table.TableCell>
                                          </Table.TableRow>
                                      )
                                    : null}
                            </React.Fragment>
                        ))
                    ) : (
                        <Table.TableRow>
                            <Table.TableCell
                                colSpan={options.table.getAllColumns().length}
                            >
                                {options.noDataPlaceholder ? (
                                    options.noDataPlaceholder
                                ) : (
                                    <div className="text-lg text-center">
                                        no data found
                                    </div>
                                )}
                            </Table.TableCell>
                        </Table.TableRow>
                    )}
                </Table.TableBody>

                <Table.TableFooter>
                    {options.table.getFooterGroups().map((footerGroup, idx) => (
                        <Table.TableRow key={idx}>
                            {footerGroup.headers.map((footer) => (
                                <Table.TableCell
                                    key={footer.id}
                                    colSpan={footer.colSpan}
                                >
                                    {footer.isPlaceholder
                                        ? null
                                        : TanstackTable.flexRender(
                                              footer.column.columnDef.footer,
                                              footer.getContext()
                                          )}
                                </Table.TableCell>
                            ))}
                        </Table.TableRow>
                    ))}
                </Table.TableFooter>
            </Table.Table>
            {options.pagination &&
                options.pagination.meta.per_page <
                    options.pagination.meta.total && (
                    <div className="bg-white dark:bg-gray-700 py-2">
                        <Pagination
                            links={options.pagination.links}
                            meta={options.pagination.meta}
                        />
                    </div>
                )}
        </>
    );
}

function HeaderSelecter({ table }: HeaderSelecterProps) {
    return (
        <Checkbox
            checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
            }
        />
    );
}

function RowSelecter({ row }: RowSelecterProps) {
    return (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
        />
    );
}

function RowExpander({ row }: RowExpanderProps) {
    return row.getCanExpand() ? (
        <Button variant="ghost" onClick={row.getToggleExpandedHandler()}>
            {row.getIsExpanded() ? (
                <ChevronDown className="w-5 h-5" />
            ) : (
                <ChevronRight className="w-5 h-5" />
            )}
        </Button>
    ) : null;
}

export { HeaderSelecter, RowSelecter, RowExpander };
