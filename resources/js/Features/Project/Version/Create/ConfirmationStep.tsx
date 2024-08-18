import { FormProps } from "@/Components/Stepper";
import React from "react";
import { CreateProjectContext as ProjectContext } from "@/Contexts/Project/create-project-context";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { format } from "date-fns";
import { ProjectForm } from "@/types/form";

function prepareData(data: Omit<ProjectForm, "creator">) {
    const formData: any = { ...data };

    formData.timeline.from = format(formData.timeline.from, "yyy-MM-dd");
    formData.timeline.to = format(formData.timeline.to, "yyy-MM-dd");

    formData.tasks.map((task: any) => {
        task.timeline.from = format(task.timeline.from, "yyy-MM-dd");
        task.timeline.to = format(task.timeline.to, "yyy-MM-dd");
    });

    return formData;
}

const ConfirmationStep = ({ prev }: FormProps) => {
    const { data, errors, processing } = React.useContext(ProjectContext);

    const submitHandler = () => {
        const formData = prepareData(data);

        const url = route("project.version.store", route().params.project);

        router.post(url, formData as any, {
            preserveScroll: true,
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
                    Confirmer
                </Button>
            </div>
        </div>
    );
};

export default ConfirmationStep;
