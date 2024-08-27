import * as React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { Board } from "@/types";
import { HeaderSelecter, RowSelecter } from "@/Components/common/data-table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import dayjs from "dayjs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import {
    ArrowRightCircle,
    Info,
    MoreHorizontal,
    Pencil,
    SquareArrowOutUpRight,
    Trash,
} from "lucide-react";
import { Link, router } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

const columnHelper = createColumnHelper<Board>();

export const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({ table }) => <HeaderSelecter table={table} />,
        cell: ({ row }) => <RowSelecter row={row} />,
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.accessor("id", {
        header: "id",
    }),

    columnHelper.display({
        id: "board",
        header: "conseil",
        cell: ({ row }) => (
            <Link
                href={route("manage.board.show", row.id)}
                className="inline-flex items-center hover:text-blue-600 duration-100"
            >
                {row.original.name}{" "}
                <SquareArrowOutUpRight className="h-4 w-4 ml-1.5" />
            </Link>
        ),
    }),

    columnHelper.display({
        header: "president",
        cell: ({ row }) => (
            <Link
                href={route("manage.user.show",  row.original.president.id)}
                className="inline-flex items-center hover:text-blue-600 duration-100"
            >
                {row.original.president.name}{" "}
                <SquareArrowOutUpRight className="h-4 w-4 ml-1.5" />
            </Link>
        ),
    }),

    columnHelper.accessor("project.name", {
        header: "project",
        cell: ({ row }) => (
            <Link
            href={route("project.show", row.original.project.code )}
            className="inline-flex items-center hover:text-blue-600 duration-100"
            >
                {row.original.project.name}{" "}
                <SquareArrowOutUpRight className="h-4 w-4 ml-1.5" />
            </Link>
        ),
    }),

    columnHelper.accessor("userCount", {
        header: "membre",
    }),


    columnHelper.accessor("createdAt", {
        header: "créer",
        cell: ({ getValue }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        {dayjs(getValue()).fromNow()}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{dayjs(getValue()).format("DD-MM-YYYY HH:mm:ss")}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
    }),

    columnHelper.accessor("updatedAt", {
        header: "modifier",
        cell: ({ getValue }) => (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        {dayjs(getValue()).fromNow()}
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{dayjs(getValue()).format("DD-MM-YYYY HH:mm:ss")}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        ),
    }),

    columnHelper.display({
        id: "actions",
        cell: ({ row }) => <Actions id={row.id} />,
        enableHiding: false,
    }),
];

const Actions = ({ id }: { id: string }) => {
    const [beforeDeleteModal, setBeforeDeleteModal] =
        React.useState<boolean>(false);

    const deleteHandler = () => {
        router.delete(route("manage.board.destroy", { board: id }), {
            preserveScroll: true,
            preserveState: true,
            only: ["flash", "boards"],
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
                    <DropdownMenuItem asChild>
                        <Link href={route("manage.board.show", { board: id })}>
                            <ArrowRightCircle className="w-4 h-4 mr-2" />
                            Voir
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={route("manage.board.edit", { board: id })}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Modifier
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setBeforeDeleteModal(true)}
                    >
                        <Trash className="w-4 h-4 mr-2 text-red-500 dark:text-red-600" />
                        Supprimer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog
                open={beforeDeleteModal}
                onOpenChange={setBeforeDeleteModal}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="inline-flex items-center gap-2">
                            <Info className="w-6 h-6 text-red-500 dark:text-red-600" />
                            Etes-vous absolument sùr?
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>

                    </DialogDescription>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => setBeforeDeleteModal(false)}
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
