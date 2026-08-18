import { useState } from 'react';
import { FAQS } from '../lib/content';

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="narrow" style={{ padding: '70px 32px 90px' }}>
      <span className="eyebrow">FAQ</span>
      <h1 className="h1" style={{ margin: '14px 0 0' }}>Questions we get every week.</h1>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 40, borderTop: '1px solid rgba(20,55,94,.12)' }}>
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} style={{ borderBottom: '1px solid rgba(20,55,94,.12)' }}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 20,
                  padding: '22px 0',
                  background: 'none',
                  border: 0,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  color: '#14375E',
                }}
              >
                <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: '-.012em' }}>{f.q}</span>
                <span
                  style={{
                    flex: 'none',
                    width: 26,
                    height: 26,
                    borderRadius: '50%',
                    background: isOpen ? '#2E9E45' : '#F2EDE3',
                    color: isOpen ? '#fff' : 'rgba(20,55,94,.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition: 'transform .18s,background .18s',
                  }}
                >
                  +
                </span>
              </button>
              {isOpen && (
                <p style={{ margin: 0, padding: '0 60px 24px 0', fontSize: 15, lineHeight: 1.75, color: 'rgba(20,55,94,.66)', animation: 'gvIn .2s ease both' }}>
                  {f.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
