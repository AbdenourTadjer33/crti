import { FormProps } from "@/Components/Stepper";
import React from "react";
import { EditProjectContext as ProjectContext } from "@/Contexts/Project/edit-project-context";
import { Button } from "@/Components/ui/button";

const ConfirmationStep = ({ prev }: FormProps) => {
    const { data, errors, processing, put } = React.useContext(ProjectContext);

    const submitHandler = () => {
        const project = route().params.project as string;
        const version = route().params.version as string;
        put(route("project.version.update", { project, version }), {
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
