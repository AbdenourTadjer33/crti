import React, { useState } from "react";
import { FormStepper, Step, Stepper, StepsData, useStepper } from "@/Components/Stepper";
import { setDataByKeyValuePair, setDataByMethod, setDataByObject } from "@/types/form";
import { Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/Components/ui/select";
import { Calendar } from "@/Components/ui/calendar";
import DataTable from "@/Components/DataTable";
import { Textarea } from "@/Components/ui/textarea";
import { RadioItem } from "@radix-ui/react-dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { format } from "date-fns";
import { Value } from "@radix-ui/react-select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/Components/ui/accordion";


export const CreateProjectContest = React.createContext<{
    data: ProjectForm;
    setData: setDataByObject<ProjectForm> &
    setDataByMethod<ProjectForm> &
    setDataByKeyValuePair<ProjectForm>;
    errors: Partial<Record<keyof ProjectForm, string>>;
}>({
    data : {
        name: "",
        description: "",
        members: [],
    },
    setData: () => {},
    errors: {},
});

interface ProjectForm {

}

const CreateForm = () => {
    const { data, setData, errors, clearErrors, post, processing, reset } =
    useForm<ProjectForm>({
        name:"",
        description: "",
        members: [],
    });

    const steps: StepsData = [
        {
            label: "identification",
            form: () => <Identification />,
        },
        {
            label: "Members",
            form: () => <Members />
        },
        {
            label: "Materiels et matieres premiere",
            form: () => <Material />
        },
        {
            label: "Organisation des travaux",
        },
        {
            label: "Confirmation",
            form: () => "canvas"
        }
    ];

    const { stepper, formStepper, step, next, prev, canGoNext, canGoPrev } = useStepper(steps);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        alert("form submited");
        return (
            post(route("manage.project.store"), {
                only: ["errors", "flash"],
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => reset(),
            })
        )
        };

    return (
            <div className=" space-y-8">
                <Stepper stepper={stepper} />
                <form>

                    <FormStepper formStepper={formStepper} step={step} />

                </form>

                <div className=" flex items-center gap-2 max-w-lg mx-auto">
                    {canGoPrev ? (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => prev()}
                            className=" w-full"
                        >
                            Precedent
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="destructive"
                            className=" w-full"
                            asChild
                        >

                        </Button>
                    )}

                    {canGoNext ? (
                        <Button
                            type="button"
                            onClick={() => next()}
                            className=" w-full"
                        >
                        suivant
                        </Button>

                    ) : (
                        <Button
                            type="submit"
                            variant="primary"
                            className=" w-full"
                            onClick={submitHandler}
                        >
                            Créer
                        </Button>
                    )}
                </div>
            </div>
    )

};

const Identification = () => {
    const [projectNature, setProjectNature] = React.useState("");
    const [projectDomaine, setProjectDomaine] = React.useState("");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");


    return (
        <div className=" space-y-5">
            <div className=" space-y-1">

                <Label>Intitulé du projet</Label>
                <Input />
            </div >
            <div className=" space-y-1">
                <Label>Nom et Prénom du porteur</Label>
                <Input />
            </div>

            <div className=" space-y-1">
                <Label>Nature du projet</Label>
                <Select onValueChange={setProjectNature}>
                    <SelectTrigger>
                        <span>{projectNature || "selectionner la nature du projet"}</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="research">Recherche</SelectItem>
                        <SelectItem value="development">developpement</SelectItem>
                        <SelectItem value="innovation">innovation</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className=" space-y-1">
                <Label>Domaine d'application</Label>
                <Select onValueChange={setProjectDomaine}>
                    <SelectTrigger>
                        <span>{projectDomaine ||"selectionner le domaine d'application"}</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="value">value</SelectItem>
                        <SelectItem value="value">value</SelectItem>
                        <SelectItem value="value">value</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className=" space-y-1">
                <div className=" space-y-1">
                    <Label>Date de debut</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Input
                                readOnly
                                value={startDate ? format(startDate, "dd/MM/yyyy") : ""}
                                placeholder="sélectionner une date"
                            />
                        </PopoverTrigger>
                        <PopoverContent>
                            <Calendar />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className=" space-y-1">
                    <Label>Date de fin</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Input
                                readOnly
                                value={endDate ? format(endDate, "dd/mm/yyyy") : ""}
                                placeholder="sélectionner une date"
                            />
                        </PopoverTrigger>
                        <PopoverContent>
                            <Calendar />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className=" space-y-1">
                <Label>Structure de rattachement</Label>
                <Select>
                    <SelectTrigger>
                        <span>selection la structure de rattachement</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="value">1</SelectItem>
                        <SelectItem value="value">1</SelectItem>
                        <SelectItem value="value">1</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <div>
                    <Label>Partenair socio-economique</Label>
                </div>
                <Label>Nom du Partenair socio-economique</Label>
                <Input />
            </div>
            <div className=" space-y-1">
                <Label>Description</Label>
                <Textarea />

            </div>
            <div className=" space-y-1">
                <Label>Objectifs du projet</Label>
                <Input />
            </div>
            <div className=" space-y-1">
                <Label>Methodologie</Label>
                <Textarea />
            </div>
        </div>
    );
}

interface FormMember {
    fullName: string;
    unit: string;
    division: string;
    grade: string;
    diplome: string
}

const Members: React.FC = () => {



    const [member, setMember] = useState<FormMember[]>([]);

    const addMember = () => {
        setMember((pre) => [
            ...pre, {
            fullName: '',
            unit: '',
            division: '',
            grade: '',
            diplome: ''
        },
        ]);
    }

    const handleMember = (
        idx: number,
        field: keyof FormMember,
        value:string) => {
        setMember((pre) => {
            const newMember = [...pre];
            newMember[idx][field] = value;
            return newMember;
        });
    };

    return (
        <div className="">
            <Button
                type="button"
                onClick={addMember}
                >
                    ajouter un membre
            </Button>
            {member.map((member, idx) =>

                <div key={idx} className=" space-y-1">
                    <h1 className=" text-2xl py-3">Membre { idx + 1 }</h1>
                    <div>
                        <Label>Nom et Prénom</Label>
                        <Input
                            onChange={(e) =>
                                handleMember(idx, 'fullName', e.target.value)
                            }
                        />
                    </div>
                    <div>
                        <Label>Organisme de rattachement</Label>
                        <Input
                            onChange={(e) => handleMember(idx, 'unit', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label>Structure de rattachement</Label>
                        <Input onChange={(e) => handleMember(idx, "division",e.target.value)} />
                    </div>
                    <div>
                        <Label>Grade</Label>
                        <Input onChange={(e) => handleMember(idx, "grade",e.target.value)} />
                    </div>
                    <div>
                        <Label>Diplomes</Label>
                        <Input onChange={(e) => handleMember(idx,"diplome", e.target.value)}/>
                    </div>
                </div>
            )}

        </div>

    );
}

function Material () {
    return (
        <div>
            <h1>Materiels existant pour l'execution du projet</h1>
            <div>
                <Label></Label>
            </div>
        </div>
    )
}

export default CreateForm;

