import { Store, useStore } from '@tanstack/react-store';
import type { Selection } from '@gavikina/engine';

type ModalKind = 'calc' | 'assess' | null;

interface ModalState {
  kind: ModalKind;
  prefillSelection?: Selection;
}

// Global UI state (the calculator/assessment modal) shared across the whole
// route tree — TanStack Store, as called for by the project architecture.
export const modalStore = new Store<ModalState>({ kind: null, prefillSelection: undefined });

export function openCalc() {
  modalStore.setState((s) => ({ ...s, kind: 'calc' }));
}

export function openAssess(selection?: Selection) {
  modalStore.setState((s) => ({
    kind: 'assess',
    prefillSelection: selection ?? s.prefillSelection,
  }));
}

export function closeModal() {
  modalStore.setState((s) => ({ ...s, kind: null }));
}

export function useModalState() {
  return useStore(modalStore);
}
