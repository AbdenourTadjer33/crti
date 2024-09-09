import axios, { AxiosRequestConfig } from "axios";

async function searchExistingResources(query: string, config: AxiosRequestConfig): Promise<any> {
    const response = await axios.get(route('search.resource', { query }), config);
    return await response.data;
}

export { searchExistingResources };
