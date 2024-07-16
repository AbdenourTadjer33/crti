import { FormProps } from "@/Components/Stepper";
import React from "react";
import { CreateProjectContext as ProjectContext } from "@/Contexts/Project/create-project-context";
import { Button } from "@/Components/ui/button";

const ConfirmationStep = ({ prev }: FormProps) => {
    const { data, errors, processing, post } = React.useContext(ProjectContext);

    const submitHandler = () => {
        post(route("project.version.store", route().params.project), {
            preserveState: true,
        });
    };

    return (
        <div className="space-y-8 overflow-hidden">
            <pre>{JSON.stringify({ data, errors }, null, 2)}</pre>

            <div className="flex gap-4 max-w-lg mx-auto">
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={processing}
                    onClick={prev}
                >
                    Précendant
                </Button>
                <Button
                    type="button"
                    className="w-full"
                    disabled={processing}
                    onClick={submitHandler}
                >
                    Créer
                </Button>
            </div>
        </div>
    );
};

export default ConfirmationStep;
