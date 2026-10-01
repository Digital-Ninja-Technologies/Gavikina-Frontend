import { Store } from "@tanstack/store";
import type { Selection } from "@workspace/engine";

export interface AssessmentState {
	sessionId: string | null;
	uiStep: number; // 0 to 7 (maps to API steps 1 to 8)
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
			if (!parsed.done) return { ...initialState, ...parsed };
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
