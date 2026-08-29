import type { Selection } from "@gavikina/engine";
import type { AssessmentContactValues } from "@gavikina/schemas";

export interface AssessmentSubmission extends AssessmentContactValues {
	property: string;
	reason: string;
	selection: Selection;
	backup: string;
	fuel: number;
	payment: string;
	inspection: boolean;
}

export async function submitAssessment(values: AssessmentSubmission) {
	// await simulateLatency();
	const ref = `GAV-${Math.floor(2600 + Math.random() * 400)}`;
	return { ok: true as const, ref, values };
}
