import type { ApiResponse } from "#/lib/api-client";
import { apiClient } from "#/lib/api-client";

export interface DashboardStats {
	totalEnquiries: number;
	typeCounts: Record<string, number>;
}

export interface DailyCount {
	date: string;
	count: number;
}

export interface SizeCount {
	tier: string;
	count: number;
}

export async function getDashboardStats() {
	return apiClient<ApiResponse<DashboardStats>>("/enquiries/dashboard/stats");
}

export async function getReceivedPerDay(startDate: string, endDate: string) {
	return apiClient<ApiResponse<DailyCount[]>>(
		`/enquiries/dashboard/received-per-day?startDate=${startDate}&endDate=${endDate}`,
	);
}

export async function getRecommendedSizes(startDate: string, endDate: string) {
	return apiClient<ApiResponse<SizeCount[]>>(
		`/assessment/admin/recommended-sizes?startDate=${startDate}&endDate=${endDate}`,
	);
}

// Cheaply fetch the total count of completed/abandoned assessments by requesting 1 item
export async function getAssessmentCount(type: "completed" | "abandoned") {
	return apiClient<ApiResponse<unknown> & { meta: { total: number } }>(
		`/assessment/admin/${type}?limit=1`,
	);
}
