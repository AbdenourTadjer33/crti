import React from "react";
import { ValidationOptions } from "@/Libs/Validation";
import { ProjectForm, setDataByKeyValuePair, setDataByMethod, setDataByObject, SetError } from "@/types/form";
import { VisitOptions } from "@inertiajs/core";

interface ProjectContext {
    data: ProjectForm;
    errors: Partial<Record<keyof ProjectForm | string, string>>;
    processing: boolean;
    setData: setDataByObject<ProjectForm> & setDataByMethod<ProjectForm> & setDataByKeyValuePair<ProjectForm>;
    clearErrors: (...fields: (keyof ProjectForm | string)[]) => void;
    setError: SetError<ProjectForm>;
    validate: (fields: string, options?: Partial<ValidationOptions>) => void;
    post: (url: string, options?: VisitOptions) => void;
}

const CreateProjectContext = React.createContext<ProjectContext>({
    data: {
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
        members: [],
        resources: [],
        resources_crti: [],
        resources_partner: [],
        tasks: [],
    },
    errors: {},
    processing: false,
    setData: () => { },
    clearErrors: () => { },
    setError: () => { },
    validate: () => { },
    post: () => { },
});

export {
    type ProjectContext,
    CreateProjectContext,
}