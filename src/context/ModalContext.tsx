import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { Selection } from '../lib/engine';

type ModalKind = 'calc' | 'assess' | null;

interface ModalContextValue {
  modal: ModalKind;
  openCalc: () => void;
  openAssess: (selection?: Selection) => void;
  closeModal: () => void;
  prefillSelection: Selection | undefined;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalKind>(null);
  const [prefillSelection, setPrefillSelection] = useState<Selection | undefined>(undefined);

  const openCalc = useCallback(() => setModal('calc'), []);
  const openAssess = useCallback((selection?: Selection) => {
    if (selection) setPrefillSelection(selection);
    setModal('assess');
  }, []);
  const closeModal = useCallback(() => setModal(null), []);

  return (
    <ModalContext.Provider value={{ modal, openCalc, openAssess, closeModal, prefillSelection }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
