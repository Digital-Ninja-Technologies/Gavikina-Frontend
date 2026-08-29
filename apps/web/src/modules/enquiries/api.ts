/** biome-ignore-all lint/suspicious/noExplicitAny: <any ApiResponse> */
import type {
	AgentApplicationValues,
	CareerApplicationValues,
	ContactFormValues,
	InvestorRequestValues,
} from "@gavikina/schemas";
import { z } from "zod";
import type { ApiResponse } from "#/lib/api-client";
import { apiClient } from "#/lib/api-client";

export async function submitContact(values: ContactFormValues) {
	const isEmailContact = z.email().safeParse(values.contact).success;
	const payload = {
		type: "contact",
		source: "contact_form",
		name: values.name,
		email: isEmailContact ? values.contact : "no-email@provided.com",
		phone: !isEmailContact ? values.contact : "0000000000",
		message: values.message,
	};

	return apiClient<ApiResponse<any>>("/enquiries", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function submitAgentApplication(values: AgentApplicationValues) {
	const payload = {
		type: "agent",
		source: "agent_application",
		name: values.name,
		email: values.email,
		phone: values.phone,
		details: {
			territory: values.location,
			currentOccupation: values.occupation,
			whyJoin: values.reason,
		},
	};

	return apiClient<ApiResponse<any>>("/enquiries", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function submitCareerApplication(
	values: CareerApplicationValues & { cvName?: string },
) {
	const payload = {
		type: "careers",
		source: "careers_application",
		name: values.name,
		email: values.email,
		phone: values.phone,
		location: values.location,
		details: {
			roleAppliedFor: values.role,
			experience: values.about,
			cv: values.cvName || "pending-upload-url", // Replace with actual URL logic
		},
	};

	return apiClient<ApiResponse<any>>("/enquiries", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export async function submitInvestorRequest(values: InvestorRequestValues) {
	const payload = {
		type: "investor",
		source: "investor_request",
		name: values.name,
		email: values.email,
		phone: values.phone,
		message: values.message,
		details: {
			organisation: "Not provided", // Update form to collect this
			investmentRange: "Not provided", // Update form to collect this
			investmentInterest: "Not provided", // Update form to collect this
		},
	};

	return apiClient<ApiResponse<any>>("/enquiries", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}
