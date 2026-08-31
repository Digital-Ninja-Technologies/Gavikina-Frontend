import type { Appliance, CalculatorFormula, Tier } from "@workspace/engine";
import type { ApiResponse } from "#/lib/api-client";
import { apiClient } from "#/lib/api-client";

export async function getTiers() {
	return apiClient<ApiResponse<Tier[]>>("/catalogue/tiers");
}

export async function getAppliances() {
	return apiClient<ApiResponse<Appliance[]>>("/catalogue/appliances");
}

export async function getFormula() {
	return apiClient<ApiResponse<CalculatorFormula>>("/catalogue/formula");
}
