import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { investorRequestSchema  } from '@gavikina/schemas';
import type {InvestorRequestValues} from '@gavikina/schemas';
import { Field, Input, Textarea } from '@gavikina/ui';
import { submitInvestorRequest } from '../lib/api';

export const Route = createFileRoute('/investors')({ component: Investors });

const INVESTOR_STATS = [
  { value: '₦60k+', label: 'Typical monthly generator fuel spend per household we assess' },
  { value: '5 tiers', label: 'Standardised systems, so installation stays repeatable' },
  { value: '3–5 yrs', label: 'Typical payback against current fuel spend' },
];

const INVESTOR_SECTIONS = [
  { title: 'The opportunity', body: 'Grid supply is unreliable and fuel is the default fallback. Households and small businesses already treat power as a monthly cost. Solar converts that recurring cost into a one-off asset, which makes the sale a comparison rather than a conversion.' },
  { title: 'How we operate', body: 'Standardised system tiers keep procurement and installation repeatable, and every job is sized by the same engine before an engineer confirms it on site. Growth comes from installation capacity and the agent network, not from bespoke engineering per customer.' },
  { title: 'Where we are now', body: 'Residential and small-business installations across Lagos, Abuja and Benin City, with an agent network in development. Current numbers, pipeline and projections are in the investor pack.' },
];

function Investors() {
  const form = useForm<InvestorRequestValues>({
    resolver: zodResolver(investorRequestSchema),
    defaultValues: { name: '', email: '', phone: '', message: '' },
  });
  const [sent, setSent] = useState(false);
  const mutation = useMutation({ mutationFn: submitInvestorRequest });

  const onSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync(values);
    setSent(true);
  });

  return (
    <div className="mx-auto max-w-[1260px] px-8 pb-22.5 pt-17.5 max-[640px]:px-5">
      <span className="text-[11.5px] font-semibold uppercase tracking-widest text-green">Investors guide</span>
      <h1 className="mt-3.5 max-w-[22ch] text-[clamp(34px,6vw,48px)] font-semibold leading-tight tracking-tight">
        A grid that cannot keep up is a market.
      </h1>
      <div className="mt-11 grid grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] gap-14 max-[900px]:grid-cols-1 max-[900px]:gap-8">
        <div>
          <p className="m-0 max-w-145 text-base leading-loose text-navy/70">
            Gavikina Energy sells complete solar systems to households and small businesses that already spend heavily on generator fuel
            every month. The customer is not being persuaded to change habits — they are being offered a cheaper version of what they
            already buy.
          </p>
          <div className="mt-8.5 grid grid-cols-3 gap-4 max-[640px]:grid-cols-1">
            {INVESTOR_STATS.map((s) => (
              <div key={s.label} className="rounded-2xl bg-ink p-5.5 text-white">
                <div className="text-[27px] font-semibold tracking-tight text-amber">{s.value}</div>
                <div className="mt-1.5 text-[12.5px] leading-snug text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-8.5 flex flex-col gap-5.5">
            {INVESTOR_SECTIONS.map((s) => (
              <div key={s.title}>
                <h3 className="m-0 text-[19px] font-semibold tracking-tight">{s.title}</h3>
                <p className="m-0 mt-2.25 max-w-150 text-[14.5px] leading-loose text-navy/66">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-7.5 rounded-2xl border border-amber/40 bg-amber/7 px-6 py-5.5">
            <p className="m-0 text-[13.5px] leading-loose text-navy/78">
              <strong>Financials are not published here.</strong> Detailed accounts, projections and the business plan are sent directly
              after a request is reviewed.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-navy/12 bg-white p-8 px-8.5 shadow-[0_18px_44px_-34px_rgba(16,19,40,.4)]">
          {!sent ? (
            <form onSubmit={onSubmit} noValidate>
              <h3 className="m-0 text-[22px] font-semibold tracking-tight">Request the full materials</h3>
              <p className="mb-6 mt-2 text-[13.5px] leading-relaxed text-navy/60">
                Tell us who you are and what you are looking for. We reply to serious enquiries with the full pack.
              </p>
              <div className="flex flex-col gap-3.5">
                <Field label="Name" error={form.formState.errors.name?.message}>
                  <Input type="text" placeholder="Full name" {...form.register('name')} />
                </Field>
                <Field label="Email address" error={form.formState.errors.email?.message}>
                  <Input type="email" placeholder="you@email.com" {...form.register('email')} />
                </Field>
                <Field label="Phone number" error={form.formState.errors.phone?.message}>
                  <Input type="tel" placeholder="0803 000 0000" {...form.register('phone')} />
                </Field>
                <Field label="What are you looking for?" error={form.formState.errors.message?.message}>
                  <Textarea rows={4} placeholder="Ticket size, horizon, questions" {...form.register('message')} />
                </Field>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="mt-1.5 rounded-xl border-0 bg-ink px-5 py-3.5 text-[14.5px] font-semibold text-white hover:bg-navy disabled:opacity-60"
                >
                  {mutation.isPending ? 'Submitting…' : 'Request materials'}
                </button>
              </div>
            </form>
          ) : (
            <div className="animate-gv-in py-6.5">
              <span className="flex h-10.5 w-10.5 items-center justify-center rounded-2xl bg-ink text-xl font-semibold text-amber">✓</span>
              <h3 className="m-0 mt-4.5 text-[22px] font-semibold tracking-tight">Request logged</h3>
              <p className="m-0 mt-2.5 text-[14.5px] leading-loose text-navy/66">
                We review each request before sending financials. Expect a reply within a few working days.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
