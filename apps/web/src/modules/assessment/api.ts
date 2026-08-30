import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { ApiResponse } from "#/lib/api-client";
import { apiClient } from "#/lib/api-client";

export const startAssessmentSession = createServerFn({
	method: "POST",
}).handler(async () => {
	return apiClient<ApiResponse<{ sessionId: string; currentStep: number }>>(
		"/assessment/start",
		{ method: "POST" },
	);
});

export const saveAssessmentStep = createServerFn({ method: "POST" })
	.validator(
		z.object({
			sessionId: z.string(),
			step: z.number(),
			data: z.record(z.string(), z.any()),
		}),
	)
	.handler(async ({ data: payload }) => {
		return apiClient<ApiResponse<any>>("/assessment/step", {
			method: "POST",
			body: JSON.stringify(payload),
		});
	});

export const getAssessmentData = createServerFn({ method: "GET" })
	.validator(z.string())
	.handler(async ({ data: sessionId }) => {
		return apiClient<ApiResponse<any>>(`/assessment/${sessionId}`);
	});
