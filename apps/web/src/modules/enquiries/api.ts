import { createServerFn } from "@tanstack/react-start";
import type { CareerApplicationValues } from "@workspace/schemas";
import {
	agentApplicationSchema,
	contactFormSchema,
	investorRequestSchema,
} from "@workspace/schemas";
import { z } from "zod";
import type { ApiResponse } from "#/lib/api-client";
import { apiClient } from "#/lib/api-client";

const isEmail = (val: string) => z.email().safeParse(val).success;

export const submitContact = createServerFn({ method: "POST" })
	.validator(contactFormSchema)
	.handler(async ({ data: values }) => {
		const isEmailContact = isEmail(values.contact);

		const payload = {
			type: "contact",
			source: "contact_form",
			name: values.name,
			email: isEmailContact ? values.contact : "no-email@provided.com",
			phone: !isEmailContact ? values.contact : "0000000000",
			details: {
				message: values.message,
			},
		};

		return apiClient<ApiResponse<any>>("/enquiries", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	});

export const submitAgentApplication = createServerFn({ method: "POST" })
	.validator(agentApplicationSchema)
	.handler(async ({ data: values }) => {
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
	});

export async function submitCareerApplication(
	data: CareerApplicationValues & { cvFileId: string },
) {
	const payload = {
		type: "careers",
		source: "careers_application",
		name: data.name,
		email: data.email,
		phone: data.phone,
		details: {
			roleAppliedFor: data.role,
			experience: data.about,
			location: data.location,
			cv: data.cvFileId,
		},
	};

	return apiClient<ApiResponse<any>>("/enquiries", {
		method: "POST",
		body: JSON.stringify(payload),
	});
}

export const submitInvestorRequest = createServerFn({ method: "POST" })
	.validator(investorRequestSchema)
	.handler(async ({ data: values }) => {
		const payload = {
			type: "investor",
			source: "investor_request",
			name: values.name,
			email: values.email,
			phone: values.phone,
			details: {
				whatAreYouLookingFor: values.investmentInterest,
			},
		};

		return apiClient<ApiResponse<any>>("/enquiries", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	});
