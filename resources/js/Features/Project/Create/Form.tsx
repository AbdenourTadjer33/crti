import React from "react";
import { Stepper, useStepper } from "@/Components/Stepper";
import { Button } from "@/Components/ui/button";
import { FormWrapper } from "@/Components/ui/form";
import { useForm } from "@inertiajs/react";
import {
    setDataByKeyValuePair,
    setDataByMethod,
    setDataByObject,
} from "@/types/form";
import IdentificationForm from "./IdentificationForm";
import { DateRange } from "react-day-picker";
import MemberForm from "./MemberForm";
import ResourceForm from "./ResourceForm";
import TaskForm from "./TaskForm";

export interface ProjectForm {
    name: string;
    nature: string;
    domain: string[];
    timeline: DateRange | undefined;
    description: string;
    objectives: string;
    methodology: string;
    partner: { name?: string; resource?: [] };
    members: MemberForm[];
    materials: MaterialForm[];
    tasks: TaskForm[];
    rawMaterial: [];
}

export interface MemberForm {
    uuid: string;
    fullName?: string;
    unit?: string;
    division?: string;
    grade?: string;
    diplome?: string;
}

export interface MaterialForm {
    nature: string;
    observation: string;
    state: string;
    location: string;
}

export interface TaskForm {
    [x: string]: any;
    name: string;
    description: string;
    timeline: DateRange | undefined;
}

export const CreateProjectContext = React.createContext<{
    data: ProjectForm;
    setData: setDataByObject<ProjectForm> &
        setDataByKeyValuePair<ProjectForm> &
        setDataByMethod<ProjectForm>;
    errors: Partial<Record<keyof ProjectForm | string, string>>;
    processing: boolean;
    clearErrors: (...fields: (keyof ProjectForm)[]) => void;
}>({
    data: {
        name: "",
        nature: "",
        domain: [],
        timeline: undefined,
        description: "",
        objectives: "",
        methodology: "",
        partner: {
            name: "",
            resource: [],
        },
        members: [],
        materials: [],
        tasks: [],
        rawMaterial: [],
    },
    errors: {},
    processing: false,
    setData: () => {},
    clearErrors: () => {},
});

const Form = () => {
    const { data, setData, errors, clearErrors, processing } =
        useForm<ProjectForm>({
            name: "",
            nature: "",
            domain: [],
            timeline: undefined,
            description: "",
            objectives: "",
            methodology: "",
            partner: {},
            members: [],
            materials: [],
            tasks: [],
            rawMaterial: [],
        });

    const stepper = useStepper({
        steps: [
            {
                label: "Identification de projet",
                form: <IdentificationForm />,
            },
            {
                label: "Membres de l'équipe",
                form: <MemberForm />,
            },
            {
                label: "Ressources nécessaires",
                form: <ResourceForm />,
            },
            {
                label: "Orgnisation des travaux",
                form: <TaskForm />,
            },
            // {
            //     label: "Confirmation",
            //     form: <Confirmation />
            // }
        ],
        state: {
            initial: 3,
        },
    });

    const submitHandler = (e: React.FormEvent) => {};

    return (
        <FormWrapper className="space-y-4 md:space-y-8">
            <CreateProjectContext.Provider
                value={{ data, setData, errors, clearErrors, processing }}
            >
                <Stepper {...{ stepper }} />

                <div className="mx-auto max-w-lg flex items-center gap-4">
                    {stepper.canGoPrev && (
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full"
                            onClick={() => stepper.prev()}
                            disabled={processing}
                        >
                            Précendant
                        </Button>
                    )}
                    {stepper.canGoNext ? (
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full"
                            onClick={() => stepper.next()}
                            disabled={processing}
                        >
                            Suivant
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            onClick={submitHandler}
                            disabled={processing}
                        >
                            Créer
                        </Button>
                    )}
                </div>

                <pre>{JSON.stringify(data, null, 2)}</pre>
            </CreateProjectContext.Provider>
        </FormWrapper>
    );
};

const Task = () => {
    return <>Task</>;
};

const Confirmation = () => {
    return <></>;
};

export default Form;
