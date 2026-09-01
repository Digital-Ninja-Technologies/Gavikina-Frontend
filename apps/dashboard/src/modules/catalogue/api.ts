import type { Appliance, CalculatorFormula, Tier } from "@workspace/engine";
import type { ApiResponse } from "#/lib/api-client";
import { apiClient } from "#/lib/api-client";

// --- GETTERS ---
export async function getTiers() {
	return apiClient<ApiResponse<Tier[]>>("/catalogue/tiers");
}

export async function getAppliances() {
	return apiClient<ApiResponse<Appliance[]>>("/catalogue/appliances");
}

export async function getFormula() {
	return apiClient<ApiResponse<CalculatorFormula>>("/catalogue/formula");
}

// --- MUTATIONS ---
export async function createTier(data: Omit<Tier, "id">) {
	return apiClient<ApiResponse<Tier>>("/catalogue/tiers", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateTier(id: string, data: Partial<Tier>) {
	return apiClient<ApiResponse<Tier>>(`/catalogue/tiers/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

export async function deleteTierApi(id: string) {
	return apiClient<ApiResponse<{ id: string }>>(`/catalogue/tiers/${id}`, {
		method: "DELETE",
	});
}

export async function createAppliance(data: {
	name: string;
	category: string;
	wattage: number;
	defaultQuantity: number;
}) {
	return apiClient<ApiResponse<Appliance[]>>("/catalogue/appliances", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateAppliancesBulk(
	data: Record<string, { typical_wattage?: number; default_quantity?: number }>,
) {
	return apiClient<ApiResponse<Appliance[]>>("/catalogue/appliances", {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

export async function updateFormula(data: CalculatorFormula) {
	return apiClient<ApiResponse<CalculatorFormula>>("/catalogue/formula", {
		method: "PUT",
		body: JSON.stringify(data),
	});
}
