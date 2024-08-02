import { Member } from "./member"
type Division = {
    id: string;
    name: string;
    abbr: string;
    description: string;
    members: Member[];
    createdAt: string;
    updatedAt: string;
}

export {
    Division
}
