import { createStore, useSelector } from "@tanstack/react-store";
import type { Selection } from "@workspace/engine";
import { assessmentActions } from "../modules/assessment/store";

type ModalKind = "calc" | "assess" | "project" | null;

interface ModalState {
	kind: ModalKind;
	prefillSelection?: Selection;
	projectId?: string;
}

export const modalStore = createStore<ModalState>({
	kind: null,
	prefillSelection: undefined,
	projectId: undefined,
});

export function openCalc() {
	modalStore.setState((s) => ({ ...s, kind: "calc" }));
}

export function openAssess(selection?: Selection) {
	if (selection && Object.keys(selection).length > 0) {
		assessmentActions.updateField("selection", selection);
	}

	modalStore.setState((s) => ({
		kind: "assess",
		prefillSelection: selection ?? s.prefillSelection,
	}));
}

export function openProject(projectId: string) {
	modalStore.setState((s) => ({
		...s,
		kind: "project",
		projectId,
	}));
}

export function closeModal() {
	modalStore.setState((s) => ({
		...s,
		kind: null,
		projectId: undefined,
	}));
}

export function useModalState() {
	return useSelector(modalStore, (s) => s);
}
