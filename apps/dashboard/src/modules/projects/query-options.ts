import { queryOptions } from "@tanstack/react-query";
import type { Project } from "@workspace/engine";
import { getProjectById, getProjects, type ProjectsQueryParams } from "./api";

// -----------------------------------------------------------------------------
// DATA MAPPER
// -----------------------------------------------------------------------------
function mapToProject(apiItem: any): Project {
	return {
		id: apiItem._id || apiItem.id,
		title: apiItem.title,
		location: apiItem.location,
		size: apiItem.systemSize,
		category: apiItem.category,
		caseStudy: apiItem.isCaseStudy,
		images: apiItem.photos?.length || 0,
		body: apiItem.description,
	};
}

// -----------------------------------------------------------------------------
// QUERY OPTIONS
// -----------------------------------------------------------------------------
export const projectsKeys = {
	all: ["projects"] as const,
	lists: () => [...projectsKeys.all, "list"] as const,
	list: (params: ProjectsQueryParams) =>
		[...projectsKeys.lists(), params] as const,
	details: () => [...projectsKeys.all, "detail"] as const,
	detail: (id: string) => [...projectsKeys.details(), id] as const,
};

export const projectsListQueryOptions = (params: ProjectsQueryParams) =>
	queryOptions({
		queryKey: projectsKeys.list(params),
		queryFn: async () => {
			const res = await getProjects(params);
			return {
				data: res.data.map(mapToProject),
				meta: res.meta,
			};
		},
	});

export const projectDetailQueryOptions = (id: string) =>
	queryOptions({
		queryKey: projectsKeys.detail(id),
		queryFn: async () => {
			const res = await getProjectById(id);
			return mapToProject(res.data);
		},
	});
