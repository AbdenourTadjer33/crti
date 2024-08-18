import React from "react";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    Dialog,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { useForm } from "@inertiajs/react";

interface EditGradeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currentGrade: string;
    unitId: number;
    divisionId: number;
}

const EditGradeDialog: React.FC<EditGradeDialogProps> = ({
    isOpen,
    onClose,
    currentGrade,
    unitId,
    divisionId,
}) => {
    const { data, setData, put, errors } = useForm({
        grade: currentGrade,
    });

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        put(
            route("manage.unit.division.update", {
                unit: unitId,
                division: divisionId,
            }),
            {
                data: { grade: data.grade },
                onSuccess: () => {
                    onClose(); // Fermer le dialogue après la mise à jour réussie
                    // Vous pouvez également déclencher une notification de succès ici
                },
                preserveScroll: true,
                preserveState: true,
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier le Grade</DialogTitle>
                    <DialogDescription>
                        Entrez le nouveau grade pour l'utilisateur.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submitHandler}>
                    <Input
                        value={data.grade}
                        onChange={(e) => setData('grade', e.target.value)}
                        placeholder="Entrez le nouveau grade"
                    />
                    <DialogFooter>
                        <Button type="submit">Enregistrer</Button>
                        <DialogClose asChild>
                            <Button variant="secondary">Annuler</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditGradeDialog;
