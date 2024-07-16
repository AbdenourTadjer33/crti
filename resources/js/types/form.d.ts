import { DateRange } from "react-day-picker";

type setDataByObject<Tform> = (data: Tform) => void;
type setDataByMethod<Tform> = (data: (previousData: Tform) => Tform) => void;
type setDataByKeyValuePair<TForm> = <K extends keyof TForm>(
    key: K,
    value: TForm[K]
) => void;
interface SetError<Tform> {
    (errors: Record<keyof Tform, string>): void;
    (field: keyof Tform, value: string): void;
}

interface ProjectForm {
    name: string;
    nature: string;
    domains: string[];
    timeline: DateRange;
    description: string;
    goals: string;
    methodology: string;
    is_partner: boolean;
    partner: { name: string; email: string; phone: string };
    members: MemberForm[];
    resources: Resource[];
    resources_crti: Resource[];
    resources_partner: Resource[];
    tasks: TaskForm[];
}

interface MemberForm {
    uuid: string;
    name: string;
    email: string;
}

interface Resource {
    name: string;
    description: string;
    price: string;
    state: string;
    location: string;
}

interface TaskForm {
    id: string;
    name: string;
    description: string;
    timeline: DateRange;
    users: string[];
    priority: string;
}


export {
    setDataByObject,
    setDataByMethod,
    setDataByKeyValuePair,
    SetError,
    ProjectForm,
    MemberForm,
    Resource,
    TaskForm
};
