import { queryOptions } from "@tanstack/react-query";
import type { GetProjectsParams } from "./api";
import { getProjectById, getProjects } from "./api";

export const projectsKeys = {
	all: ["projects"] as const,
	lists: () => [...projectsKeys.all, "list"] as const,
	list: (params: GetProjectsParams) =>
		[...projectsKeys.lists(), params] as const,
	details: () => [...projectsKeys.all, "detail"] as const,
	detail: (id: string) => [...projectsKeys.details(), id] as const,
};

export const projectsQueryOptions = (params: GetProjectsParams = {}) =>
	queryOptions({
		queryKey: projectsKeys.list(params),
		queryFn: () => getProjects({ data: params }),
	});

export const projectQueryOptions = (id: string) =>
	queryOptions({
		queryKey: projectsKeys.detail(id),
		queryFn: () => getProjectById({ data: id }),
		enabled: Boolean(id),
		select: (res) => res.data,
	});
