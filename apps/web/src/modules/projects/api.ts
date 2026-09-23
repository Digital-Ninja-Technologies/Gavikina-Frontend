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

export const getFeaturedCaseStudy = createServerFn({ method: "GET" }).handler(
	async () => {
		const response = await apiClient<ProjectsResponse>("/projects?limit=50");
		const items = response.data || [];

		const caseStudies = items.filter(
			(project) => project.isCaseStudy && project.isActive !== false,
		);

		if (caseStudies.length === 0) {
			return null;
		}

		caseStudies.sort((a, b) => {
			const timeA = new Date(a.createdAt || a.updatedAt).getTime();
			const timeB = new Date(b.createdAt || b.updatedAt).getTime();
			return timeB - timeA;
		});

		return caseStudies[0] || null;
	},
);

export const getProjectById = createServerFn({ method: "GET" })
	.validator((data: unknown) => z.string().parse(data))
	.handler(async ({ data: id }) => {
		return apiClient<{ success: boolean; data: ProjectItem }>(
			`/projects/${id}`,
		);
	});
