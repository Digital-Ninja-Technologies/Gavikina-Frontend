import { Store } from "@tanstack/store";
import type { Selection } from "@workspace/engine";

export interface AssessmentState {
	sessionId: string | null;
	uiStep: number; // 0 to 7 (maps to API steps 1 to 8)
	maxApiStep: number; // next step number the backend expects (last saved step + 1)
	property: "home" | "business" | null;
	reason: string | null;
	selection: Selection;
	backupHours: number | null;
	fuelSpend: number;
	contact: { name: string; phone: string; email: string };
	payment: string | null;
	requestSiteInspection: boolean;
	done: boolean;
}

const DRAFT_KEY = "gv_assessment_draft_v2";

const initialState: AssessmentState = {
	sessionId: null,
	uiStep: 0,
	maxApiStep: 0,
	property: null,
	reason: null,
	selection: {},
	backupHours: null,
	fuelSpend: 60000, // Default
	contact: { name: "", phone: "", email: "" },
	payment: null,
	requestSiteInspection: true,
	done: false,
};

const loadDraft = (): AssessmentState => {
	if (typeof window === "undefined") return initialState;
	try {
		const raw = localStorage.getItem(DRAFT_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (!parsed.done) {
				const merged = { ...initialState, ...parsed };
				// Drafts saved before maxApiStep existed won't have it — infer a
				// safe floor from uiStep (1-indexed + 1) so edits right after
				// loading don't regress below where the backend already is.
				merged.maxApiStep = Math.max(merged.maxApiStep, merged.uiStep + 1);
				return merged;
			}
		}
	} catch {
		/* ignore */
	}
	return initialState;
};

export const assessmentStore = new Store<AssessmentState>(loadDraft());

assessmentStore.subscribe(() => {
	if (typeof window === "undefined") return;
	localStorage.setItem(DRAFT_KEY, JSON.stringify(assessmentStore.state));
});

export const assessmentActions = {
	setSessionId: (id: string) => {
		assessmentStore.setState((s) => ({ ...s, sessionId: id }));
	},
	nextStep: () => {
		assessmentStore.setState((s) => ({
			...s,
			uiStep: Math.min(s.uiStep + 1, 8),
		}));
	},
	prevStep: () => {
		assessmentStore.setState((s) => ({
			...s,
			uiStep: Math.max(s.uiStep - 1, 0),
		}));
	},
	// Call with the step number that was just saved. The backend advances
	// its own currentStep to (step + 1) on success, so we mirror that here —
	// re-saving an earlier, edited step later reports this value instead of
	// the step's own fixed number, which the backend would reject as going
	// backwards.
	recordApiStep: (step: number) => {
		assessmentStore.setState((s) => ({
			...s,
			maxApiStep: Math.max(s.maxApiStep, step + 1),
		}));
	},
	updateField: <K extends keyof AssessmentState>(
		field: K,
		value: AssessmentState[K],
	) => {
		assessmentStore.setState((s) => ({ ...s, [field]: value }));
	},
	reset: () => {
		localStorage.removeItem(DRAFT_KEY);
		assessmentStore.setState(() => initialState);
	},
};
