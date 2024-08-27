import { User } from "@/types";
import axios, { AxiosRequestConfig } from "axios";


async function searchUsers(query: string, config: AxiosRequestConfig = {}): Promise<User[]> {
    const response = await axios.get(route("search.user", { query }), config);
    return await response.data;
}


export const updateGrade = async (userId: number, grade: string) => {
    try {
      const response = await axios.put("", { grade });
      return response.data;
    } catch (error) {
      console.error("Error updating grade:", error);
      throw error;
    }
  };

export { searchUsers };
