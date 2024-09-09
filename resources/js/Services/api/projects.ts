import axios, { AxiosRequestConfig } from "axios";
import { RouteParams } from "ziggy-js";

async function createProject(data: any, config: AxiosRequestConfig = {}): Promise<any> {
    const response = await axios.post(route('project.store'), data, config);
    return await response.data;
}

async function syncProjectVersion(routeParams: RouteParams<"project.version.sync">, data: any, config: AxiosRequestConfig = {}): Promise<any> {
    const response = await axios.post(route('project.version.sync', routeParams), data, config);
    return await response.data;
}

async function duplicateProjectVersion(projectId: string, data: any, config: AxiosRequestConfig = {}) {
    const response = await axios.post(route('project.version.duplicate', projectId), data, config);
    return await response.data;
}

async function searchProjects(data: Record<string, any>, config: AxiosRequestConfig = {}): Promise<any[]> {
    const response = await axios.get(route('search.project', data), config);
    return await response.data;
}

export { createProject, syncProjectVersion, duplicateProjectVersion, searchProjects }
