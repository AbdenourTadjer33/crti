import React from "react";
import { route } from "@/Utils/helper";
import { Link,  useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { CreateDivision } from "./Division/CreateDivision";
import { Division } from "@/types";
import {
    setDataByKeyValuePair,
    setDataByMethod,
    setDataByObject,
} from "@/types/form";
import {
    Stepper,
    FormStepper,
    StepsData,
    useStepper,
} from "@/Components/Stepper";

export const CreateUnitContext = React.createContext<{
    data: UnitForm;
    setData: setDataByObject<UnitForm> &
        setDataByMethod<UnitForm> &
        setDataByKeyValuePair<UnitForm>;
    errors: Partial<Record<keyof UnitForm, string>>;
}>({
    data: {
        name: "",
        description: "",
        divisions: [],
    },
    setData: () => {},
    errors: {},
});

interface UnitForm {
    name: string;
    description: string;
    divisions: Division[];
}

const CreateForm = () => {
    const { data, setData, errors, clearErrors, post, processing, reset } =
        useForm<UnitForm>({
            name: "",
            description: "",
            divisions: [],
        });

    const steps: StepsData = [
        {
            label: "informations de l'unité",
            form: () => <Step1 />,
        },
        {
            label: "information sur les divisions",
            form: () => <CreateDivision />,
        },
        { label: "infrastructure de l'unité", form: () => <Step2 /> },
        { label: "confirmation", form: () => <></> },
    ];

    const { stepper, formStepper, step, next, prev, canGoNext, canGoPrev } =
        useStepper(steps);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        alert("form submited");
        return;
        post(route("manage.unit.store"), {
            only: ["errors", "flash"],
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <CreateUnitContext.Provider value={{ data, setData, errors }}>
            <div className="space-y-8">
                <Stepper stepper={stepper} />

                <form onSubmit={(e: React.FormEvent) => e.preventDefault()}>
                    {formStepper.map((renderForm, idx) => (
                        <React.Fragment key={idx}>
                            {idx === step ? renderForm() : null}
                        </React.Fragment>
                    ))}
                </form>

                <div className="flex items-center gap-2 max-w-lg mx-auto">
                    {canGoPrev ? (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => prev()}
                            className="w-full"
                        >
                            Précedent
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="destructive"
                            className="w-full"
                            asChild
                        >
                            <Link href={route("manage.unit.index")}>
                                Annuler
                            </Link>
                        </Button>
                    )}

                    {canGoNext ? (
                        <Button
                            type="button"
                            onClick={() => next()}
                            className="w-full"
                        >
                            Next
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
            </div>
        </CreateUnitContext.Provider>
    );
};

function Step1() {
    const { data, setData, errors } = React.useContext(CreateUnitContext);

    React.useEffect(() => console.log(data), [data]);

    return (
        <div>
            <div className="space-y-1">
                <Label>Nom de l'unité</Label>
                <Input
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                />
            </div>
            <div className="space-y-1">
                <Label>Description</Label>
                <Textarea
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                />
            </div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

function Step2() {
    return (
        <div>
            <div className="space-y-1">
                <Label>Matos</Label>
                <Input />
            </div>
            <div className="space-y-1">
                <Label>description de matos</Label>
                <Textarea />
            </div>
        </div>
    );
}

export default CreateForm;
