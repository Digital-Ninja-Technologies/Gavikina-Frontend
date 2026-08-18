import { useMemo, useState } from 'react';
import ImageSlot from '../components/ImageSlot';
import { PROJECTS } from '../lib/content';

type Filter = 'all' | 'home' | 'business';
const FILTERS: [Filter, string][] = [
  ['all', 'All projects'],
  ['home', 'Homes'],
  ['business', 'Businesses'],
];

const CASE_STATS = [
  { value: '10kVA', label: 'System installed' },
  { value: '24h', label: 'Autonomy on critical circuit' },
  { value: '0', label: 'Cold chain losses since commissioning' },
];

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('all');
  const filtered = useMemo(() => PROJECTS.filter((p) => filter === 'all' || p.category === filter), [filter]);

  return (
    <div className="page-hero">
      <span className="eyebrow">Past projects</span>
      <h1 className="h1" style={{ margin: '14px 0 0', maxWidth: '22ch' }}>Systems we have commissioned.</h1>
      <p style={{ margin: '16px 0 0', fontSize: 16, lineHeight: 1.7, color: 'rgba(20,55,94,.65)', maxWidth: '56ch' }}>
        Every installation below was sized, installed and commissioned by our own engineers. Sizes shown are as-built.
      </p>

      <div style={{ display: 'flex', gap: 8, margin: '34px 0 28px', flexWrap: 'wrap' }}>
        {FILTERS.map(([id, label]) => (
          <button key={id} type="button" className={'pill-btn' + (filter === id ? ' active' : '')} onClick={() => setFilter(id)}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-3">
        {filtered.map((p) => (
          <div key={p.id} className="card" style={{ overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', background: '#F2EDE3' }}>
              <ImageSlot src={p.src} placeholder={p.placeholder} credit={p.credit} creditHref={p.creditHref} />
            </div>
            <div style={{ padding: '18px 20px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span className={'badge ' + (p.category === 'home' ? 'badge-home' : 'badge-business')}>
                  {p.category === 'home' ? 'Home' : 'Business'}
                </span>
                {p.is_case_study && <span className="badge badge-case">Case study</span>}
              </div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, letterSpacing: '-.015em' }}>{p.title}</h3>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(20,55,94,.55)' }}>
                {p.location} · {p.system_size}
              </p>
              <p style={{ margin: '11px 0 0', fontSize: 13.5, lineHeight: 1.6, color: 'rgba(20,55,94,.66)' }}>{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="split-rev" style={{ marginTop: 56, borderRadius: 22, background: '#101328', color: '#fff', overflow: 'hidden', gap: 0 }}>
        <div style={{ position: 'relative', minHeight: 380, background: '#1a1e3a' }}>
          <ImageSlot
            src="https://images.unsplash.com/photo-1668097613572-40b7c11c8727?fm=jpg&q=70&w=1400&fit=crop&auto=format"
            placeholder="Case study photo — Ikeja clinic"
            credit="Photo by Markus Spiske on Unsplash"
            creditHref="https://unsplash.com/@markusspiske"
          />
        </div>
        <div style={{ padding: '44px 46px' }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#F5A623' }}>Case study</span>
          <h2 style={{ margin: '14px 0 0', fontSize: 31, fontWeight: 600, letterSpacing: '-.03em', lineHeight: 1.15 }}>
            A 20-bed clinic that had not lost a cold chain since March.
          </h2>
          <p style={{ margin: '16px 0 0', fontSize: 14.5, lineHeight: 1.75, color: 'rgba(255,255,255,.68)' }}>
            The clinic was running two generators in shifts and still losing vaccine stock during changeovers. We measured a 6.2kW peak
            load across the ward, theatre lights and the vaccine fridges, and installed a 10kVA hybrid system with 24 hours of autonomy on
            the critical circuit.
          </p>
          <div className="grid grid-3" style={{ marginTop: 30, paddingTop: 26, borderTop: '1px solid rgba(255,255,255,.14)' }}>
            {CASE_STATS.map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: 25, fontWeight: 600, letterSpacing: '-.025em', color: '#F5A623' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
