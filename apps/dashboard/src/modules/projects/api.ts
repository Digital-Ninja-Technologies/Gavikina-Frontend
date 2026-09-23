import type { ApiResponse, PaginatedResponse } from "#/lib/api-client";
import { apiClient } from "#/lib/api-client";

export interface ProjectItem {
	id: string;
	title: string;
	location: string;
	systemSize: string;
	category: "home" | "business";
	description: string;
	photos: string[];
	isCaseStudy: boolean;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ProjectsQueryParams {
	category?: "home" | "business" | string;
	search?: string;
	page?: number;
	limit?: number;
	isCaseStudy?: boolean;
}

export interface ProjectPayload {
	title: string;
	location: string;
	systemSize: string;
	category: "home" | "business";
	description: string;
	isCaseStudy?: boolean;
	isActive?: boolean;
	photos?: string[];
}

export async function getProjects(params: ProjectsQueryParams = {}) {
	const query = new URLSearchParams();

	if (params.category) query.set("category", params.category);
	if (params.search?.trim()) query.set("search", params.search.trim());
	if (params.page && params.page > 0) query.set("page", String(params.page));
	if (params.limit && params.limit > 0)
		query.set("limit", String(params.limit));
	if (params.isCaseStudy !== undefined) {
		query.set("isCaseStudy", String(params.isCaseStudy));
	}

	const queryString = query.toString();
	const endpoint = `/projects${queryString ? `?${queryString}` : ""}`;

	return apiClient<PaginatedResponse<ProjectItem[]>>(endpoint);
}

export async function getProjectById(id: string) {
	return apiClient<ApiResponse<ProjectItem>>(`/projects/${id}`);
}

export async function createProject(data: ProjectPayload) {
	return apiClient<ApiResponse<ProjectItem>>("/projects", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateProject(id: string, data: Partial<ProjectPayload>) {
	return apiClient<ApiResponse<ProjectItem>>(`/projects/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export async function deleteProjectApi(id: string) {
	return apiClient<ApiResponse<{ id: string }>>(`/projects/${id}`, {
		method: "DELETE",
	});
}
