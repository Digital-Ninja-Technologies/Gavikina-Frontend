import { useMemo, useState } from 'react';
import { APPLIANCES, CATEGORIES, fmtRange, size  } from '@gavikina/engine';
import type {Selection} from '@gavikina/engine';
import { Button, cn } from '@gavikina/ui';

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
    () => CATEGORIES.map((cat) => ({ name: cat, items: APPLIANCES.filter((a) => a.category === cat) })),
    []
  );

  const result = useMemo(() => size(sel), [sel]);
  const hasSelection = !!result.tier;

  return (
    <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] overflow-hidden rounded-2xl border border-navy/14 bg-white shadow-[0_18px_44px_-30px_rgba(16,19,40,.45)] max-[760px]:grid-cols-1">
      <div className="min-w-0 p-7.5 pb-8.5 max-[560px]:p-5.5">
        <div className="mb-1.5 flex flex-wrap items-baseline gap-3">
          <h3 className="m-0 text-[22px] font-semibold tracking-tight">What do you want to power?</h3>
          <span className="rounded-full bg-green/10 px-2.5 py-1 text-xs font-medium text-green">No contact details needed</span>
        </div>
        <p className="mb-6 max-w-[52ch] text-sm leading-relaxed text-navy/62">
          Pick your appliances and set the quantity. We size the system from the same engine our engineers quote from.
        </p>

        <div className="flex max-h-130 flex-col gap-5.5 overflow-y-auto pr-1.5">
          {groups.map((group) => (
            <div key={group.name}>
              <div className="mb-2.5 flex items-center gap-2.5">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-navy/45">{group.name}</span>
                <span className="h-px flex-1 bg-navy/10" />
              </div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-2">
                {group.items.map((item) => {
                  const qty = sel[item.id] || 0;
                  const on = qty > 0;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-colors',
                        on ? 'border-green/45 bg-green/7' : 'border-navy/10 bg-white'
                      )}
                    >
                      <button
                        type="button"
                        className="flex min-w-0 flex-1 flex-col items-start gap-0.5 border-0 bg-transparent p-0 text-left"
                        onClick={() => bump(item.id, qty > 0 ? -qty : 1, item.default_quantity)}
                      >
                        <span className="text-[13.5px] font-medium leading-tight">{item.name}</span>
                        <span className="text-[11.5px] text-navy/50">{item.typical_wattage}W each</span>
                      </button>
                      <div className="flex flex-none items-center gap-1">
                        <button
                          type="button"
                          aria-label="Fewer"
                          className="flex h-6.5 w-6.5 items-center justify-center rounded-lg border border-navy/16 bg-white text-[15px] leading-none hover:bg-cream"
                          onClick={() => bump(item.id, -1, item.default_quantity)}
                        >
                          –
                        </button>
                        <span className="min-w-5 text-center text-[13.5px] font-semibold tabular-nums">{qty}</span>
                        <button
                          type="button"
                          aria-label="More"
                          className="flex h-6.5 w-6.5 items-center justify-center rounded-lg border border-navy/16 bg-white text-[15px] leading-none hover:bg-cream"
                          onClick={() => bump(item.id, 1, item.default_quantity)}
                        >
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

      <div className="relative flex min-w-0 flex-col overflow-hidden bg-ink p-8 text-white max-[560px]:p-5.5">
        <div className="pointer-events-none absolute -right-10 -top-10 h-45 w-45 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(245,166,35,.34),rgba(245,166,35,0)_70%)]" />
        <div className="relative">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-white/45">Your estimate</span>

          {hasSelection && result.tier ? (
            <div className="mt-3.5">
              <div className="flex items-end gap-2">
                <span className="text-[54px] font-semibold leading-[0.95] tracking-tight text-white">{result.tier.name}</span>
              </div>
              <p className="mt-1.5 text-[13px] text-white/60">
                Calculated load {result.watts.toLocaleString()}W · {result.requiredKva.toFixed(2)}kVA required
              </p>
              <div className="mt-5.5 rounded-2xl border border-white/10 bg-white/6 px-5 py-4.5">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-white/45">Indicative price range</span>
                <div className="mt-1.5 text-xl font-semibold tracking-tight text-amber">{fmtRange(result.tier)}</div>
                <p className="mt-2 text-xs leading-relaxed text-white/50">Fully installed and commissioned. Final figure confirmed after site inspection.</p>
              </div>
              <div className="mt-5">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-white/45">Typically powers</span>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {result.tier.typically_powers.map((p) => (
                    <span key={p} className="rounded-full border border-green/30 bg-green/18 px-2.5 py-1 text-xs text-green-light">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-3.5 pb-7.5 pt-0">
              <div className="text-4xl font-semibold tracking-tight text-white/22">— kVA</div>
              <p className="mt-2.5 max-w-[30ch] text-[13.5px] leading-relaxed text-white/55">
                Select an appliance on the left and your system size appears here instantly.
              </p>
            </div>
          )}

          <div className="mt-6.5 border-t border-white/12 pt-5.5">
            <p className="mb-3.5 text-[13.5px] leading-relaxed text-white/72">
              This is a quick estimate. The full assessment factors in your backup hours and current fuel spend, then gives you a
              personalised recommendation and a site inspection.
            </p>
            <Button className="w-full" onClick={() => onAssessment && onAssessment(sel)}>
              Take the full assessment →
            </Button>
            <Button
              variant="outline-dark"
              className="mt-2 w-full border-white/18 bg-transparent text-[13px] font-medium text-white/70"
              onClick={() => setSel({})}
            >
              Start over
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
