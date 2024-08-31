import { Button } from "@/Components/ui/button";
import { InputError } from "@/Components/ui/input-error";
import { Label } from "@/Components/ui/label";
import * as Select  from "@/Components/ui/select";
import { X } from "lucide-react";

const MemberList = ({idx, member, errors, removeMember, setGrade, grades }) => {
    return (
        <div className="flex items-center justify-between gap-4">
            <div className="space-y-1 basis-3/4">
                <Label required>{member.name}</Label>

                <Select.Select
                    value={member.grade}
                    onValueChange={(g) => setGrade(g)}
                >
                    <Select.SelectTrigger className="">
                        {member.grade
                            ? grades.find((g) => g.id == member.grade)?.name
                            : "Séléctionner un grade"}
                    </Select.SelectTrigger>
                    <Select.SelectContent>
                        {grades.map((grade) => (
                            <Select.SelectItem
                                key={grade.id}
                                value={String(grade.id)}
                            >
                                {grade.name}
                            </Select.SelectItem>
                        ))}
                    </Select.SelectContent>
                </Select.Select>

                <InputError message={errors[`members.${idx}.grade`]} />
            </div>

            <Button variant="ghost" size="sm" onClick={removeMember}>
                <X className="h-5 w-5" />
            </Button>
        </div>
    );
};

export default MemberList;
