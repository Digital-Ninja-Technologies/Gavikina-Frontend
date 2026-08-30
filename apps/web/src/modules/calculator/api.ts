import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { ApiResponse } from "#/lib/api-client";
import { apiClient } from "#/lib/api-client";

export interface CalculateResponseData {
	totalLoad: number;
	totalLoadKVA: number;
	recommendedTier: string | null;
	priceRange: {
		min: number;
		max: number;
	} | null;
	tierDetails: {
		name: string;
		size_kva: number;
		typically_powers: string[];
		notes: string;
	} | null;
	customSolutionRequired: boolean;
}

const calculateSchema = z.object({
	appliances: z.array(
		z.object({
			applianceId: z.string(),
			quantity: z.number().positive(),
		}),
	),
});

export const calculateSystemLoad = createServerFn({ method: "POST" })
	.validator(calculateSchema)
	.handler(async ({ data }) => {
		return apiClient<ApiResponse<CalculateResponseData>>(
			"/calculator/calculate",
			{
				method: "POST",
				body: JSON.stringify(data),
			},
		);
	});
