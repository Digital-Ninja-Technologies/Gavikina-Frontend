import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
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

export interface ProjectsResponse {
	success: boolean;
	message: string;
	data: ProjectItem[];
	meta: {
		page: number;
		limit: number;
		total: number;
	};
}

const getProjectsSchema = z.object({
	category: z.enum(["home", "business"]).optional(),
	search: z.string().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
});

export type GetProjectsParams = z.infer<typeof getProjectsSchema>;

export const getProjects = createServerFn({ method: "GET" })
	.validator((data: unknown) => getProjectsSchema.parse(data))
	.handler(async ({ data }) => {
		const query = new URLSearchParams();
		if (data.category) query.set("category", data.category);
		if (data.search) query.set("search", data.search);
		if (data.page) query.set("page", String(data.page));
		if (data.limit) query.set("limit", String(data.limit));

		const queryString = query.toString();
		const endpoint = `/projects${queryString ? `?${queryString}` : ""}`;

		return apiClient<ProjectsResponse>(endpoint);
	});

export const getProjectById = createServerFn({ method: "GET" })
	.validator((data: unknown) => z.string().parse(data))
	.handler(async ({ data: id }) => {
		return apiClient<{ success: boolean; data: ProjectItem }>(
			`/projects/${id}`,
		);
	});
