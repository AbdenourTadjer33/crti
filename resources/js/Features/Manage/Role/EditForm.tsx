import React from "react";
import * as TanstackTable from "@tanstack/react-table";
import { PermissionContext } from "@/Contexts/Manage/Role/PermissionContext";
import { columnDef } from "../Permission/columns";
import { router, useForm } from "@inertiajs/react";
import { Role } from "@/types";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { TableWrapper } from "@/Components/ui/table";
import DataTable from "@/Components/common/data-table";
import { Plus, Search } from "lucide-react";

const EditForm = ({ role }: { role: Role }) => {
    const { permissions } = React.useContext(PermissionContext);
    const finalData = React.useMemo(() => permissions, [permissions]);
    const finalColumnDef = React.useMemo(() => columnDef, []);
    const [filtering, setFiltering] = React.useState("");
    const { data, setData, errors, clearErrors, put, reset, processing } =
        useForm<{
            name: string;
            description: string;
            permissions: number[];
        }>({
            name: role.name || "",
            description: role.description || "",
            permissions: role.permissionIds,
        });

    const table = TanstackTable.useReactTable({
        columns: finalColumnDef,
        data: finalData!,
        getCoreRowModel: TanstackTable.getCoreRowModel(),
        getFilteredRowModel: TanstackTable.getFilteredRowModel(),
        getRowId: (row) => row.id,
        onGlobalFilterChange: setFiltering,
        state: {
            globalFilter: filtering,
            columnVisibility: {
                id: false,
                model: false,
                aaction: false,
                createdAt: false,
                updatedAt: false,
                Actions: false,
            },
        },
    });

    React.useEffect(() => {
        const test: { [key: number]: true } = {};
        for (const permission of data.permissions) {
            test[permission] = true;
        }
        table.setRowSelection(() => {
            return test;
        });
    }, []);

    React.useEffect(() => {
        const selectedPermissions = Object.keys(
            table.getState().rowSelection
        ).map((item) => Number(item));
        setData("permissions", selectedPermissions);
    }, [table.getState().rowSelection]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        put(route("manage.role.update", { role: role.id }), {
            only: ["errors", "flash"],
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={submitHandler} className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="name">Role</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => {
                        clearErrors("name");
                        setData("name", e.target.value);
                    }}
                    autoCapitalize="off"
                    autoFocus
                />
                <InputError message={errors.name} />
            </div>
            <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    className="min-h-[60px]"
                    value={data.description}
                    onChange={(e) => {
                        clearErrors("description");
                        setData("description", e.target.value);
                    }}
                />
                <InputError message={errors.description} />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Selectionnez des permissions</Label>
                    <Button type="button" className="sm:hidden">
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter
                    </Button>
                </div>

                <TableWrapper className="shadow-none">
                    <div className="flex justify-between items-center py-3 px-4">
                        <div className="relative w-full sm:w-80">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <Input
                                placeholder="Search"
                                className="pl-10"
                                value={filtering}
                                onChange={(e) => setFiltering(e.target.value)}
                            />
                        </div>

                        <Button type="button" className="hidden sm:inline-flex">
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter
                        </Button>
                    </div>
                    <DataTable options={{ table }} />
                </TableWrapper>
            </div>

            <div className="flex justify-center gap-2">
                <Button
                    type="button"
                    variant="destructive"
                    className="w-full"
                    disabled={processing}
                    onClick={() => router.get(route("manage.role.index"))}
                >
                    Annuler
                </Button>
                <Button
                    variant="primary"
                    className="w-full"
                    disabled={processing}
                >
                    Modifier
                </Button>
            </div>
        </form>
    );
};

export default EditForm;
