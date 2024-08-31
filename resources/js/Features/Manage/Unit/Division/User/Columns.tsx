import { HeaderSelecter, RowSelecter } from "@/Components/common/data-table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { createColumnHelper } from "@tanstack/react-table";
import { User } from "@/types";
import { MoreHorizontal, Pencil, X, Info } from "lucide-react";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { router } from "@inertiajs/react";
import EditGradeModal from "./EditGradeModal";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/Components/ui/button";

const columnHelper = createColumnHelper<User>();

export const columnDef = [
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
        header: "nom - prenom",
    }),

    columnHelper.accessor("email", {
        header: "e-mail",
    }),

    columnHelper.accessor("division.grade", {
        header: "grade",
    }),

    columnHelper.accessor("division.addedAt", {
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
        cell: ({ row }) => <Actions id={row.id} member={row.original} />,
        enableHiding: false,
    }),
];

interface ActionsProps {
    id: string;
    member: User;
}

const Actions: React.FC<ActionsProps> = ({ id, member }) => {
    const [beforeDeleteModal, setBeforeDeleteModal] =
        React.useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedMember, setSelectedMember] = useState<User | null>(null);

    const deleteHandler = () => {
        router.delete(
            route("manage.unit.division.destroy", { unit: id, division: id }),
            {
                preserveScroll: true,
                preserveState: true,
                only: ["flash", "divisions"],
                onSuccess: () => setBeforeDeleteModal(false),
            }
        );
    };

    const openEditModal = (member: User) => {
        setSelectedMember(member);
        setIsEditModalOpen(true);
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
                    <DropdownMenuItem asChild></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openEditModal(member)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        modifier
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setBeforeDeleteModal(true)}
                    >
                        <X className="w-4 h-4 mr-2 text-red-500 dark:text-red-600" />
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
                        Cette action ne peut pas être annulée. Cela sera
                        définitivement supprimez cette unité.
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

            {selectedMember && (
                <EditGradeModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    member={selectedMember}
                    onSave={(newGrade) => {
                        // Implémentez ici la logique pour sauvegarder le nouveau grade
                        // Exemple: appeler une API pour mettre à jour le grade
                        // axios.put(`/api/members/${selectedMember.uuid}/grade`, { grade: newGrade })
                        //     .then(response => {
                        //         // Traitement de la réponse
                        //     })
                        //     .catch(error => {
                        //         // Traitement des erreurs
                        //     });
                        setIsEditModalOpen(false);
                    }}
                />
            )}
        </>
    );
};
