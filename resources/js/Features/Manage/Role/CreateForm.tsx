import React, { useEffect } from "react";
import { route } from "@/Utils/helper";
import { Input, InputError } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { router, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { PermissionContext } from "@/Contexts/Manage/Role/PermissionContext";
import { columnDef } from "../Permission/columns";
import * as TanstackTable from "@tanstack/react-table";
import DataTable from "@/Components/DataTable";
import { TableWraper } from "@/Components/ui/table";
import { MdAdd, MdSearch } from "react-icons/md";

const CreateForm = () => {
    const { permissions } = React.useContext(PermissionContext);
    const finalData = React.useMemo(() => permissions, [permissions]);
    const finalColumnDef = React.useMemo(() => columnDef, []);
    const [filtering, setFiltering] = React.useState("");
    const { data, setData, errors, clearErrors, post, reset, processing } =
        useForm<{
            name: string;
            description: string;
            permissions: number[];
        }>({
            name: "",
            description: "",
            permissions: [],
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
                action: false,
                createdAt: false,
                updatedAt: false,
                Actions: false,
            },
        },
    });

    useEffect(() => {
        const selectedPermissions = Object.keys(
            table.getState().rowSelection
        ).map((item) => Number(item));
        setData("permissions", selectedPermissions);
    }, [table.getState().rowSelection]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("manage.role.store"), {
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
                    autoComplete="off"
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
                        <MdAdd className="w-4 h-4 mr-2" />
                        Ajouter
                    </Button>
                </div>

                <TableWraper className="shadow-none">
                    <div className="flex justify-between items-center py-3 px-4">
                        <div className="relative w-full sm:w-80">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <MdSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <Input
                                placeholder="Search"
                                className="pl-10"
                                value={filtering}
                                onChange={(e) => setFiltering(e.target.value)}
                            />
                        </div>

                        <Button type="button" className="hidden sm:inline-flex">
                            <MdAdd className="w-4 h-4 mr-2" />
                            Ajouter
                        </Button>
                    </div>
                    <DataTable table={table} />
                </TableWraper>
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
                    Créer
                </Button>
            </div>
        </form>
    );
};

export default CreateForm;
