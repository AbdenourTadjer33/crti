import React from "react";
import { Link, router } from "@inertiajs/react";
import { createColumnHelper } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Delete, Edit, Info, MoreHorizontal } from "lucide-react";
import { Role } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    HeaderSelecter,
    RowExpander,
    RowSelecter,
} from "@/Components/common/data-table";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

const columnHelper = createColumnHelper<Role>();

export const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({ table }) => <HeaderSelecter table={table} />,
        cell: ({ row }) => <RowSelecter row={row} />,
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.display({
        id: "expander",
        cell: ({ row }) => <RowExpander row={row} />,
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.accessor("id", {
        header: "id",
    }),

    columnHelper.accessor("name", {
        header: "role",
    }),

    columnHelper.accessor("description", {
        header: "description",
        cell: ({ getValue }) => <p>{getValue()}</p>,
    }),

    columnHelper.accessor("permissions", {
        header: "Permissions",
        cell: ({ getValue }) => <>{getValue()?.length}</>,
    }),

    columnHelper.accessor("createdAt", {
        header: "créer le",
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

    columnHelper.accessor("updatedAt", {
        header: "modifier le",
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
        id: "Actions",
        cell: ({ row }) => {
            return <Actions id={row.id} />;
        },
        enableHiding: false,
    }),
];

const Actions = ({ id }: { id: string }) => {
    const [beforeDeleteModal, setBeforeDeleteModal] = React.useState(false);

    const deleteHandler = () => {
        router.delete(route("manage.role.destroy", { role: id }), {
            preserveScroll: true,
            preserveState: true,
            only: ["flash", "roles"],
            onSuccess: () => setBeforeDeleteModal(false),
        });
    };
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 p-0">
                        <MoreHorizontal className="w-5 h-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    loop
                >
                    <DropdownMenuItem asChild>
                        <Link href={route("manage.role.edit", { role: id })}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setBeforeDeleteModal(true)}
                    >
                        <Delete className="w-4 h-4 mr-2 text-red-500 dark:text-red-600" />
                        Supprimer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
                open={beforeDeleteModal}
                onOpenChange={setBeforeDeleteModal}
            >
                <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className="inline-flex items-center gap-2">
                            <Info className="w-6 h-6 text-red-500 dark:text-red-600" />
                            Etes-vous absolument sûr?
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        Cette action ne peut pas être annulée. Cela sera
                        définitivement supprimez cette permission.
                    </DialogDescription>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            onClick={(e) => setBeforeDeleteModal(false)}
                        >
                            Annuler
                        </Button>
                        <Button variant="destructive" onClick={deleteHandler}>
                            Supprimer
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};
