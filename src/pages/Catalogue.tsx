import { fmtRange, INCLUDED, TIERS } from '../lib/engine';
import { useModal } from '../context/ModalContext';

const COMPONENTS = [
  { part: 'Solar panels', warranty: '25-year output', note: 'Tier-1 monocrystalline. Brand confirmed at quotation.' },
  { part: 'Hybrid inverter', warranty: '5 years', note: 'Pure sine wave, generator input capable.' },
  { part: 'Lithium batteries', warranty: '10 years / cycles', note: 'LiFePO4 only. We do not install lead-acid banks.' },
  { part: 'Mounting & protection', warranty: 'Workmanship covered', note: 'Aluminium rails, surge arrestors, DC isolators, earthing.' },
];

const ADDONS = ['Additional battery module', 'Extra panel string', 'Monitoring gateway', 'Automatic changeover', 'Panel cleaning visit', 'Extended maintenance plan'];

export default function Catalogue() {
  const { openCalc, openAssess } = useModal();

  return (
    <div className="page-hero">
      <span className="eyebrow">Product catalogue</span>
      <h1 className="h1" style={{ margin: '14px 0 0', maxWidth: '24ch' }}>Complete systems, by size.</h1>
      <p style={{ margin: '16px 0 0', fontSize: 16, lineHeight: 1.7, color: 'rgba(20,55,94,.65)', maxWidth: '60ch' }}>
        Prices are indicative ranges for a fully installed system and come from the same tier data the calculator uses. Nothing is sold
        from this page — use the calculator or the assessment and an engineer confirms the final figure on site.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 40 }}>
        {TIERS.map((t) => (
          <div key={t.id} className="tier-row">
            <div>
              <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-.03em' }}>{t.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(20,55,94,.5)', marginTop: 2 }}>{t.size_kva} kVA continuous</div>
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.11em', textTransform: 'uppercase', color: 'rgba(20,55,94,.45)' }}>Typically powers</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 9 }}>
                {t.typically_powers.map((p) => (
                  <span key={p} className="chip">{p}</span>
                ))}
              </div>
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.11em', textTransform: 'uppercase', color: 'rgba(20,55,94,.45)' }}>Indicative range</span>
              <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-.015em', marginTop: 6 }}>{fmtRange(t)}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(20,55,94,.5)', marginTop: 3 }}>Installed &amp; commissioned</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button type="button" className="btn btn-primary" style={{ padding: '11px 16px', fontSize: 13 }} onClick={() => openAssess()}>
                Full assessment
              </button>
              <button type="button" className="btn btn-outline" style={{ padding: '11px 16px', fontSize: 13 }} onClick={openCalc}>
                Check my load
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="split" style={{ marginTop: 56 }}>
        <div style={{ padding: '34px 36px', borderRadius: 20, background: '#F2EDE3' }}>
          <h2 style={{ fontSize: 25 }}>In every system, at every size</h2>
          <p style={{ margin: '10px 0 0', fontSize: 14, lineHeight: 1.65, color: 'rgba(20,55,94,.62)' }}>
            No line item is optional. If it is needed to make the system work safely, it is in the price.
          </p>
          <div className="grid grid-2" style={{ gap: 10, marginTop: 24 }}>
            {INCLUDED.map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5, color: 'rgba(20,55,94,.8)' }}>
                <span style={{ flex: 'none', width: 17, height: 17, borderRadius: '50%', background: '#2E9E45', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9.5 }}>
                  ✓
                </span>
                {i}
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '34px 36px', borderRadius: 20, border: '1px solid rgba(20,55,94,.11)' }}>
          <h2 style={{ fontSize: 25 }}>Components &amp; warranty</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 22 }}>
            {COMPONENTS.map((c) => (
              <div key={c.part} style={{ paddingBottom: 15, borderBottom: '1px solid rgba(20,55,94,.09)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 14 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{c.part}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: '#2E9E45', whiteSpace: 'nowrap' }}>{c.warranty}</span>
                </div>
                <p style={{ margin: '5px 0 0', fontSize: 13, lineHeight: 1.55, color: 'rgba(20,55,94,.6)' }}>{c.note}</p>
              </div>
            ))}
          </div>
          <p style={{ margin: '18px 0 0', fontSize: 12, lineHeight: 1.6, color: 'rgba(20,55,94,.48)', fontStyle: 'italic' }}>
            Brand names and warranty terms pending confirmation.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 24, padding: '30px 34px', borderRadius: 20, border: '1px dashed rgba(20,55,94,.2)' }}>
        <h2 style={{ fontSize: 20 }}>Accessories &amp; add-ons</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
          {ADDONS.map((a) => (
            <span key={a} style={{ fontSize: 13, padding: '8px 14px', borderRadius: 20, background: '#fff', border: '1px solid rgba(20,55,94,.12)', color: 'rgba(20,55,94,.78)' }}>
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
