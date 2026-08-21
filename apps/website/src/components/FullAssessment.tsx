import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import {
  BACKUP_OPTIONS,
  PAYMENT_METHODS,
  REASONS,
  effectiveSize,
  fmt,
  fuelCompare,
  useCalculatorAppliances
} from '@gavikina/engine';
import type {Selection} from '@gavikina/engine';
import { assessmentContactSchema  } from '@gavikina/schemas';
import type {AssessmentContactValues} from '@gavikina/schemas';
import { Button, Field, Input, cn } from '@gavikina/ui';
import { submitAssessment } from '../lib/api';

const STEPS = ['Property type', 'Your reason', 'Appliances', 'Backup duration', 'Fuel spend', 'Recommendation', 'Your details', 'Payment & inspection'];
const DRAFT_KEY = 'gv_assessment_draft_v1';

interface FullAssessmentProps {
  initialSelection?: Selection;
}

interface Draft {
  step: number;
  property: string | null;
  reason: string | null;
  sel: Selection;
  backup: string | null;
  fuel: number;
  name: string;
  phone: string;
  email: string;
  payment: string | null;
  inspection: boolean;
  done: boolean;
}

export default function FullAssessment({ initialSelection }: FullAssessmentProps) {
  const [step, setStep] = useState(0);
  const [property, setProperty] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [sel, setSel] = useState<Selection>(initialSelection || {});
  const [backup, setBackup] = useState<string | null>(null);
  const [fuel, setFuel] = useState(60000);
  const [payment, setPayment] = useState<string | null>(null);
  const [inspection, setInspection] = useState(true);
  const [aiText, setAiText] = useState('');
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const [ref, setRef] = useState('');
  const appliances = useCalculatorAppliances();
  const typeRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const contactForm = useForm<AssessmentContactValues>({
    resolver: zodResolver(assessmentContactSchema),
    mode: 'onChange',
    defaultValues: { name: '', phone: '', email: '' },
  });
  const contactValues = contactForm.watch();

  const submitMutation = useMutation({ mutationFn: submitAssessment });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d: Draft = JSON.parse(raw);
        if (d.step > 0 && !d.done) {
          setStep(d.step);
          setProperty(d.property);
          setReason(d.reason);
          setSel(d.sel);
          setBackup(d.backup);
          setFuel(d.fuel);
          contactForm.reset({ name: d.name || '', phone: d.phone || '', email: d.email || '' });
          setPayment(d.payment);
          setInspection(d.inspection);
        }
      }
    } catch {
      /* ignore corrupt draft */
    }
    return () => {
      if (typeRef.current) clearInterval(typeRef.current);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          step, property, reason, sel, backup, fuel,
          name: contactValues.name, phone: contactValues.phone, email: contactValues.email,
          payment, inspection, done, updated: Date.now(),
        })
      );
    } catch {
      /* storage unavailable */
    }
  }, [step, property, reason, sel, backup, fuel, contactValues.name, contactValues.phone, contactValues.email, payment, inspection, done]);

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

  const backupHours = () => BACKUP_OPTIONS.find((b) => b.id === backup)?.hours ?? 8;
  const backupLabel = () => BACKUP_OPTIONS.find((b) => b.id === backup)?.label ?? '8 hours';

  const aiNote = () => {
    const r = effectiveSize(sel, backupHours());
    if (!r.tier) return 'Add a few appliances and we will explain what your system does for you.';
    const c = fuelCompare(fuel, r.tier);
    const reasonLabel = REASONS.find((x) => x.id === reason)?.label || '';
    const place = property === 'business' ? 'your business' : 'your home';
    let t =
      'A ' + r.tier.name + ' system covers the ' + r.watts.toLocaleString() + 'W of load you listed for ' + place +
      ', with enough battery to carry you through ' + backupLabel().toLowerCase() + ' of no grid supply. ';
    if (c && fuel > 0) {
      t +=
        'You are spending about ' + fmt(c.annualSpend) + ' a year on fuel. At that rate the system pays for itself in roughly ' +
        Math.round((c.paybackMonths / 12) * 10) / 10 + ' years, and over five years you keep about ' + fmt(c.fiveYearSaving) +
        ' that would otherwise go into the generator. ';
    }
    if (reasonLabel) t += 'Given that ' + reasonLabel.toLowerCase() + ', this size gives you room to grow without over-buying panels. ';
    t += 'An engineer will confirm the roof, the wiring and the final figure on site.';
    return t;
  };

  const startTyping = () => {
    if (typeRef.current) clearInterval(typeRef.current);
    const full = aiNote();
    let i = 0;
    setAiText('');
    setTyping(true);
    typeRef.current = setInterval(() => {
      i += 3;
      if (i >= full.length) {
        if (typeRef.current) clearInterval(typeRef.current);
        setAiText(full);
        setTyping(false);
      } else {
        setAiText(full.slice(0, i));
      }
    }, 16);
  };

  const go = (n: number) => {
    const next = Math.max(0, Math.min(7, n));
    setStep(next);
    if (next === 5) setTimeout(() => startTyping(), 260);
  };

  const canAdvance = () => {
    if (step === 0) return !!property;
    if (step === 1) return !!reason;
    if (step === 2) return Object.keys(sel).length > 0;
    if (step === 3) return !!backup;
    if (step === 6) return contactForm.formState.isValid;
    if (step === 7) return !!payment;
    return true;
  };

  const hours = backupHours();
  const result = useMemo(() => effectiveSize(sel, hours), [sel, hours]);
  const compare = useMemo(() => fuelCompare(fuel, result.tier), [fuel, result.tier]);
  const effectiveStep = done ? 8 : step;
  const nextEnabled = canAdvance();
  const lastStep = step === 7;

  const groups = useMemo(() => {
    const cats = [...new Set(appliances.map((a) => a.category))].filter((cat) => property === 'business' || cat !== 'Business');
    return cats.map((cat) => ({ name: cat, items: appliances.filter((a) => a.category === cat) }));
  }, [property, appliances]);

  const compareRows = compare
    ? [
        { label: 'Fuel today', value: fmt(compare.monthlySpend) + '/mo' },
        { label: 'Fuel over five years', value: fmt(compare.fiveYearSpend) },
        { label: 'System pays back in', value: Math.round(compare.paybackMonths) + ' months' },
        { label: 'Kept over five years', value: fmt(compare.fiveYearSaving) },
      ]
    : [{ label: 'Enter a fuel spend to compare', value: '—' }];

  const restart = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    setStep(0);
    setDone(false);
    setProperty(null);
    setReason(null);
    setSel({});
    setBackup(null);
    contactForm.reset({ name: '', phone: '', email: '' });
    setPayment(null);
    setAiText('');
  };

  const finish = async () => {
    const values = contactForm.getValues();
    const res = await submitMutation.mutateAsync({
      ...values,
      property: property || '',
      reason: reason || '',
      selection: sel,
      backup: backup || '',
      fuel,
      payment: payment || '',
      inspection,
    });
    setRef(res.ref);
    setDone(true);
  };

  const nameOrYou = contactValues.name.trim().split(' ')[0] || 'there';
  const phoneOrSoon = contactValues.phone.trim() ? 'on ' + contactValues.phone.trim() : 'shortly';

  const cardOption = (active: boolean) =>
    cn(
      'flex flex-col items-start gap-1.5 rounded-2xl border p-5 text-left transition-colors',
      active ? 'border-green bg-green/7' : 'border-navy/14 bg-white'
    );
  const pillOption = (active: boolean) =>
    cn(
      'flex items-center rounded-2xl border px-4.5 py-3.75 text-left text-[14.5px] font-medium transition-colors',
      active ? 'border-green bg-green/8' : 'border-navy/14 bg-white'
    );

  return (
    <div className="grid grid-cols-[250px_minmax(0,1fr)] overflow-hidden rounded-2xl border border-navy/14 bg-white shadow-[0_18px_44px_-30px_rgba(16,19,40,.45)] max-[760px]:grid-cols-1">
      <div className="flex flex-col gap-6.5 bg-ink p-7.5 text-white max-[760px]:flex-row max-[760px]:flex-wrap max-[760px]:items-center max-[760px]:gap-3.5 max-[760px]:p-5">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-amber">Full assessment</span>
          <p className="mt-2 text-[13px] leading-snug text-white/55">Five questions, then your recommendation.</p>
        </div>
        <div className="flex flex-col gap-0.5 max-[760px]:hidden">
          {STEPS.map((label, i) => {
            const active = i === effectiveStep;
            const past = i < effectiveStep;
            return (
              <div
                key={label}
                className={cn('flex items-center gap-2.75 rounded-lg px-2.5 py-2', active ? 'bg-white/9' : 'bg-transparent')}
              >
                <span
                  className={cn(
                    'flex h-5.25 w-5.25 flex-none items-center justify-center rounded-full text-[10.5px] font-semibold',
                    active ? 'bg-green text-white' : past ? 'bg-green/28 text-green-light' : 'bg-white/9 text-white/45'
                  )}
                >
                  {past ? '✓' : String(i + 1)}
                </span>
                <span className={cn('text-[13px] font-medium leading-tight', active ? 'text-white' : past ? 'text-white/55' : 'text-white/32')}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-auto flex items-center gap-1.75 text-[11.5px] text-white/40">
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
          {effectiveStep > 0 && effectiveStep < 8 ? 'Progress saved' : 'Nothing saved yet'}
        </div>
      </div>

      <div className="flex min-h-130 min-w-0 flex-col p-8.5 pb-7.5 pt-8.5 max-[560px]:p-5.5">
        {step === 0 && !done && (
          <div className="animate-gv-fade">
            <h3 className="m-0 text-[26px] font-semibold tracking-tight">Is this for a home or a business?</h3>
            <p className="mb-6.5 mt-2 text-sm text-navy/60">It changes which appliances we show you and how we size for peak demand.</p>
            <div className="grid max-w-150 grid-cols-2 gap-3.5 max-[480px]:grid-cols-1">
              {[
                { id: 'home', label: 'My home', note: 'Flat, duplex or family house' },
                { id: 'business', label: 'My business', note: 'Shop, office, clinic or workshop' },
              ].map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={cardOption(property === o.id)}
                  onClick={() => {
                    setProperty(o.id);
                    setTimeout(() => go(1), 160);
                  }}
                >
                  <span className="text-[17px] font-semibold tracking-tight">{o.label}</span>
                  <span className="text-[13px] leading-snug text-navy/58">{o.note}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && !done && (
          <div className="animate-gv-fade">
            <h3 className="m-0 text-[26px] font-semibold tracking-tight">Why are you considering solar?</h3>
            <p className="mb-6.5 mt-2 text-sm text-navy/60">Pick the closest reason. It shapes the recommendation you get at the end.</p>
            <div className="flex max-w-150 flex-col gap-2.25">
              {REASONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={pillOption(reason === o.id)}
                  onClick={() => {
                    setReason(o.id);
                    setTimeout(() => go(2), 160);
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && !done && (
          <div className="min-w-0 animate-gv-fade">
            <h3 className="m-0 text-[26px] font-semibold tracking-tight">What should the system power?</h3>
            <p className="mb-5 mt-2 text-sm text-navy/60">
              Tap to add, then set quantities. Running total: <strong className="text-navy">{result.watts.toLocaleString()}W</strong>
            </p>
            <div className="flex max-h-82.5 flex-col gap-4.5 overflow-y-auto pr-1.5">
              {groups.map((group) => (
                <div key={group.name}>
                  <div className="mb-2.25 flex items-center gap-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-navy/45">{group.name}</span>
                    <span className="h-px flex-1 bg-navy/10" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => {
                      const qty = sel[item.id] || 0;
                      const on = qty > 0;
                      return (
                        <div
                          key={item.id}
                          className={cn(
                            'flex items-center gap-0.5 rounded-xl border px-3.25 py-2.25',
                            on ? 'border-green/50 bg-green/7' : 'border-navy/13 bg-white'
                          )}
                        >
                          <button
                            type="button"
                            className="border-0 bg-transparent p-0 text-[13px] font-medium text-navy"
                            onClick={() => bump(item.id, qty > 0 ? -qty : 1, item.default_quantity)}
                          >
                            {item.name}
                          </button>
                          {on && (
                            <span className="ml-0.5 flex items-center gap-0.75 border-l border-green/35 pl-1.75">
                              <button
                                type="button"
                                aria-label="Fewer"
                                className="flex h-5 w-5 items-center justify-center rounded-md border-0 bg-green/14 text-[13px] leading-none text-green-dark"
                                onClick={() => bump(item.id, -1, item.default_quantity)}
                              >
                                –
                              </button>
                              <span className="min-w-3.5 text-center text-[12.5px] font-semibold">{qty}</span>
                              <button
                                type="button"
                                aria-label="More"
                                className="flex h-5 w-5 items-center justify-center rounded-md border-0 bg-green/14 text-[13px] leading-none text-green-dark"
                                onClick={() => bump(item.id, 1, item.default_quantity)}
                              >
                                +
                              </button>
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && !done && (
          <div className="animate-gv-fade">
            <h3 className="m-0 text-[26px] font-semibold tracking-tight">How long should it run with no grid supply?</h3>
            <p className="mb-6.5 mt-2 text-sm text-navy/60">This sets the battery bank, not the panel array.</p>
            <div className="grid max-w-150 grid-cols-2 gap-3 max-[480px]:grid-cols-1">
              {BACKUP_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  className={cardOption(backup === o.id)}
                  onClick={() => {
                    setBackup(o.id);
                    setTimeout(() => go(4), 160);
                  }}
                >
                  <span className="text-lg font-semibold tracking-tight">{o.label}</span>
                  <span className="text-[12.5px] text-navy/55">{o.note}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && !done && (
          <div className="animate-gv-fade">
            <h3 className="m-0 text-[26px] font-semibold tracking-tight">What do you spend on generator fuel each month?</h3>
            <p className="mb-7.5 mt-2 text-sm text-navy/60">Petrol or diesel, your rough average. We compare it against the system cost.</p>
            <div className="max-w-150">
              <div className="flex items-baseline gap-2.5">
                <span className="text-[46px] font-semibold tracking-tight">{fmt(fuel)}</span>
                <span className="text-sm text-navy/50">per month</span>
              </div>
              <input
                type="range"
                min={0}
                max={500000}
                step={5000}
                value={fuel}
                onChange={(e) => setFuel(Number(e.target.value))}
                className="my-5.5 h-1.5 w-full accent-green"
              />
              <div className="flex justify-between text-[11.5px] text-navy/40">
                <span>₦0</span>
                <span>₦500,000+</span>
              </div>
              <div className="mt-5.5 flex flex-wrap gap-2">
                {[20000, 60000, 120000, 250000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={cn(
                      'rounded-full border px-4.5 py-2.25 text-[13px] font-medium',
                      fuel === v ? 'border-green bg-green/8' : 'border-navy/14 bg-white'
                    )}
                    onClick={() => setFuel(v)}
                  >
                    {fmt(v)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 5 && !done && (
          <div className="min-w-0 animate-gv-fade">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-green">Your recommendation</span>
            <div className="mt-3.5 grid grid-cols-2 gap-4 max-[480px]:grid-cols-1">
              <div className="relative overflow-hidden rounded-2xl bg-ink p-5.5 text-white">
                <div className="pointer-events-none absolute -right-7.5 -top-7.5 h-32.5 w-32.5 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(245,166,35,.36),rgba(245,166,35,0)_70%)]" />
                <div className="relative">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-white/45">System size</span>
                  <div className="mt-1 text-[44px] font-semibold leading-[1.05] tracking-tight">{result.tier ? result.tier.name : '—'}</div>
                  <p className="mb-4 mt-1 text-[12.5px] text-white/55">
                    {result.watts.toLocaleString()}W load · {backupLabel()} backup
                  </p>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-white/45">Indicative price</span>
                  <div className="mt-1 text-[19px] font-semibold text-amber">
                    {result.tier ? `${fmt(result.tier.price_range_min)} – ${fmt(result.tier.price_range_max)}` : '—'}
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-navy/10 bg-cream p-5.5">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-navy/50">Against your fuel spend</span>
                <div className="mt-3.5 flex flex-col gap-2.75">
                  {compareRows.map((r) => (
                    <div key={r.label} className="flex items-baseline justify-between gap-3 border-b border-navy/9 pb-2.25">
                      <span className="text-[12.5px] leading-snug text-navy/65">{r.label}</span>
                      <span className="whitespace-nowrap text-[14.5px] font-semibold">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-green/30 bg-green/5 px-5.5 py-5">
              <div className="mb-2.5 flex items-center gap-2.25">
                <span className="flex h-5.5 w-5.5 items-center justify-center rounded-md bg-green text-xs font-bold text-white">G</span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-green-dark">What this means for you</span>
              </div>
              <p className="m-0 min-h-19 text-[14.5px] leading-relaxed text-navy">
                {aiText}
                <span className={cn('ml-0.5 text-green', typing ? 'inline animate-gv-caret' : 'hidden')}>▌</span>
              </p>
            </div>
          </div>
        )}

        {step === 6 && !done && (
          <form className="animate-gv-fade" onSubmit={(e) => e.preventDefault()}>
            <h3 className="m-0 text-[26px] font-semibold tracking-tight">Where should we send this?</h3>
            <p className="mb-6.5 mt-2 text-sm text-navy/60">
              Your {result.tier ? result.tier.name : '—'} recommendation is ready. Leave your name, phone number and email, and an engineer
              will call to arrange the site inspection.
            </p>
            <div className="flex max-w-110 flex-col gap-4">
              <Field label="Full name" error={contactForm.formState.errors.name?.message}>
                <Input type="text" placeholder="Adaeze Okonkwo" {...contactForm.register('name')} />
              </Field>
              <Field label="Phone number" error={contactForm.formState.errors.phone?.message}>
                <Input type="tel" placeholder="0803 000 0000" {...contactForm.register('phone')} />
              </Field>
              <Field label="Email address" error={contactForm.formState.errors.email?.message}>
                <Input type="email" placeholder="you@email.com" {...contactForm.register('email')} />
              </Field>
              <p className="m-0 text-xs leading-relaxed text-navy/50">
                We call once to arrange the inspection, and send the written recommendation to your email. No marketing lists.
              </p>
            </div>
          </form>
        )}

        {step === 7 && !done && (
          <div className="animate-gv-fade">
            <h3 className="m-0 text-[26px] font-semibold tracking-tight">How would you prefer to pay?</h3>
            <p className="mb-6 mt-2 text-sm text-navy/60">Nothing is charged here. It tells the engineer what to prepare.</p>
            <div className="flex max-w-130 flex-col gap-2.25">
              {PAYMENT_METHODS.map((o) => (
                <button key={o.id} type="button" className={pillOption(payment === o.id)} onClick={() => setPayment(o.id)}>
                  {o.label}
                </button>
              ))}
            </div>
            <label className="mt-5.5 flex max-w-130 cursor-pointer items-start gap-2.75">
              <input
                type="checkbox"
                checked={inspection}
                onChange={() => setInspection((v) => !v)}
                className="mt-0.75 h-4.25 w-4.25 accent-green"
              />
              <span className="text-[13.5px] leading-relaxed text-navy/75">
                Request a free site inspection. An engineer visits, confirms the roof and load, and issues the final quote.
              </span>
            </label>
          </div>
        )}

        {done && (
          <div className="flex max-w-130 flex-1 animate-gv-fade flex-col items-start justify-center">
            <span className="flex h-11.5 w-11.5 items-center justify-center rounded-2xl bg-green text-[22px] font-semibold text-white">✓</span>
            <h3 className="m-0 mt-5 text-[28px] font-semibold tracking-tight">Assessment complete</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-navy/65">
              Thank you, {nameOrYou}. Your {result.tier ? result.tier.name : '—'} recommendation and everything you entered has gone to our
              team. An engineer will call {phoneOrSoon} to arrange the inspection.
            </p>
            <div className="mt-6 rounded-2xl bg-cream px-4.5 py-4 text-[13px] leading-relaxed text-navy/70">
              Reference <strong className="text-navy">{ref}</strong> — quote it when you call us on 0800 GAVIKINA.
            </div>
            <Button variant="outline" className="mt-6" onClick={restart}>
              Run another assessment
            </Button>
          </div>
        )}

        {!done && (
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6.5">
            <button
              type="button"
              className={cn(
                'rounded-lg border border-navy/16 bg-transparent px-4.5 py-3 text-[13.5px] font-medium text-navy/70',
                step === 0 && 'invisible'
              )}
              onClick={() => go(step - 1)}
            >
              ← Back
            </button>
            <div className="flex items-center gap-4">
              <span className="text-[12.5px] text-navy/45">Step {step + 1} of 8</span>
              <Button
                disabled={!nextEnabled || submitMutation.isPending}
                variant={nextEnabled ? 'primary' : undefined}
                className={cn(!nextEnabled && 'bg-navy/14 text-navy/40 hover:bg-navy/14')}
                onClick={() => {
                  if (!nextEnabled) return;
                  if (lastStep) finish();
                  else go(step + 1);
                }}
              >
                {submitMutation.isPending ? 'Submitting…' : lastStep ? 'Submit assessment' : step === 5 ? 'Continue' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
