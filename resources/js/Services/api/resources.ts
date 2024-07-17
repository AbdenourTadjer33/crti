import axios, { AxiosRequestConfig } from "axios";

async function searchExistingResources(query: string, config: AxiosRequestConfig) {
    const response = await axios.get(route('search.resources', { query }), config);
    return await response.data;
}

export { searchExistingResources };