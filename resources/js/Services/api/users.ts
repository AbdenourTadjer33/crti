import { User } from "@/types";
import axios, { AxiosRequestConfig } from "axios";


async function searchUsers(query: string, config: AxiosRequestConfig = {}): Promise<User[]> {
    const response = await axios.get(route("search.user", { query }), config);
    return await response.data;
}

export { searchUsers };
