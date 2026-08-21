import { useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { SEED_PROJECTS } from '@gavikina/engine';
import { Badge, cn } from '@gavikina/ui';
import ImageSlot from '../components/ImageSlot';
import { CASE_STUDY_PHOTO, PROJECT_PHOTOS } from '../lib/content';

export const Route = createFileRoute('/projects')({ component: Projects });

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

function Projects() {
  const [filter, setFilter] = useState<Filter>('all');
  const filtered = useMemo(() => SEED_PROJECTS.filter((p) => filter === 'all' || p.category === filter), [filter]);

  return (
    <div className="mx-auto max-w-[1260px] px-8 pb-22.5 pt-17.5 max-[640px]:px-5">
      <span className="text-[11.5px] font-semibold uppercase tracking-widest text-green">Past projects</span>
      <h1 className="mt-3.5 max-w-[22ch] text-[clamp(34px,6vw,48px)] font-semibold leading-tight tracking-tight">
        Systems we have commissioned.
      </h1>
      <p className="mt-4 max-w-140 text-base leading-relaxed text-navy/65">
        Every installation below was sized, installed and commissioned by our own engineers. Sizes shown are as-built.
      </p>

      <div className="my-8.5 flex flex-wrap gap-2">
        {FILTERS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={cn(
              'rounded-full border px-4.5 py-2.5 text-[13.5px] font-medium',
              filter === id ? 'border-green bg-green/8' : 'border-navy/14 bg-white'
            )}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
        {filtered.map((p) => {
          const photo = PROJECT_PHOTOS[p.id];
          return (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-navy/10 bg-white">
              <div className="relative aspect-[4/3] w-full bg-cream">
                <ImageSlot src={photo.src} placeholder={p.title + ' — install photo'} credit={photo.credit} creditHref={photo.creditHref} />
              </div>
              <div className="p-5 pb-5.5">
                <div className="mb-2.5 flex items-center gap-2">
                  <Badge variant={p.category === 'home' ? 'home' : 'business'}>{p.category === 'home' ? 'Home' : 'Business'}</Badge>
                  {p.caseStudy && <Badge variant="case">Case study</Badge>}
                </div>
                <h3 className="m-0 text-[17px] font-semibold tracking-tight">{p.title}</h3>
                <p className="m-0 mt-1.5 text-[13px] text-navy/55">
                  {p.location} · {p.size}
                </p>
                <p className="m-0 mt-2.75 text-[13.5px] leading-relaxed text-navy/66">{p.body}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-14 grid grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] overflow-hidden rounded-3xl bg-ink text-white max-[900px]:grid-cols-1">
        <div className="relative min-h-95 bg-[#1a1e3a]">
          <ImageSlot src={CASE_STUDY_PHOTO.src} placeholder="Case study photo — Ikeja clinic" credit={CASE_STUDY_PHOTO.credit} creditHref={CASE_STUDY_PHOTO.creditHref} />
        </div>
        <div className="p-11">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-amber">Case study</span>
          <h2 className="mt-3.5 text-[31px] font-semibold leading-[1.15] tracking-tight">
            A 20-bed clinic that had not lost a cold chain since March.
          </h2>
          <p className="mt-4 text-[14.5px] leading-loose text-white/68">
            The clinic was running two generators in shifts and still losing vaccine stock during changeovers. We measured a 6.2kW peak
            load across the ward, theatre lights and the vaccine fridges, and installed a 10kVA hybrid system with 24 hours of autonomy on
            the critical circuit.
          </p>
          <div className="mt-7.5 grid grid-cols-3 gap-5 border-t border-white/14 pt-6.5 max-[480px]:grid-cols-1">
            {CASE_STATS.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-semibold tracking-tight text-amber">{s.value}</div>
                <div className="mt-1 text-xs leading-snug text-white/55">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
