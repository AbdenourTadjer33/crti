import React, { useState } from "react";
import { Button } from "@/Components/ui/button";

import {
    setDataByKeyValuePair,
    setDataByMethod,
    setDataByObject,
    useForm,
} from "@/Libs/useForm";
import { Stepper, useStepper } from "@/Components/Stepper";
import { FormWrapper } from "@/Components/ui/form";
import Identification from "./IdentificationForm";
import { route } from "@/Utils/helper";
import MemberForm from "./MemberForm";
import MaterialForm from "./MaterialForm";
import TaskForm from "./TaskForm";
import Canvas from "./Canvas";
import { Users } from "lucide-react";

export interface ProjectForm {
    name: string;
    nature: string;
    domaine: string;
    start: string;
    end: string;
    description: string;
    objectif: string;
    methodologie: string;
    isPartner: boolean;
    partner: string;
    members: MemberForm[];
    materials: MaterialForm[];
    tasks: TaskForm[];
    rawMaterial: []
    partnerRawMaterial: []
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
    name: string;
    start: string;
    end: string;
    description: string
}

export const CreateProjectContext = React.createContext<{
    data: ProjectForm;
    setData: setDataByObject<ProjectForm> &
        setDataByMethod<ProjectForm> &
        setDataByKeyValuePair<ProjectForm>;
    errors: Partial<Record<keyof ProjectForm | string, string>>;
}>({
    data: {
        name: "",
        nature: "",
        domaine: "",
        start: "",
        end: "",
        description: "",
        objectif: "",
        methodologie: "",
        isPartner: false,
        partner: "",
        members: [],
        materials:[],
        tasks: []
    },
    setData: () => {},
    errors: {},
});

const CreateForm = () => {
    const { data, setData, post, validate, errors, processing, validating } =
        useForm(route("project.store"), "post", {
            name: "",
            nature: "",
            domaine: "",
            start: "",
            end: "",
            description: "",
            objectif: "",
            methodologie: "",
            isPartner: false,
            partner: "",
            members: [],
            materials: [],
            tasks: []
        });

    const steps = [
        {
            label: "Identification",
            form: <Identification />,
        },
        {
            label: "Membres",
            form: <MemberForm />,
        },
        {
            label: "materiel existant",
            form: <MaterialForm />,
        },
        {
            label: "Organisation des travaux",
            form: <TaskForm />
        },
        {
            label: "Confirmation",
            form:   <Canvas />
        }
    ];

    const stepper = useStepper({ steps });

    return (
        <FormWrapper className="space-y-4 md:space-y-8">
            <CreateProjectContext.Provider value={{ data, setData, errors }}>
                <Stepper stepper={stepper} />
                <pre>{JSON.stringify({ data, errors }, null, 2)}</pre>
                <div className="mx-auto max-w-lg flex items-center gap-4">
                    {stepper.canGoPrev && [
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => stepper.prev()}
                        >
                            Précendent
                        </Button>,
                    ]}
                    {stepper.canGoNext ? (
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => stepper.next()}
                        >
                            Suivant
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                        >
                            Créer
                        </Button>
                    )}
                </div>
            </CreateProjectContext.Provider>
        </FormWrapper>
    );

};

export default CreateForm;
