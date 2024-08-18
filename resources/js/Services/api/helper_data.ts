import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

async function addProjectDomain(domain: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<any, any> | undefined> {
    try {
        const response = await axios.post(route("api.project.domain.store"), { domain }, config);
        return response;
    } catch (e) {
        const error = e as AxiosError;
        return error.response;
    }
}

async function addProjectNature(nature: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<any, any> | undefined> {
    try {
        const response = await axios.post(route("api.project.nature.store"), { nature }, config);
        return response
    } catch (e) {
        const error = e as AxiosError;
        return error.response;
    }
}

export {
    addProjectDomain,
    addProjectNature,
}