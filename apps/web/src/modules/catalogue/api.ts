import { createServerFn } from "@tanstack/react-start";
import type { Appliance, CalculatorFormula, Tier } from "@workspace/engine";
import { apiClient } from "#/lib/api-client";

export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

export const getTiers = createServerFn({ method: "GET" }).handler(async () => {
	return apiClient<ApiResponse<Tier[]>>("/catalogue/tiers");
});

export const getAppliances = createServerFn({ method: "GET" }).handler(
	async () => {
		return apiClient<ApiResponse<Appliance[]>>("/catalogue/appliances");
	},
);

export const getFormula = createServerFn({ method: "GET" }).handler(
	async () => {
		return apiClient<ApiResponse<CalculatorFormula>>("/catalogue/formula");
	},
);
