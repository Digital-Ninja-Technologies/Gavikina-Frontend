import { useEffect, useRef } from 'react';
import { useModal } from '../context/ModalContext';
import SolarCalculator from './SolarCalculator';
import FullAssessment from './FullAssessment';

export default function Modal() {
  const { modal, closeModal, openAssess, prefillSelection } = useModal();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!modal) return;
    lastFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => closeBtnRef.current?.focus(), 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      lastFocus.current?.focus?.();
    };
  }, [modal, closeModal]);

  if (!modal) return null;

  const title = modal === 'calc' ? 'Solar calculator' : 'Full assessment — AI lead qualifier';
  const maxWidth = modal === 'calc' ? 1080 : 1120;

  const trapFocus = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !cardRef.current) return;
    const focusables = Array.from(
      cardRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter((el) => !(el as HTMLButtonElement).disabled && el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-card"
        style={{ maxWidth }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={cardRef}
        onKeyDown={trapFocus}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, marginBottom: 14 }}>
          <span style={{ fontSize: 12.5, fontWeight: 500, color: 'rgba(255,255,255,.8)' }}>{title}</span>
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close dialog"
            ref={closeBtnRef}
            style={{
              width: 34, height: 34, borderRadius: '50%', border: '1px solid rgba(255,255,255,.22)',
              background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: 16, lineHeight: 1, cursor: 'pointer', flex: 'none',
            }}
          >
            ✕
          </button>
        </div>
        {modal === 'calc' && <SolarCalculator onAssessment={openAssess} />}
        {modal === 'assess' && <FullAssessment initialSelection={prefillSelection} />}
      </div>
    </div>
  );
}
