import { Unit, User } from ".";
import { Division } from "./division";

type Timeline = {
    from: string;
    to: string;
}

type ProjectStatus = "creation" | "new" | "review" | "pending" | "suspended" | "rejected" | "completed";

type BaseProject = {
    code: string;
    _status: "creation"
    status: string;
    createdAt: string;
    updatedAt: string;
    division: Pick<Division, "id" | "name" | "abbr">;
    unit: Pick<Unit, "id" | "name" | "abbr">;
};

type Partner = {
    organisation: string;
    sector: string;
    contact_name: string;
    contact_post: string;
    contact_phone: string;
    contact_email: string;
}

type Member = {
    uuid: User["uuid"];
    name: User["name"];
    email: User["email"];
};

type TaskStatus = "to_do" | "in_progress" | "done" | "suspended" | "canceled";

type TaskPriority = "Basse" | "Moyenne" | "Haute";

type Task = {
    name: string;
    status: string;
    _status: TaskStatus;
    description: string;
    timeline: Timeline;
    priority: TaskPriority;
    users: Member[];
}

type Resource = {
    name: string;
    description: string;
};

interface ExistngResource extends Resource { }


interface RequestedResource extends Resource {
    price: number;
    by_crti: boolean;
}


interface Project extends Omit<BaseProject, "_status"> {
    name: string;
    _status: ProjectStatus;
    status: string;
    nature: string;
    domains: string[];
    timeline: {
        from: string;
        to: string;
    }
    description: string;
    goals: string;
    methodology: string;
    deliverables: string[];
    estimated_amount: string;
    partner?: Partner;
    creator: Member;
    members: Member[];
    tasks: Task[];
    existingResources: ExistngResource[];
    requestedResources: RequestedResource[];

}

export { BaseProject, Project, Task, Partner, Member, RequestedResource }