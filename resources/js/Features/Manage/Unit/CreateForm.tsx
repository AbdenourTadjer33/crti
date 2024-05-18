import React from "react";
import { route } from "@/Utils/helper";
import {
    useForm,
    setDataByObject,
    setDataByMethod,
    setDataByKeyValuePair,
} from "@/Libs/useForm";
import { Stepper, useStepper } from "@/Components/Stepper";
import { Button } from "@/Components/ui/button";
import { FormWrapper } from "@/Components/ui/form";
import { UnitInformationForm } from "@/Features/Manage/Unit/UnitInformationForm";
import { UnitDivisionsForm } from "@/Features/Manage/Unit/UnitDivisionsForm";

interface UnitForm {
    name: string;
    abbr: string;
    description: string;
    divisions: {
        name: string;
        description: string;
        abbr: string;
        members: { uuid: string; role: string }[];
    }[];
}

export const CreateUnitContext = React.createContext<{
    data: UnitForm;
    setData: setDataByObject<UnitForm> &
        setDataByMethod<UnitForm> &
        setDataByKeyValuePair<UnitForm>;
    errors: Partial<Record<keyof UnitForm | string, string>>;
}>({
    data: {
        name: "",
        description: "",
        abbr: "",
        divisions: [],
    },
    setData: () => {},
    errors: {
        name: "",
        abbr: "",
        description: "",
        divisions: "",
    },
});

const CreateForm = () => {
    const { data, setData, errors, processing, validate, post, validating } =
        useForm<UnitForm>(route("manage.unit.store"), "post", {
            name: "",
            abbr: "",
            description: "",
            divisions: [],
        });


    const steps = [
        {
            label: "Informations de l'unité",
            form: <UnitInformationForm />,
            isError: false,
        },
        {
            label: "Informations des divisions",
            form: <UnitDivisionsForm />,
            isError: false,
        },
        // {
        //     label: "Infrastructure de l'unité",
        //     form: <UnitInfrastructureForm />,
        //     isError: false,
        // },
        // {
        //     label: "Confirmation",
        //     form: <UnitFormConfirmation />,
        //     isError: false,
        //     canNavigate: false,
        // },
    ];

    const stepper = useStepper({ steps });

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("manage.unit.store", {}));
    };

    return (
        <FormWrapper className="space-y-4 md:space-y-8">
            <CreateUnitContext.Provider value={{ data, setData, errors }}>
                <Stepper stepper={stepper} />

                <div className="mx-auto max-w-lg flex items-center gap-4">
                    {stepper.canGoPrev && (
                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full"
                            onClick={() => stepper.prev()}
                        >
                            Précendant
                        </Button>
                    )}
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
                            onClick={submitHandler}
                        >
                            Créer
                        </Button>
                    )}
                </div>

                <pre>{JSON.stringify({ data, errors }, null, 2)}</pre>
            </CreateUnitContext.Provider>
        </FormWrapper>
    );
};

export default CreateForm;
