import React from "react";
import { router, useForm } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import { useValidation } from "@/Libs/Validation";
import { ProjectForm } from "@/types/form";
import { CreateProjectContext } from "@/Contexts/Project/create-project-context";
import { useStepper } from "@/Components/ui/stepper";
import Stepper from "@/Components/common/stepper";
import { FormWrapper } from "@/Components/ui/form";
import { syncProjectVersion } from "@/Services/api/projects";
import { useUser } from "@/Hooks/use-user";
import { useDebounce } from "@/Hooks/use-debounce";
import { useUpdateEffect } from "@/Hooks/use-update-effect";
import IdentificationForm from "./IdentificationStep";
import MemberForm from "./MemberStep";
import ResourceForm from "./ResourceStep";
import TasksStep from "./TaskStep";
import ConfirmationStep from "./ConfirmationStep";

type Data = Omit<ProjectForm, "creator">;

interface FormProps {
    versionId: string;
    version?: Data;
    params?: Partial<{
        currentStep: number;
        errors: Record<number, true>;
        success: Record<number, true>;
    }>;
}

const Form: React.FC<FormProps> = ({ versionId, version, params }) => {
    const projectId = React.useMemo(() => route().params.project as string, []);
    const {
        data,
        setData,
        errors,
        clearErrors,
        processing,
        setError,
        isDirty,
    } = useForm<Data>(
        version ?? {
            name: "",
            nature: "",
            domains: [],
            timeline: { from: undefined, to: undefined },
            description: "",
            goals: "",
            methodology: "",
            is_partner: false,
            partner: {
                organisation: "",
                sector: "",
                contact_name: "",
                contact_post: "",
                contact_email: "",
                contact_phone: "",
            },
            deliverables: [],
            estimated_amount: "",
            members: [useUser("uuid", "name", "email")],
            resources: [],
            resources_crti: [],
            resources_partner: [],
            tasks: [],
        }
    );

    const { validate, validating } = useValidation({
        url: route("project.version.store", projectId),
        method: "post",
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
                content: (props) => <TasksStep {...props} />,
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
                    project: projectId,
                    version: versionId,
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
        <FormWrapper className="space-y-4 sm:space-y-6">
            <CreateProjectContext.Provider
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
            </CreateProjectContext.Provider>
        </FormWrapper>
    );
};

export default Form;
