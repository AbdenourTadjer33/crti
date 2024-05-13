import DataTable from "@/Components/DataTable";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { columnDef } from "@/Features/Manage/Permission/columns";
import AuthLayout from "@/Layouts/AuthLayout";
import { Permission } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo } from "react";
import { MdAdd, MdKeyboardArrowDown, MdSearch } from "react-icons/md";
import { route } from "@/Utils/helper";
import { Input } from "@/Components/ui/input";

const Index: React.FC<{ permissions: Permission[] }> = ({ permissions }) => {
    const finalData = useMemo(() => permissions, [permissions]);
    const finalColumnDef = useMemo(() => columnDef, []);

    const table = useReactTable({
        columns: finalColumnDef,
        data: finalData,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
    });

    return (
        <AuthLayout>
            <Head title="Gestion de permission" />

            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Heading level={3} className="font-normal">
                            Gestion de role et permission
                        </Heading>

                        <Text>
                            Votre modèle de tableau de bord de gestion d'accées.
                        </Text>
                    </div>

                    <Link href={route("manage.permission.create")}>
                        <Button>
                            <MdAdd className="w-4 h-4 mr-2" />
                            Ajouter
                        </Button>
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 border dark:border-gray-600 relative shadow-lg sm:rounded-lg">
                    <div className="p-4 flex justify-between">
                        <div className="relative sm:w-96">
                            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                <MdSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <Input placeholder="Search" className="pl-10" />
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>
                                    visibilité des colonnes
                                    <MdKeyboardArrowDown className="w-4 h-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                onCloseAutoFocus={(e) => e.preventDefault()}
                                loop
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

                    <DataTable table={table} />

                    <hr className="dark:border-gray-500" />

                    <div className="py-5"></div>
                </div>
            </div>
        </AuthLayout>
    );
};

export default Index;
