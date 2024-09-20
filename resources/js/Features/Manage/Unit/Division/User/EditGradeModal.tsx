import React from "react";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { User } from "@/types";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { getInitials } from "@/Utils/helper";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/Components/ui/select";
import { useForm } from "@inertiajs/react";
import { SelectValue } from "@radix-ui/react-select";
import { InputError } from "@/Components/ui/input-error";

export interface Member {
    id: number;
    uuid: string;
    name: string;
    division: {
        grade: string;
        addedAt: string;
    };
}

interface EditGradeModalProps {
    open: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    user: User;
}

const EditGradeModal: React.FC<EditGradeModalProps> = ({
    open,
    onOpenChange,
    user,
    grades,
}) => {
    const { data, setData, post, errors, setError } = useForm({
        grade: String(user.grade?.id),
    });

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        if (data.grade === user.grade?.id) {
            setError("grade", "Vous avez rien modifier");
            return;
        }

        const endpoint = route("manage.unit.division.edit.grade", {
            unit: route().params.unit,
            division: route().params.division,
            user: user.uuid,
        });

        post(endpoint, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => onOpenChange(false)
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="space-y-4 max-w-screen-sm">
                <DialogHeader>
                    <DialogTitle>
                        Mettre à jour le grade du <strong>{user.name}</strong>
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex gap-4 items-start p-2">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarFallback>
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium leading-none">
                                {user.name}
                            </p>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    <div className="ml-auto space-y-1">
                        <Select
                            value={data.grade}
                            onValueChange={(value) => setData("grade", value)}
                        >
                            <SelectTrigger className="w-full max-w-xs min-w-[20rem]">
                                <SelectValue placeholder="Sélectionner un grade" />
                            </SelectTrigger>
                            <SelectContent>
                                {grades &&
                                    grades?.map((grade, idx) => (
                                        <SelectItem
                                            key={idx}
                                            value={String(grade.id)}
                                        >
                                            {grade?.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>

                        <InputError message={errors.grade} />
                    </div>
                </div>
                <form onSubmit={submitHandler}>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => onOpenChange(false)}
                        >
                            Annuler
                        </Button>
                        <Button variant="primary">Mettre à jour</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditGradeModal;
