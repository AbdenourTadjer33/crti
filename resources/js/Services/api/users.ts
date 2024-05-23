import axios from "axios";
import { route } from "@/Utils/helper";

async function searchUsers(query: string) {
    try {
        const response = await axios.get(
            route("manage.user.search", { query })
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export { searchUsers };
