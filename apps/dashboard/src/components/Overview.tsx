import { useMemo } from 'react';
import { SIZE_TIERS } from '@gavikina/engine';
import { LEADS, ts } from '../lib/data';

const TYPE_COLOR: Record<string, string> = { Customer: '#2E9E45', Agent: '#F5A623', Investor: '#14375E', Career: '#5A3E9B', Contact: 'rgba(20,55,94,.35)' };

export default function Overview() {
  const stats = useMemo(() => {
    const customers = LEADS.filter((l) => l.type === 'Customer');
    const done = customers.filter((l) => l.completed);
    const drop = customers.filter((l) => !l.completed);
    const rate = customers.length ? Math.round((done.length / customers.length) * 100) : 0;
    return [
      { label: 'Total enquiries', value: String(LEADS.length), note: 'Customers, agents, investors and contact form' },
      { label: 'Completed assessments', value: String(done.length), note: rate + '% of assessments started' },
      { label: 'Abandoned assessments', value: String(drop.length), note: 'Partial data captured' },
      { label: 'Agent applications', value: String(LEADS.filter((l) => l.type === 'Agent').length), note: 'Awaiting screening call' },
      { label: 'Investor enquiries', value: String(LEADS.filter((l) => l.type === 'Investor').length), note: 'Materials sent manually' },
      { label: 'Job applications', value: String(LEADS.filter((l) => l.type === 'Career').length), note: 'From the Careers page' },
    ];
  }, []);

  const typeBars = useMemo(
    () =>
      ['Customer', 'Agent', 'Investor', 'Career', 'Contact'].map((t) => {
        const n = LEADS.filter((l) => l.type === t).length;
        const pct = Math.round((n / LEADS.length) * 100);
        return {
          label: t === 'Contact' ? 'Contact form' : t === 'Career' ? 'Job applications' : t + ' enquiries',
          count: n,
          share: pct,
          color: TYPE_COLOR[t],
        };
      }),
    []
  );

  const dayBars = useMemo(() => {
    const days = [14, 15, 16, 17, 18];
    const counts = days.map((d) => LEADS.filter((l) => Math.floor(ts(l.when) / 10000) === d).length);
    const max = Math.max(1, ...counts);
    return days.map((d, i) => ({ label: d + ' Aug', count: counts[i], max, isMax: counts[i] === max }));
  }, []);

  const sizeRows = useMemo(() => {
    const counts = SIZE_TIERS.map((n) => LEADS.filter((l) => l.size === n).length);
    const max = Math.max(1, ...counts);
    return SIZE_TIERS.map((n, i) => ({ size: n, count: counts[i], max }));
  }, []);

  return (
    <div className="animate-gv-fade">
      <h1 className="m-0 text-[27px] font-semibold tracking-tight">Overview</h1>
      <p className="mt-2 text-sm text-navy/58">All enquiries received through the site, tools and forms. Figures cover 14–18 August 2026.</p>

      <div className="mt-6 grid grid-cols-3 gap-3.5 max-[900px]:grid-cols-2 max-[520px]:grid-cols-1">
        {stats.map((k) => (
          <div key={k.label} className="rounded-2xl border border-navy/10 bg-white p-5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-navy/45">{k.label}</span>
            <div className="mt-1.5 text-[28px] font-semibold tracking-tight">{k.value}</div>
            <span className="text-[12px] text-navy/55">{k.note}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-5">
        <div className="min-w-0 flex-1 basis-95 rounded-2xl border border-navy/10 bg-white p-6">
          <h2 className="m-0 text-base font-semibold tracking-tight">Enquiries by type</h2>
          <div className="mt-4.5 flex flex-col gap-3.5">
            {typeBars.map((b) => (
              <div key={b.label}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium">{b.label}</span>
                  <span className="tabular-nums text-navy/60">
                    {b.count} · {b.share}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-navy/8">
                  <div className="h-full rounded-full" style={{ background: b.color, width: b.share + '%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1 basis-80 rounded-2xl border border-navy/10 bg-white p-6">
          <h2 className="m-0 text-base font-semibold tracking-tight">Received per day</h2>
          <div className="mt-4.5 flex h-32.5 items-stretch gap-3">
            {dayBars.map((d) => (
              <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="text-[12.5px] font-semibold tabular-nums">{d.count}</span>
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md"
                    style={{ background: d.isMax ? '#2E9E45' : 'rgba(46,158,69,.42)', height: Math.max(4, (d.count / d.max) * 100) + '%' }}
                  />
                </div>
                <span className="text-[11.5px] text-navy/50">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-navy/10 bg-white p-6">
        <h2 className="m-0 text-base font-semibold tracking-tight">Sizes recommended</h2>
        <div className="mt-4 flex flex-col gap-2.5">
          {sizeRows.map((r) => (
            <div key={r.size} className="flex items-center gap-3">
              <span className="w-17.5 text-[13px] font-medium">{r.size}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-navy/8">
                <div className="h-full rounded-full bg-green" style={{ width: Math.round((r.count / r.max) * 100) + '%' }} />
              </div>
              <span className="w-7 text-right text-[12.5px] tabular-nums text-navy/60">{r.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
