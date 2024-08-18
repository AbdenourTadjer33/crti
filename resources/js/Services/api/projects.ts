import axios, { AxiosRequestConfig } from "axios";

async function createProject(data: any, config: AxiosRequestConfig = {}): Promise<any> {
    const response = await axios.post(route('project.store'), data, config);
    return await response.data;
}

async function syncProjectVersion(projectId: string, data: any, config: AxiosRequestConfig = {}): Promise<any> {
    const response = await axios.post(route('project.version.sync', projectId), data, config);
    return await response.data;
}

async function duplicateProjectVersion(projectId: string, data: any, config: AxiosRequestConfig = {}) {
    const response = await axios.post(route('project.version.duplicate', projectId), data, config);
    return await response.data;
}

export { createProject, syncProjectVersion, duplicateProjectVersion }
