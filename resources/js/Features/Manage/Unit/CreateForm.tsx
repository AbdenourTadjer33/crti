import React from "react";

import {
    useForm,
    setDataByObject,
    setDataByMethod,
    setDataByKeyValuePair,
} from "@/Libs/useForm";
import { Step, Stepper, useStepper } from "@/Components/Stepper";
import { Button } from "@/Components/ui/button";
import { FormWrapper } from "@/Components/ui/form";
import { UnitInformationForm } from "@/Features/Manage/Unit/UnitInformationForm";
import { UnitDivisionsForm } from "@/Features/Manage/Unit/UnitDivisionsForm";
import UnitInfrastructureForm from "./UnitInfrastructureForm";
import { Heading } from "@/Components/ui/heading";
import { User } from "@/types";

export interface UnitForm {
    name: string;
    abbr: string;
    description: string;
    divisions: DivisionForm[];
    infrastructures: InfrastructureForm[];
}

export interface DivisionForm {
    name: string;
    abbr: string;
    description: string;
    members: MemberForm[];
    valid?: true;
}

export interface MemberForm extends User {
    grade: string;
}

export interface InfrastructureForm {
    name: string;
    state: string;
    description: string;
    valid?: boolean;
}

export const CreateUnitContext = React.createContext<{
    data: UnitForm;
    errors: Partial<Record<keyof UnitForm | string, string>>;
    processing: boolean;
    validating: boolean;
    setData: setDataByObject<UnitForm> &
        setDataByMethod<UnitForm> &
        setDataByKeyValuePair<UnitForm>;
    validate: (...fields: (keyof UnitForm | string)[]) => void;
    clearErrors: (...fields: (keyof UnitForm)[]) => void;
}>({
    data: {
        name: "",
        description: "",
        abbr: "",
        divisions: [],
        infrastructures: [],
    },
    errors: {},
    setData: () => {},
    validate: () => {},
    clearErrors: () => {},
    validating: false,
    processing: false,
});

const CreateForm = () => {
    const {
        data,
        setData,
        errors,
        processing,
        validate,
        post,
        validating,
        clearErrors,
    } = useForm<UnitForm>(route("manage.unit.store"), "post", {
        name: "",
        abbr: "",
        description: "",
        divisions: [],
        infrastructures: [],
    });

    const steps: Step[] = [
        {
            label: "Informations de l'unité",
            form: <UnitInformationForm />,
            isError: !!(errors.name || errors.description || errors.abbr),
        },
        {
            label: "Informations des divisions",
            form: <UnitDivisionsForm />,
            isError: Object.keys(errors).some((key) =>
                key.startsWith("divisions")
            ),
        },
        {
            label: "Infrastructure de l'unité",
            form: <UnitInfrastructureForm />,
            isError: Object.keys(errors).some((key) =>
                key.startsWith("infrastructures")
            ),
        },
        {
            label: "Confirmation",
            form: ({ isError }) => (
                <div>
                    <Heading level={4}>Confirmation step</Heading>
                    <pre>{JSON.stringify({ data, errors }, null, 2)}</pre>
                </div>
            ),
            isError: !!Object.keys(errors).length,
        },
    ];

    const stepper = useStepper({ steps });

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("manage.unit.store", {}), {
            preserveScroll: true,
        });
    };

    return (
        <FormWrapper className="space-y-4 md:space-y-8">
            <CreateUnitContext.Provider
                value={{
                    data,
                    setData,
                    errors,
                    validate,
                    clearErrors,
                    processing,
                    validating,
                }}
            >
                <Stepper stepper={stepper} />

                <pre>
                    {JSON.stringify(data, null, 2)}
                </pre>

                <div className="mx-auto max-w-lg flex items-center gap-4">
                    {stepper.canGoPrev && (
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full"
                            onClick={() => stepper.prev()}
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
                        >
                            Suivant
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            onClick={submitHandler}
                        >
                            Créer
                        </Button>
                    )}
                </div>
            </CreateUnitContext.Provider>
        </FormWrapper>
    );
};

export default CreateForm;
