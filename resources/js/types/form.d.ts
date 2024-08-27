import { UUID } from "crypto";
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
    partner: PartnerForm;
    deliverables: string[];
    estimated_amount: string;
    creator?: MemberForm;
    members: MemberForm[];
    resources: Omit<Resource, "price">[];
    resources_crti: Omit<Resource, "code" | "state">[];
    resources_partner: Omit<Resource, "code" | "state">[];
    tasks: TaskForm[];
}

interface PartnerForm {
    organisation: string;
    sector: string;
    contact_name: string;
    contact_post: string;
    contact_email: string;
    contact_phone: string;
}

interface MemberForm {
    uuid: UUID;
    name: string;
    email: string;
}

interface Resource {
    code: string;
    name: string;
    description: string;
    price: string;
    state: string;
}

interface TaskForm {
    name: string;
    description: string;
    timeline: DateRange;
    users: MemberForm["uuid"][];
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
