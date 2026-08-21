// Thin "API" layer consumed through TanStack Query mutations. There is no
// backend yet, so each function just resolves after a short simulated
// round-trip — swapping in a real `fetch(...)` call is a one-line change
// per function once the backend exists, without touching the calling forms.
import type {
  AgentApplicationValues,
  AssessmentContactValues,
  CareerApplicationValues,
  ContactFormValues,
  InvestorRequestValues,
} from '@gavikina/schemas';
import type { Selection } from '@gavikina/engine';

const simulateLatency = () => new Promise((resolve) => setTimeout(resolve, 350));

export async function submitContact(values: ContactFormValues) {
  await simulateLatency();
  return { ok: true as const, values };
}

export async function submitAgentApplication(values: AgentApplicationValues) {
  await simulateLatency();
  return { ok: true as const, values };
}

export async function submitCareerApplication(values: CareerApplicationValues & { cvName?: string }) {
  await simulateLatency();
  return { ok: true as const, values };
}

export async function submitInvestorRequest(values: InvestorRequestValues) {
  await simulateLatency();
  return { ok: true as const, values };
}

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
  await simulateLatency();
  const ref = 'GAV-' + Math.floor(2600 + Math.random() * 400);
  return { ok: true as const, ref, values };
}
