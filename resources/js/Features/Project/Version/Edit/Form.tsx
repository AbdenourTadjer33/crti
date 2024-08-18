import React from "react";
import { useForm } from "@inertiajs/react";
import { FormWrapper } from "@/Components/ui/form";
import { Stepper, useStepper } from "@/Components/Stepper";
import { EditProjectContext } from "@/Contexts/Project/edit-project-context";
import IdentificationStep from "./IdentificationStep";
import MemberStep from "./MemberStep";
import TaskStep from "./TaskStep";
import ConfirmationStep from "./ConfirmationStep";
import { useValidation } from "@/Libs/Validation";
import { ProjectForm } from "@/types/form";

interface FormProps {
    version: ProjectForm;
    params: any;
}

const Form: React.FC<FormProps> = ({ version, params }) => {
    const { data, setData, errors, setError, clearErrors, processing, put } =
        useForm<ProjectForm>({
            name: version.name,
            nature: version.nature,
            domains: version.domains,
            timeline: version.timeline,
            description: version.description,
            goals: version.goals,
            methodology: version.methodology,
            is_partner: version.is_partner,
            partner: version.partner,
            creator: version.creator,
            members: version.members,
            resources: [],
            resources_crti: [],
            resources_partner: [],
            tasks: version.tasks,
        });

    const { validate, validating } = useValidation({
        url: route("project.version.update", {
            project: route().params.project,
            version: route().params.version,
        }),
        method: "post",
        data,
        onError: (errors) => setError(errors),
    });

    const stepper = useStepper({
        steps: [
            {
                label: "Identification de projet",
                form: (props) => <IdentificationStep {...props} />,
            },
            {
                label: "Members de l'équipe",
                form: (props) => <MemberStep {...props} />,
            },
            {
                label: "Ressources nécessaires",
                form: (props) => <></>,
            },
            {
                label: "Orgnisation des travaux",
                form: (props) => <TaskStep {...props} />,
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
                    setData,
                    errors,
                    clearErrors: clearErrors as any,
                    processing: processing || validating,
                    setError,
                    validate,
                }}
            >
                <Stepper {...{ stepper }} />
                {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
            </EditProjectContext.Provider>
        </FormWrapper>
    );
};

export default Form;
