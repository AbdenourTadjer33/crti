import React from "react";
import {Link, router} from "@inertiajs/react";
import {createColumnHelper} from "@tanstack/react-table";
import {Checkbox} from "@/Components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {Button} from "@/Components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import dayjs from "dayjs";
import {MoreHorizontal} from "lucide-react";
import {Role} from "@/types";
import {
    MdDelete,
    MdEdit,
    MdKeyboardArrowDown,
    MdKeyboardArrowRight,
} from "react-icons/md";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {FaInfoCircle} from "react-icons/fa";
import {route} from "@/Utils/helper";

const columnHelper = createColumnHelper<Role>();

export const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.display({
        id: "expander",
        cell: ({row}) => {
            return row.getCanExpand() ? (
                <Button
                    variant={"ghost"}
                    onClick={row.getToggleExpandedHandler()}
                >
                    {row.getIsExpanded() ? (
                        <MdKeyboardArrowDown className="w-5 h-5"/>
                    ) : (
                        <MdKeyboardArrowRight className="w-5 h-5"/>
                    )}
                </Button>
            ) : null
        },
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
        cell: ({getValue}) => <p>{getValue()}</p>,
    }),

    columnHelper.accessor("permissions", {
        header: "Permissions",
        cell: ({getValue}) => <>{getValue()?.length}</>,
    }),

    columnHelper.accessor("createdAt", {
        header: "créer le",
        cell: ({getValue}) => {
            const datetime = dayjs(getValue());
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>{datetime.fromNow()}</TooltipTrigger>
                        <TooltipContent>
                            <p>{datetime.format("DD-MM-YYYY HH:mm:ss")}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    }),

    columnHelper.accessor("updatedAt", {
        header: "modifier le",
        cell: ({getValue}) => {
            const datetime = dayjs(getValue());
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>{datetime.fromNow()}</TooltipTrigger>
                        <TooltipContent>
                            <p>{datetime.format("DD-MM-YYYY HH:mm:ss")}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    }),

    columnHelper.display({
        id: "Actions",
        cell: ({row}) => {
            return <Actions id={row.id}/>;
        },
        enableHiding: false,
    }),
];

const Actions = ({id}: { id: string }) => {
    const [beforeDeleteModal, setBeforeDeleteModal] = React.useState(false);

    const deleteHandler = () => {
        router.delete(route("manage.role.destroy", {role: id}), {
            preserveScroll: true,
            preserveState: true,
            only: ["flash", "roles"],
        });
    };
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 p-0">
                        <MoreHorizontal className="w-5 h-5"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    loop
                >
                    <DropdownMenuItem asChild>
                        <Link href={route("manage.role.edit", {role: id})}>
                            <MdEdit className="w-4 h-4 mr-2"/>
                            Modifier
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        onClick={() => setBeforeDeleteModal(true)}
                    >
                        <MdDelete className="w-4 h-4 mr-2 text-red-500 dark:text-red-600"/>
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
                            <FaInfoCircle className="w-6 h-6 text-red-500 dark:text-red-600"/>
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
