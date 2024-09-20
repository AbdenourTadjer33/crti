import React from "react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Pagination as PaginationType, User } from "@/types";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    getCoreRowModel,
    getExpandedRowModel,
    Row,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/Components/ui/button";
import DataTable from "@/Components/common/data-table";
import { TableWrapper } from "@/Components/ui/table";
import { columnDef } from "./columns";
import { SlidersHorizontal, X } from "lucide-react";
import { useLocalStorage } from "@/Hooks/use-local-storage";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { Heading } from "@/Components/ui/heading";
import { useDebounce } from "@/Hooks/use-debounce";
import { useUpdateEffect } from "@/Hooks/use-update-effect";
import SearchInput from "@/Components/common/search-input";
import { Indicator } from "@/Components/ui/indicator";

const Table: React.FC<{ users: PaginationType<User>; newUsers: User[] }> = ({
    users,
    newUsers,
}) => {
    const data = React.useMemo(() => {
        return [...users.data];
    }, [users.data]);
    const [search, setSearch] = React.useState(() => {
        return new URLSearchParams(location.search).get("query") || "";
    });
    const columns = React.useMemo(() => columnDef, []);
    const [columnVisibility, setColumnVisibility] = useLocalStorage(
        "manage-user-table-column-visibility",
        {}
    );
    const searchRef = React.useRef<HTMLInputElement>(null);

    const debounce = useDebounce(search, 500);

    useUpdateEffect(() => {
        router.reload({
            only: ["users"],
            data: { query: search },
        });
    }, [debounce]);

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.uuid,
        getRowCanExpand: () => true,
        getExpandedRowModel: getExpandedRowModel(),
        manualPagination: true,
        state: {
            columnVisibility,
        },
        onColumnVisibilityChange: setColumnVisibility,
    });

    function subComponent({ row }: { row: Row<User> }) {
        return (
            <div className="flex flex-wrap gap-2">
                <pre>{JSON.stringify(row, null, 2)}</pre>;
            </div>
        );
    }

    const reject = (uuid: string) => {
        const endpoint = route("manage.user.destroy", uuid);

        router.visit(endpoint, {
            method: "delete",
        });
    };

    const accept = (uuid: string) => {
        const endpoint = route("manage.user.accept", uuid);

        router.visit(endpoint, {
            method: "post",
        });
    };

    return (
        <TableWrapper>
            {!!newUsers.length && (
                <div className="p-4 space-y-4">
                    <Heading level={4}>Nouveaux utilisateurs</Heading>

                    {newUsers.map((user, idx) => (
                        <div
                            key={idx}
                            className="p-4 bg-gray-100 dark:bg-gray-700 border rounded-md shadow"
                        >
                            <div className="space-y-1.5">
                                <p>
                                    Nom prénom: <strong>{user.name}</strong>
                                </p>
                                <p className="inline-flex items-center gap-1">
                                    Adresse e-mail:{" "}
                                    <strong>{user.email}</strong>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Indicator
                                                    color={user.emailVerified}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {user.emailVerified
                                                    ? "Adresse e-mail verifé"
                                                    : "Adresse e-mail non verifé"}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </p>
                                <p>
                                    Date de naissance:{" "}
                                    <strong>
                                        {format(user.dob!, "dd-MM-yyy")}
                                    </strong>
                                </p>
                                <p>
                                    Sexe: <strong>{user.sex}</strong>
                                </p>
                            </div>

                            <div className="flex justify-between items-end">
                                <p>
                                    Créer le{" "}
                                    <strong>
                                        {format(
                                            user.createdAt!,
                                            "dd-MM-yyy HH:mm"
                                        )}
                                    </strong>
                                </p>

                                <div className="space-x-2">
                                    <Button
                                        variant="destructive"
                                        onClick={() => reject(user.uuid)}
                                    >
                                        Rejter
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => accept(user.uuid)}
                                    >
                                        Accepter
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="p-4 flex justify-between gap-2">
                <div className="flex items-center gap-2">
                    <SearchInput
                        inputRef={searchRef}
                        value={search}
                        onValueChange={setSearch}
                    />

                    {search && (
                        <Button
                            variant="ghost"
                            onClick={() => setSearch("")}
                            className="justify-center gap-0"
                        >
                            <X className="h-4 w-4 md:mr-2 shrink-0" />
                            <span className="hidden md:block">
                                Réinitialiser
                            </span>
                        </Button>
                    )}
                </div>

                <DropdownMenu>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost">
                                        <SlidersHorizontal className="w-5 h-5" />
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

            <DataTable
                options={{
                    table,
                    pagination: { links: users.links, meta: users.meta },
                    subComponent,
                }}
            />
        </TableWrapper>
    );
};

export default Table;
