import axios, { AxiosRequestConfig } from "axios";

async function createProject(data: any, config: AxiosRequestConfig = {}): Promise<any> {
    return await axios.post(route('project.store'), data, config);
}

async function syncProjectVersion(projectId: string, data: any, config: AxiosRequestConfig = {}): Promise<any> {
    return await axios.post(route('project.version.sync', projectId), data, config)
}

export { createProject, syncProjectVersion }