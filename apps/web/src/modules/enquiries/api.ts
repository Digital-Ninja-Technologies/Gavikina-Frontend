import { createServerFn } from "@tanstack/react-start";
import {
	agentApplicationSchema,
	careerApplicationSchema,
	contactFormSchema,
	investorRequestSchema,
} from "@workspace/schemas";
import { z } from "zod";
import type { ApiResponse } from "#/lib/api-client";
import { apiClient } from "#/lib/api-client";

export const submitContact = createServerFn({ method: "POST" })
	.validator(contactFormSchema)
	.handler(async ({ data: values }) => {
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

export const submitCareerApplication = createServerFn({ method: "POST" })
	.validator((data: unknown) => data as any)
	.handler(async ({ data: values }) => {
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
				cv: values.cvName || "pending-upload-url",
			},
		};

		return apiClient<ApiResponse<any>>("/enquiries", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	});

export const submitInvestorRequest = createServerFn({ method: "POST" })
	.validator(investorRequestSchema)
	.handler(async ({ data: values }) => {
		const payload = {
			type: "investor",
			source: "investor_request",
			name: values.name,
			email: values.email,
			phone: values.phone,
			message: values.message,
			details: {
				organisation: "Not provided", // Fix the frontend form to collect this
				investmentRange: "Not provided", // Fix the frontend form to collect this
				investmentInterest: "Not provided", // Fix the frontend form to collect this
			},
		};

		return apiClient<ApiResponse<any>>("/enquiries", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	});
