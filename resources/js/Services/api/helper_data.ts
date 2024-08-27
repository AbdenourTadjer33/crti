import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

async function addProjectDomain(domain: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<any, any> | undefined> {
    try {
        const response = await axios.post(route("project.suggest.domain"), { value: domain }, config);
        return response;
    } catch (e) {
        const error = e as AxiosError;
        return error.response;
    }
}

async function addProjectNature(nature: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse<any, any> | undefined> {
    try {
        const response = await axios.post(route("project.suggest.nature"), { value: nature }, config);
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