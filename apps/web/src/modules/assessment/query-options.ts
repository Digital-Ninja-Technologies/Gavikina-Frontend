import { queryOptions } from "@tanstack/react-query";
import { getAssessmentData } from "./api";

export const assessmentKeys = {
	all: ["assessment"] as const,
	session: (id: string) => [...assessmentKeys.all, id] as const,
};

export const assessmentQueryOptions = (sessionId: string) =>
	queryOptions({
		queryKey: assessmentKeys.session(sessionId),
		queryFn: () => getAssessmentData({ data: sessionId }),
		enabled: Boolean(sessionId),
		select: (res) => res.data,
	});
