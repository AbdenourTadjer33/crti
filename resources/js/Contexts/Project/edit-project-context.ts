import React from "react";
import { ValidationOptions } from "@/Libs/Validation";
import { ProjectForm, setDataByKeyValuePair, setDataByMethod, setDataByObject, SetError } from "@/types/form";

interface ProjectContext {
    data: ProjectForm,
    errors: Partial<Record<keyof ProjectForm | string, string>>;
    processing: boolean;
    setData: setDataByObject<ProjectForm> & setDataByMethod<ProjectForm> & setDataByKeyValuePair<ProjectForm>;
    clearErrors: (...fields: (keyof ProjectForm | string)[]) => void;
    setError: SetError<ProjectForm>;
    validate: (fields: string, options?: Partial<ValidationOptions>) => void;
}

const EditProjectContext = React.createContext<ProjectContext>({
    data: {
        name: "",
        nature: "",
        domains: [],
        timeline: { from: undefined, to: undefined },
        description: "",
        goals: "",
        methodology: "",
        deliverables: [],
        estimated_amount: "",
        is_partner: false,
        partner: { organisation: "", sector: "", contact_name: "", contact_post: "", contact_phone: "", contact_email: "" },
        creator: undefined,
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
});

export {
    EditProjectContext
}