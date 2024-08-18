import React from "react";
import { ValidationOptions } from "@/Libs/Validation";
import { ProjectForm, setDataByKeyValuePair, setDataByMethod, setDataByObject, SetError } from "@/types/form";

type Data = Omit<ProjectForm, "creator">;

interface ProjectContext {
    data: Data;
    errors: Partial<Record<keyof ProjectForm | string, string>>;
    processing: boolean;
    setData: setDataByObject<Data> & setDataByMethod<Data> & setDataByKeyValuePair<Data>;
    clearErrors: (...fields: (keyof Data | string)[]) => void;
    setError: SetError<Data>;
    validate: (fields: string, options?: Partial<ValidationOptions>) => void;
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
});

export {
    type ProjectContext,
    CreateProjectContext,
}