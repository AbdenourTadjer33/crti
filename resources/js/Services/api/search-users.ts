import axios from "axios";

async function searchUsers(query: string) {
    try {
        const response = await axios.get(route('manage'))
    } catch (error) {
        console.log(error);
    }
}
