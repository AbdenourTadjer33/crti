import { Unit, User } from ".";
import { Division } from "./division";

type Timeline = {
    from: string;
    to: string;
}

type BaseProject = {
    code: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    division: Pick<Division, "id" | "name">;
    unit: Pick<Unit, "id" | "name" | "abbr">;
};

type Member = {
    uuid: User["uuid"];
    name: User["name"];
    email: User["email"];
};

type Task = {
    name: string;
    description: string;
    timeline: Timeline;
    priority: string;
    users: Member[];
}

interface Project extends BaseProject {
    name: string;
    nature: string;
    domains: string[];
    timeline: {
        from: string;
        to: string;
    }
    description: string;
    goals: string;
    methodology: string;
    creator: Member;
    members: Member[];
    tasks: Task[];
}

export { BaseProject, Project }