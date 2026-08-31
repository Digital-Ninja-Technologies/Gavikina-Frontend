import type { ApiResponse } from "#/lib/api-client";
import { apiClient } from "#/lib/api-client";

export interface ApiMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export type PaginatedResponse<T> = ApiResponse<T> & { meta: ApiMeta };

export interface EnquiriesQueryParams {
	type?: string;
	page?: number;
	limit?: number;
	search?: string;
	startDate?: string;
	endDate?: string;
}

export async function getEnquiries(params: EnquiriesQueryParams = {}) {
	const query = new URLSearchParams();
	if (params.type && params.type !== "all") query.set("type", params.type);
	if (params.page) query.set("page", String(params.page));
	if (params.limit) query.set("limit", String(params.limit));
	if (params.search) query.set("search", params.search);
	if (params.startDate) query.set("startDate", params.startDate);
	if (params.endDate) query.set("endDate", params.endDate);

	return apiClient<PaginatedResponse<any[]>>(`/enquiries?${query.toString()}`);
}

export async function getAbandonedAssessments(
	params: EnquiriesQueryParams = {},
) {
	const query = new URLSearchParams();
	if (params.page) query.set("page", String(params.page));
	if (params.limit) query.set("limit", String(params.limit));
	if (params.search) query.set("search", params.search);
	if (params.startDate) query.set("startDate", params.startDate);
	if (params.endDate) query.set("endDate", params.endDate);

	return apiClient<PaginatedResponse<any[]>>(
		`/assessment/admin/abandoned?${query.toString()}`,
	);
}

export async function getEnquiryById(id: string) {
	return apiClient<ApiResponse<any>>(`/enquiries/${id}`);
}

export async function getAssessmentById(id: string) {
	return apiClient<ApiResponse<any>>(`/assessment/${id}`);
}
