import { User } from "@/types";
import axios from "axios";


async function searchUsers(query: string): Promise<User[]> {
    const response = await axios.get(
        route("search.user", { query })
    );
    return await response.data;
}

export { searchUsers };
