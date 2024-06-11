import { DateRange } from "react-day-picker";
import { User } from ".";

export type Task = {
    name: string;
    description: string;
    timeline?: DateRange | undefined;   
    assignedTo?: User;
    outcome?: string;
}