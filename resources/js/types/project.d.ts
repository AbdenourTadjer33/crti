import { User } from ".";
import { Division } from "./division";

type BaseProject = {
    code: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    division: Pick<Division, "id" | "name">;
};

type Member = {
    uuid: User["uuid"];
    name: User["name"];
    isCreator: boolean;
};

interface Project extends BaseProject {
    name: string;
    nature: string;
    domains: string[];
    members: Member[];
}

export { BaseProject, Project }