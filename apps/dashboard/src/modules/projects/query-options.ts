import { queryOptions } from "@tanstack/react-query";
import type { ProjectItem, ProjectsQueryParams } from "./api";
import { getProjectById, getProjects } from "./api";

export interface ProjectWithPhotos extends ProjectItem {
	size: string;
	body: string;
	caseStudy: boolean;
	images: number;
}

function mapToProject(apiItem: any): ProjectWithPhotos {
	const photos = apiItem.photos || [];
	const systemSize = apiItem.systemSize || apiItem.size || "";
	const description = apiItem.description || apiItem.body || "";
	const isCaseStudy = Boolean(
		apiItem.isCaseStudy ?? apiItem.caseStudy ?? false,
	);
	const isActive = apiItem.isActive !== false;

	return {
		id: apiItem._id || apiItem.id || "",
		title: apiItem.title || "",
		location: apiItem.location || "",
		category: apiItem.category || "home",
		systemSize,
		description,
		isCaseStudy,
		isActive,
		photos,
		createdAt: apiItem.createdAt || new Date().toISOString(),
		updatedAt: apiItem.updatedAt || new Date().toISOString(),
		size: systemSize,
		body: description,
		caseStudy: isCaseStudy,
		images: photos.length,
	};
}

export const projectsKeys = {
	all: ["projects"] as const,
	lists: () => [...projectsKeys.all, "list"] as const,
	list: (params: ProjectsQueryParams = {}) =>
		[...projectsKeys.lists(), params] as const,
	details: () => [...projectsKeys.all, "detail"] as const,
	detail: (id: string) => [...projectsKeys.details(), id] as const,
};

export const projectsListQueryOptions = (params: ProjectsQueryParams = {}) =>
	queryOptions({
		queryKey: projectsKeys.list(params),
		queryFn: async () => {
			const res = await getProjects(params);
			return {
				data: (res.data || []).map(mapToProject),
				meta: res.meta || {
					total: res.data?.length || 0,
					page: params.page || 1,
					limit: params.limit || 12,
				},
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
		enabled: Boolean(id),
	});
