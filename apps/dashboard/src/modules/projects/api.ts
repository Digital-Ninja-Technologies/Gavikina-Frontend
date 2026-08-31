import type { ApiResponse, PaginatedResponse } from "#/lib/api-client";
import { apiClient } from "#/lib/api-client";

export interface ProjectsQueryParams {
	category?: string;
	search?: string;
	page?: number;
	limit?: number;
}

export async function getProjects(params: ProjectsQueryParams = {}) {
	const query = new URLSearchParams();
	if (params.category) query.set("category", params.category);
	if (params.search) query.set("search", params.search);
	if (params.page) query.set("page", String(params.page));
	if (params.limit) query.set("limit", String(params.limit));

	return apiClient<PaginatedResponse<any[]>>(`/projects?${query.toString()}`);
}

export async function getProjectById(id: string) {
	return apiClient<ApiResponse<any>>(`/projects/${id}`);
}

export async function createProject(data: any) {
	return apiClient<ApiResponse<any>>("/projects", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateProject(id: string, data: any) {
	return apiClient<ApiResponse<any>>(`/projects/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export async function deleteProjectApi(id: string) {
	return apiClient<ApiResponse<any>>(`/projects/${id}`, {
		method: "DELETE",
	});
}
