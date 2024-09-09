import React, { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import { useForm } from "@inertiajs/react";
import { FormWrapper } from "@/Components/ui/form";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { isAnyKeyBeginWith } from "@/Libs/Validation/utils";
import { X } from "lucide-react";
import { User } from "@/types";

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
    isOpen: boolean;
    onClose: () => void;
    member: User;
    onSave: (grade: string) => void;
}

const EditGradeModal: React.FC<EditGradeModalProps> = ({
    isOpen,
    onClose,
    member,
    onSave,
}) => {
    const [grade, setGrade] = useState(member.division?.grade || '');
    const [error, setError] = useState<string | null>(null);

    // const handleSave = async () => {
    //     if (!grade.trim()) {
    //       alert("Le grade ne peut pas être vide.");
    //       return;
    //     }

    //     try {
    //       await updateGrade(member.id, grade);
    //       onSave(grade); // Optionnel : si vous voulez mettre à jour l'état parent
    //       onClose(); // Ferme le modal après sauvegarde
    //     } catch (error) {
    //       alert("Une erreur est survenue lors de la mise à jour du grade.");
    //     }
    //   };

    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string[] }>({});
    const handleSave = async () => {
        if (!grade.trim()) {
            alert("Le grade ne peut pas être vide.");
            return;
        }

        const data = {
            grade: grade,
        };

        // try {
        //     await updateGrade(member.id, grade);
        //     onSave(grade);
        //     onClose();
        // } catch (error: any) {
        //     if (error.response && error.response.status === 422) {
        //         setValidationErrors(error.response.data.errors || {});
        //     } else {
        //         alert("Une erreur est survenue lors de la mise à jour du grade.");
        //     }
        // }
    };


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier le grade</DialogTitle>
                </DialogHeader>
                <DialogContent>
                <EditGradeForm
                    grade={grade}
                    onGradeChange={setGrade}
                    name={member.name}
                    onClose={onClose}
                    onSave={handleSave}
                />
                </DialogContent>
                <DialogFooter>


                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

interface EditGradeFormProps {
    name: string;
    grade: string;
    onGradeChange: (grade: string) => void;
    onClose: () => void;
    onSave: () => void;
}

const EditGradeForm: React.FC<EditGradeFormProps> = ({
    name,
    grade,
    onGradeChange,
    onClose,
    onSave
}) => {
    return (
        <FormWrapper className="space-y-4 md:space-y-8">
            <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="justify-start basis-2/5 sm:text-base text-xs"
                    >
                        {name}
                    </Button>
                    <Input
                        placeholder="grade"
                        value={grade}
                        onChange={(e) => {
                            onGradeChange(e.target.value)
                        }}
                    />
                </div>
                <Button variant="destructive" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button onClick={onSave}>Sauvegarder</Button>
            </div>

        </FormWrapper>
    );
};


// const EditGradeForm: React.FC<EditGradeFormProps> = ({ grade, onGradeChange }) => {
//     const { data, setData, errors, processing, put, clearErrors } = useForm({
//         members: [member],
//     });

//     return (
//         <FormWrapper
//             className="space-y-4 md:space-y-8"
//         >
//             <div className="grid grid-cols-3 gap-4">

//             {data.members.map((member: Member, idx: number) => (
//                     <div key={member.uuid} className="flex items-center gap-4">
                        // <Button
                        //     type="button"
                        //     variant="outline"
                        //     className="justify-start basis-2/5 sm:text-base text-xs"
                        // >
                        //     {member.name}
                        // </Button>

//                         <Input
//                             placeholder="grade"
//                             value={member.grade}
//                             onChange={(e) => {
//                                 setData((data) => {
//                                     data.members[idx].grade = e.target.value;
//                                     return { ...data };
//                                 });
//                                 clearErrors(`members.${idx}.grade`);
//                             }}
//                         />
//                     </div>
//                 ))}
//                     </div>

//             {/* <div className="mx-auto max-w-lg flex flex-col-reverse sm:flex-row items-center sm:gap-4 gap-2">
//                 <Button variant="destructive" className="w-full" asChild>
//                     <Link href={route("manage.unit.show", unit.id)}>
//                         Annuler
//                     </Link>
//                 </Button>
//                 <Button disabled={processing} className="w-full">
//                     Sauvegarder
//                 </Button>
//             </div> */}
//         </FormWrapper>
//     );
// };


export default EditGradeModal;
