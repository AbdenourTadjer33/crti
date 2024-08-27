import React from "react";
import { useForm } from "@inertiajs/react";
import { FormWrapper } from "@/Components/ui/form";
import { EditProjectContext } from "@/Contexts/Project/edit-project-context";
import { useValidation } from "@/Libs/Validation";
import { ProjectForm } from "@/types/form";
import { useStepper } from "@/Components/ui/stepper";
import Stepper from "@/Components/common/stepper";
import IdentificationForm from "./IdentificationStep";
import MemberForm from "./MemberStep";
import TaskForm from "./TaskStep";
import ResourceForm from "./ResourceStep";
import ConfirmationStep from "./ConfirmationStep";
import { useDebounce } from "@/Hooks/use-debounce";
import { useMutation } from "@tanstack/react-query";
import { syncProjectVersion } from "@/Services/api/projects";
import { useUpdateEffect } from "@/Hooks/use-update-effect";

interface FormProps {
    version: ProjectForm;
    params?: Partial<{
        currentStep?: number;
        errors?: Record<number, true>;
        success?: Record<number, true>;
    }>;
}

const Form: React.FC<FormProps> = ({ version, params }) => {
    const { data, setData, errors, setError, clearErrors, processing } =
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
            deliverables: version.deliverables,
            estimated_amount: version.estimated_amount,
            creator: version.creator,
            members: version.members,
            resources: [],
            resources_crti: version.resources_crti,
            resources_partner: version.resources_partner,
            tasks: version.tasks,
        });

    const { validate, validating } = useValidation({
        url: route("project.version.update", {
            project: route().params.project,
            version: route().params.version,
        }),
        method: "put",
        data,
        onError: (errors) => setError(errors),
    });

    const stepper = useStepper({
        steps: [
            {
                title: "Identification de projet",
                description: "Définir les détails du projet.",
                content: (props) => <IdentificationForm {...props} />,
            },
            {
                title: "Membres de l'équipe",
                description: "Ajouter les membres du projet.",
                content: (props) => <MemberForm {...props} />,
            },
            {
                title: "Orgnisation des travaux",
                description: "Planifier les tâches à réaliser.",
                content: (props) => <TaskForm {...props} />,
            },
            {
                title: "Ressources nécessaires",
                description: "Lister les ressources requises.",
                content: (props) => <ResourceForm {...props} />,
            },
            {
                title: "Confirmation",
                description: "Vérifier et valider les informations.",
                content: (props) => <ConfirmationStep {...props} />,
            },
        ],
        state: {
            initial: params?.currentStep,
            errors: params?.errors,
            success: params?.success,
        },
    });

    const debouncedValue = useDebounce(
        JSON.stringify({
            data,
            params: {
                currentStep: stepper.currentStep,
                errors: stepper.errors,
                success: stepper.success,
            },
        }),
        2000
    );

    const { mutate } = useMutation<ProjectForm>({
        mutationFn: async () =>
            syncProjectVersion(
                {
                    project: route().params.project,
                    version: route().params.version,
                },
                {
                    data,
                    params: {
                        currentStep: stepper.currentStep,
                        errors: stepper.errors,
                        success: stepper.success,
                    },
                }
            ),
    });

    useUpdateEffect(() => mutate(), [debouncedValue]);

    return (
        <FormWrapper className="space-y-4 md:space-y-6">
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
                <Stepper stepper={stepper} />
            </EditProjectContext.Provider>
        </FormWrapper>
    );
};

export default Form;
