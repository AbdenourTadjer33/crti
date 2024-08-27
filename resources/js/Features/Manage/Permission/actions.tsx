import React from "react";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

import { Delete, Edit, Info, MoreHorizontal } from "lucide-react";
import { router } from "@inertiajs/react";

export default function ({ row }) {
    const [deleteModal, setDeleteModal] = React.useState(false);

    function deleteHandler() {
        router.delete(
            route("manage.permission.destroy", { permission: row.id }),
            {
                preserveScroll: true,
                preserveState: true,
                only: ["errors", "flash", "permissions"],
                onSuccess: () => setDeleteModal(false),
            }
        );
    }

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
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={setDeleteModal}>
                        <Delete className="w-4 h-4 text-red-500 dark:text-red-600 mr-2" />
                        Supprimé
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
                <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle className="inline-flex items-center gap-2">
                            <Info className="w-6 h-6 text-red-600 dark:text-red-700" />
                            Etes-vous absolument sûr?
                        </DialogTitle>
                        <DialogDescription>
                            Cette action ne peut pas être annulée. Cela sera
                            définitivement supprimez cette permission.
                        </DialogDescription>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant={"secondary"}
                                onClick={() => setDeleteModal(false)}
                            >
                                Annuler
                            </Button>
                            <Button
                                variant={"destructive"}
                                onClick={deleteHandler}
                            >
                                Supprimer
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
}
