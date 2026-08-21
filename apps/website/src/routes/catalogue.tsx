import { createFileRoute } from '@tanstack/react-router';
import { fmtRange, INCLUDED, useCalculatorTiers } from '@gavikina/engine';
import { Button } from '@gavikina/ui';
import { openCalc, openAssess } from '../store/modal';

export const Route = createFileRoute('/catalogue')({ component: Catalogue });

const COMPONENTS = [
  { part: 'Solar panels', warranty: '25-year output', note: 'Tier-1 monocrystalline. Brand confirmed at quotation.' },
  { part: 'Hybrid inverter', warranty: '5 years', note: 'Pure sine wave, generator input capable.' },
  { part: 'Lithium batteries', warranty: '10 years / cycles', note: 'LiFePO4 only. We do not install lead-acid banks.' },
  { part: 'Mounting & protection', warranty: 'Workmanship covered', note: 'Aluminium rails, surge arrestors, DC isolators, earthing.' },
];

const ADDONS = ['Additional battery module', 'Extra panel string', 'Monitoring gateway', 'Automatic changeover', 'Panel cleaning visit', 'Extended maintenance plan'];

function Catalogue() {
  const tiers = useCalculatorTiers();
  return (
    <div className="mx-auto max-w-[1260px] px-8 pb-22.5 pt-17.5 max-[640px]:px-5">
      <span className="text-[11.5px] font-semibold uppercase tracking-widest text-green">Product catalogue</span>
      <h1 className="mt-3.5 max-w-[24ch] text-[clamp(34px,6vw,48px)] font-semibold leading-tight tracking-tight">
        Complete systems, by size.
      </h1>
      <p className="mt-4 max-w-150 text-base leading-relaxed text-navy/65">
        Prices are indicative ranges for a fully installed system and come from the same tier data the calculator uses. Nothing is sold
        from this page — use the calculator or the assessment and an engineer confirms the final figure on site.
      </p>

      <div className="mt-10 flex flex-col gap-3.5">
        {tiers.map((t) => (
          <div
            key={t.id}
            className="grid grid-cols-[150px_minmax(0,1fr)_220px_180px] items-center gap-7 rounded-2xl border border-navy/11 bg-white p-6.5 px-7 transition-colors hover:border-green/45 hover:bg-[#fdfdfb] max-[900px]:grid-cols-2 max-[900px]:gap-y-4.5 max-[560px]:grid-cols-1"
          >
            <div>
              <div className="text-[30px] font-semibold tracking-tight">{t.name}</div>
              <div className="mt-0.5 text-xs text-navy/50">{t.size_kva} kVA continuous</div>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-navy/45">Typically powers</span>
              <div className="mt-2.25 flex flex-wrap gap-1.5">
                {t.typically_powers.map((p) => (
                  <span key={p} className="rounded-full bg-cream px-2.5 py-1 text-[12.5px] text-navy/78">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-navy/45">Indicative range</span>
              <div className="mt-1.5 text-[17px] font-semibold tracking-tight">{fmtRange(t)}</div>
              <div className="mt-0.75 text-[11.5px] text-navy/50">Installed &amp; commissioned</div>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="px-4 py-2.75 text-[13px]" onClick={() => openAssess()}>
                Full assessment
              </Button>
              <Button variant="outline" className="px-4 py-2.75 text-[13px]" onClick={openCalc}>
                Check my load
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 grid grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] gap-5.5 max-[900px]:grid-cols-1">
        <div className="rounded-3xl bg-cream p-8.5 px-9">
          <h2 className="text-[25px] font-semibold tracking-tight">In every system, at every size</h2>
          <p className="mt-2.5 text-sm leading-relaxed text-navy/62">
            No line item is optional. If it is needed to make the system work safely, it is in the price.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2.5 max-[480px]:grid-cols-1">
            {INCLUDED.map((i) => (
              <div key={i} className="flex items-center gap-2.25 text-[13.5px] text-navy/80">
                <span className="flex h-4.25 w-4.25 flex-none items-center justify-center rounded-full bg-green text-[9.5px] text-white">✓</span>
                {i}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-navy/11 p-8.5 px-9">
          <h2 className="text-[25px] font-semibold tracking-tight">Components &amp; warranty</h2>
          <div className="mt-5.5 flex flex-col gap-4">
            {COMPONENTS.map((c) => (
              <div key={c.part} className="border-b border-navy/9 pb-3.75">
                <div className="flex items-baseline justify-between gap-3.5">
                  <span className="text-sm font-semibold">{c.part}</span>
                  <span className="whitespace-nowrap text-[12.5px] font-semibold text-green">{c.warranty}</span>
                </div>
                <p className="m-0 mt-1.25 text-[13px] leading-snug text-navy/60">{c.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-4.5 text-xs italic leading-relaxed text-navy/48">Brand names and warranty terms pending confirmation.</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-dashed border-navy/20 px-8.5 py-7.5">
        <h2 className="text-xl font-semibold tracking-tight">Accessories &amp; add-ons</h2>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {ADDONS.map((a) => (
            <span key={a} className="rounded-full border border-navy/12 bg-white px-3.5 py-2 text-[13px] text-navy/78">
              {a}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
