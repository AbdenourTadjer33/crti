import React from "react";
import {
    getCoreRowModel,
    useReactTable,
    createColumnHelper,
} from "@tanstack/react-table";
import { HeaderSelecter, RowSelecter } from "@/Components/common/data-table";

import { TableWrapper } from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import DataTable from "@/Components/common/data-table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Button } from "@/Components/ui/button";
import { User } from "@/types";
import {
    Plus,
    Search,
    SlidersHorizontal,
    MoreHorizontal,
    Pencil,
    X,
    Info,
} from "lucide-react";
import AddMemberModal from "./AddMemberModal";
import { router, usePage } from "@inertiajs/react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import EditGradeModal from "./EditGradeModal";

const columnHelper = createColumnHelper<User>();

const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({ table }) => <HeaderSelecter table={table} />,
        cell: ({ row }) => <RowSelecter row={row} />,
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.accessor("uuid", {
        header: "id",
    }),

    columnHelper.accessor("name", {
        header: "nom prénom",
    }),

    columnHelper.accessor("email", {
        header: "e-mail",
    }),

    columnHelper.accessor("grade.name", {
        header: "grade",
    }),

    columnHelper.accessor("grade.addedAt", {
        header: "Ajouté le",
        cell: ({ getValue }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        {formatDistanceToNow(getValue()!, {
                            addSuffix: true,
                            locale: fr,
                        })}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>
                            {format(getValue()!, "dd MMM yyy hh:mm", {
                                locale: fr,
                            })}
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
    }),
    columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
            const [beforeDeleteModal, setBeforeDeleteModal] =
                React.useState<boolean>(false);
            const [isEditModalOpen, setIsEditModalOpen] =
                React.useState<boolean>(false);

            const { grades } = usePage<{
                grades?: { id: number; name: string }[];
            }>().props;

            const detachUsers = () => {
                const endpoint = route("manage.unit.division.detach.users", {
                    unit: route().params.unit,
                    division: route().params.division,
                });

                router.visit(endpoint, {
                    method: "post",
                    data: {
                        uuid: row.id,
                    },
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => setBeforeDeleteModal(false),
                });
            };
            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            onCloseAutoFocus={(e) => e.preventDefault()}
                            loop
                        >
                            <DropdownMenuItem
                                onClick={() => {
                                    if (!grades) {
                                        router.reload({
                                            only: ["grades"],
                                        });
                                    }
                                    setIsEditModalOpen(true);
                                }}
                            >
                                <Pencil className="w-4 h-4 mr-2" />
                                Modifier le grade
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setBeforeDeleteModal(true)}
                            >
                                <X className="w-4 h-4 mr-2 text-red-500 dark:text-red-600" />
                                Détacher
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog
                        open={beforeDeleteModal}
                        onOpenChange={setBeforeDeleteModal}
                    >
                        <DialogContent className="space-y-4">
                            <DialogHeader>
                                <DialogTitle className="inline-flex items-center gap-2">
                                    <Info className="shrink-0 w-6 h-6 text-red-500 dark:text-red-600" />
                                    <p>
                                        Êtes-vous absolument sùr de vouloir
                                        détacher{" "}
                                        <strong>{row.original.name}</strong> de
                                        la division ?
                                    </p>
                                </DialogTitle>
                                <DialogDescription>
                                    Cette action ne peut pas être annulée. Cela
                                    sera définitivement supprimez cette unité.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    variant="secondary"
                                    onClick={() => setBeforeDeleteModal(false)}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={detachUsers}
                                >
                                    Détacher
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <EditGradeModal
                        open={isEditModalOpen}
                        onOpenChange={setIsEditModalOpen}
                        user={row.original}
                        grades={grades}
                    />
                </>
            );
        },
        enableHiding: false,
    }),
];

const Table: React.FC<{ users: User[] }> = ({ users }) => {
    const data = React.useMemo(() => users, [users]);
    const columns = React.useMemo(() => columnDef, []);

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const { grades } = usePage<{ grades?: { id: number; name: string }[] }>()
        .props;

    const table = useReactTable({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.uuid,
    });

    return (
        <TableWrapper>
            <div className="p-4 flex justify-between gap-2">
                <div className="relative sm:w-80">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <Input placeholder="Search" className="pl-10" />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        className="sm:flex hidden justify-between gap-2"
                        onClick={() => {
                            if (!grades) {
                                router.reload({
                                    only: ["grades"],
                                });
                            }
                            setIsDialogOpen(true);
                        }}
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter des members
                    </Button>

                    <AddMemberModal
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        grades={grades}
                        users={users}
                    />

                    <DropdownMenu>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost">
                                            <SlidersHorizontal className="ww-5 h-5" />
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
            </div>

            <DataTable
                options={{
                    table,
                }}
            />
        </TableWrapper>
    );
};

export default Table;
