import { queryOptions } from "@tanstack/react-query";
import type { GetProjectsParams, ProjectItem, ProjectsResponse } from "./api";
import { getFeaturedCaseStudy, getProjectById, getProjects } from "./api";

export type ProjectWithPhotos = ProjectItem;

export const projectsKeys = {
	all: ["projects"] as const,
	lists: () => [...projectsKeys.all, "list"] as const,
	list: (params: GetProjectsParams = {}) =>
		[...projectsKeys.lists(), params] as const,
	featured: () => [...projectsKeys.all, "featured-case-study"] as const,
	details: () => [...projectsKeys.all, "detail"] as const,
	detail: (id: string) => [...projectsKeys.details(), id] as const,
};

function sanitizeParams(params: GetProjectsParams = {}): GetProjectsParams {
	const clean: GetProjectsParams = {};
	if (params.category) clean.category = params.category;
	if (params.search?.trim()) clean.search = params.search.trim();
	if (params.page && params.page > 0) clean.page = params.page;
	if (params.limit && params.limit > 0) clean.limit = params.limit;
	return clean;
}

export const projectsQueryOptions = (params: GetProjectsParams = {}) => {
	const cleanParams = sanitizeParams(params);

	return queryOptions<ProjectsResponse>({
		queryKey: projectsKeys.list(cleanParams),
		queryFn: () => getProjects({ data: cleanParams }),
	});
};

export const featuredCaseStudyQueryOptions = () =>
	queryOptions({
		queryKey: projectsKeys.featured(),
		queryFn: () => getFeaturedCaseStudy(),
	});

export const projectQueryOptions = (id: string) =>
	queryOptions({
		queryKey: projectsKeys.detail(id),
		queryFn: async () => {
			const response = await getProjectById({ data: id });
			return response.data;
		},
		enabled: Boolean(id),
	});

export const projectDetailQueryOptions = projectQueryOptions;
