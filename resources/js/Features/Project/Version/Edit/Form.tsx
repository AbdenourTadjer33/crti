import React from "react";
import { useForm } from "@inertiajs/react";
import { FormWrapper } from "@/Components/ui/form";
import { Stepper, useStepper } from "@/Components/Stepper";
import { EditProjectContext } from "@/Contexts/Project/edit-project-context";

import IdentificationForm from "./IdentificationStep";
import MemberForm from "./MemberStep";
import TaskForm from "./TaskStep";
import ConfirmationStep from "./ConfirmationStep";

const Form: React.FC<any> = ({ version }) => {
    const { data, setData, errors, clearErrors, processing, setError, put } =
        useForm({
            name: version.name,
            nature: version.nature,
            domains: version.domains,
            timeline: version.timeline,
            description: version.description,
            goals: version.goals,
            methodology: version.methodology,
            is_partner: version.is_partner,
            partner: version.partner,
            members: version.members,
            resources: [],
            resources_crti: [],
            resources_partner: [],
            tasks: version.tasks,
        });

    const stepper = useStepper({
        steps: [
            {
                label: "Identification de projet",
                form: (props) => <IdentificationForm {...props} />,
            },
            {
                label: "Membres de l'équipe",
                form: (props) => <MemberForm {...props} />,
            },
            {
                label: "Ressources nécessaires",
                form: () => <></>,
            },
            {
                label: "Orgnisation des travaux",
                form: (props) => <TaskForm {...props} />,
            },
            {
                label: "Confirmation",
                form: (props) => <ConfirmationStep {...props} />,
            },
        ],
    });

    return (
        <FormWrapper className="space-y-4 md:space-y-8">
            <EditProjectContext.Provider
                value={{
                    data,
                    // @ts-expect-error
                    setData,
                    errors,
                    // @ts-expect-error
                    clearErrors,
                    processing,
                    setError,
                    put,
                }}
            >
                <Stepper {...{ stepper }} />
            </EditProjectContext.Provider>
        </FormWrapper>
    );
};

export default Form;
