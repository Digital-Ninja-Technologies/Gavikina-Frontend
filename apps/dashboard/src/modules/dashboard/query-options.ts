import { queryOptions } from "@tanstack/react-query";
import {
	getAssessmentCount,
	getDashboardStats,
	getReceivedPerDay,
	getRecommendedSizes,
} from "./api";

export const dashboardKeys = {
	all: ["dashboard"] as const,
	stats: () => [...dashboardKeys.all, "stats"] as const,
	overview: (params: { startDate: string; endDate: string }) =>
		[...dashboardKeys.all, "overview", params] as const,
};

export const dashboardStatsQueryOptions = () =>
	queryOptions({
		queryKey: dashboardKeys.stats(),
		queryFn: async () => {
			const res = await getDashboardStats();
			return res.data;
		},
	});

export const dashboardOverviewQueryOptions = (params: {
	startDate: string;
	endDate: string;
}) =>
	queryOptions({
		queryKey: dashboardKeys.overview(params),
		queryFn: async () => {
			const [stats, received, sizes, completed, abandoned] = await Promise.all([
				getDashboardStats(),
				getReceivedPerDay(params.startDate, params.endDate),
				getRecommendedSizes(params.startDate, params.endDate),
				getAssessmentCount("completed"),
				getAssessmentCount("abandoned"),
			]);

			return {
				stats: stats.data,
				received: received.data,
				sizes: sizes.data,
				assessments: {
					completed: completed.meta.total,
					abandoned: abandoned.meta.total,
				},
			};
		},
	});
