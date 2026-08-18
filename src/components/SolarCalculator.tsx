import { useMemo, useState } from 'react';
import { APPLIANCES, CATEGORIES, fmtRange, size, type Selection } from '../lib/engine';

interface SolarCalculatorProps {
  onAssessment?: (selection: Selection) => void;
}

export default function SolarCalculator({ onAssessment }: SolarCalculatorProps) {
  const [sel, setSel] = useState<Selection>({});

  const bump = (id: string, d: number, dflt: number) => {
    setSel((cur) => {
      const curQty = cur[id] || 0;
      const next = curQty === 0 && d > 0 ? dflt : Math.max(0, curQty + d);
      const nextSel = { ...cur };
      if (next === 0) delete nextSel[id];
      else nextSel[id] = next;
      return nextSel;
    });
  };

  const groups = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        name: cat,
        items: APPLIANCES.filter((a) => a.category === cat),
      })),
    []
  );

  const result = useMemo(() => size(sel), [sel]);
  const hasSelection = !!result.tier;

  return (
    <div className="calc-shell">
      <div className="calc-left">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 6 }}>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: '-.02em' }}>What do you want to power?</h3>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#2E9E45', background: 'rgba(46,158,69,.1)', padding: '4px 9px', borderRadius: 20 }}>
            No contact details needed
          </span>
        </div>
        <p style={{ margin: '0 0 24px', fontSize: 14, lineHeight: 1.6, color: 'rgba(20,55,94,.62)', maxWidth: '52ch' }}>
          Pick your appliances and set the quantity. We size the system from the same engine our engineers quote from.
        </p>

        <div className="calc-group-list">
          {groups.map((group) => (
            <div key={group.name}>
              <div className="calc-group-header">
                <span>{group.name}</span>
                <span />
              </div>
              <div className="calc-items">
                {group.items.map((item) => {
                  const qty = sel[item.id] || 0;
                  const on = qty > 0;
                  return (
                    <div key={item.id} className={'calc-row' + (on ? ' on' : '')}>
                      <button
                        type="button"
                        className="calc-row-btn"
                        onClick={() => bump(item.id, qty > 0 ? -qty : 1, item.default_quantity)}
                      >
                        <span className="name">{item.name}</span>
                        <span className="watt">{item.typical_wattage}W each</span>
                      </button>
                      <div className="qty-controls">
                        <button type="button" className="qty-btn" aria-label="Fewer" onClick={() => bump(item.id, -1, item.default_quantity)}>
                          –
                        </button>
                        <span className="qty-val">{qty}</span>
                        <button type="button" className="qty-btn" aria-label="More" onClick={() => bump(item.id, 1, item.default_quantity)}>
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="calc-right">
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%,rgba(245,166,35,.34),rgba(245,166,35,0) 70%)' }} />
        <div style={{ position: 'relative' }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)' }}>
            Your estimate
          </span>

          {hasSelection && result.tier ? (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <span style={{ fontSize: 54, fontWeight: 600, lineHeight: 0.95, letterSpacing: '-.03em', color: '#fff' }}>{result.tier.name}</span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,.6)' }}>
                Calculated load {result.watts.toLocaleString()}W · {result.requiredKva.toFixed(2)}kVA required
              </p>
              <div style={{ margin: '22px 0 0', padding: '18px 20px', borderRadius: 14, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)' }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)' }}>
                  Indicative price range
                </span>
                <div style={{ marginTop: 6, fontSize: 21, fontWeight: 600, color: '#F5A623', letterSpacing: '-.01em' }}>{fmtRange(result.tier)}</div>
                <p style={{ margin: '8px 0 0', fontSize: 12, lineHeight: 1.5, color: 'rgba(255,255,255,.5)' }}>
                  Fully installed and commissioned. Final figure confirmed after site inspection.
                </p>
              </div>
              <div style={{ marginTop: 20 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)' }}>
                  Typically powers
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {result.tier.typically_powers.map((p) => (
                    <span key={p} style={{ fontSize: 12, padding: '5px 10px', borderRadius: 20, background: 'rgba(46,158,69,.18)', color: '#8FE0A2', border: '1px solid rgba(46,158,69,.3)' }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 14, padding: '26px 0 30px' }}>
              <div style={{ fontSize: 40, fontWeight: 600, color: 'rgba(255,255,255,.22)', letterSpacing: '-.03em' }}>— kVA</div>
              <p style={{ margin: '10px 0 0', fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,.55)', maxWidth: '30ch' }}>
                Select an appliance on the left and your system size appears here instantly.
              </p>
            </div>
          )}

          <div style={{ marginTop: 26, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,.12)' }}>
            <p style={{ margin: '0 0 14px', fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,.72)' }}>
              This is a quick estimate. The full assessment factors in your backup hours and current fuel spend, then gives you a
              personalised recommendation and a site inspection.
            </p>
            <button type="button" className="btn btn-primary btn-md" style={{ width: '100%' }} onClick={() => onAssessment && onAssessment(sel)}>
              Take the full assessment →
            </button>
            <button
              type="button"
              className="btn btn-md"
              style={{ width: '100%', marginTop: 8, border: '1px solid rgba(255,255,255,.18)', background: 'none', color: 'rgba(255,255,255,.7)', fontWeight: 500, fontSize: 13 }}
              onClick={() => setSel({})}
            >
              Start over
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
