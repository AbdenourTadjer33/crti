import React from "react";
import { router, useForm } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useValidation } from "@/Libs/Validation";
import { ProjectForm } from "@/types/form";
import { CreateProjectContext } from "@/Contexts/Project/create-project-context";
import { Stepper, useStepper } from "@/Components/Stepper";
import { FormWrapper } from "@/Components/ui/form";
import { Text } from "@/Components/ui/paragraph";
import { syncProjectVersion } from "@/Services/api/projects";
import { useUser } from "@/Hooks/use-user";
import { useDebounce } from "@/Hooks/use-debounce";
import { useDeleyedPending } from "@/Hooks/use-delayed-pending";
import { useUpdateEffect } from "@/Hooks/use-update-effect";
import IdentificationForm from "./IdentificationStep";
import MemberForm from "./MemberStep";
import ResourceForm from "./ResourceStep";
import TasksStep from "./TaskStep";
import ConfirmationStep from "./ConfirmationStep";

interface FormProps {
    version?: ProjectForm;
    params?: Partial<{
        currentStep: number;
    }>;
}

const Form: React.FC<FormProps> = ({ version, params }) => {
    const projectId = React.useMemo(() => route().params.project as string, []);
    const { data, setData, errors, clearErrors, processing, setError, post } =
        useForm<ProjectForm>(
            `create-first-project-version-${projectId}`,
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
                    name: "",
                    email: "",
                    phone: "",
                },
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
                label: "Identification de projet",
                form: (props) => <IdentificationForm {...props} />,
                isError:
                    !!errors.name ||
                    !!errors.nature ||
                    !!errors.domains ||
                    !!errors.description ||
                    !!errors.goals ||
                    !!errors.methodology,
            },
            {
                label: "Membres de l'équipe",
                form: (props) => <MemberForm {...props} />,
                isError: !!errors.members,
            },
            {
                label: "Ressources nécessaires",
                form: (props) => <ResourceForm {...props} />,
            },
            {
                label: "Orgnisation des travaux",
                form: (props) => <TasksStep {...props} />,
                isError: !!errors.tasks,
            },
            {
                label: "Confirmation",
                form: (props) => <ConfirmationStep {...props} />,
            },
        ],
        state: {
            initial: params?.currentStep ?? 0,
        },
    });

    const debouncedValue = useDebounce(data, 4000);

    const { mutate, isPending } = useMutation<ProjectForm>({
        mutationFn: async () =>
            syncProjectVersion(projectId, {
                data,
                params: { currentStep: stepper.currentStep },
            }),
    });
    const delayPassed = useDeleyedPending(isPending, 150);

    useUpdateEffect(() => mutate(), [debouncedValue]);

    return (
        <>
            <div
                className="fixed top-0 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-gray-950 text-gray-100 rounded shadow-lg flex items-center gap-2 data-[pending=false]:hidden"
                data-pending={isPending && delayPassed}
            >
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <Text className="text-base text-pretty font-medium text-inherit">
                    sauvegarder....
                </Text>
            </div>
            <FormWrapper className="space-y-4 md:space-y-8">
                <CreateProjectContext.Provider
                    value={{
                        data,
                        setData,
                        errors,
                        clearErrors: clearErrors as any,
                        processing: processing || validating,
                        setError,
                        validate,
                        post,
                    }}
                >
                    <Stepper {...{ stepper }} />
                </CreateProjectContext.Provider>
            </FormWrapper>
        </>
    );
};

export default Form;
