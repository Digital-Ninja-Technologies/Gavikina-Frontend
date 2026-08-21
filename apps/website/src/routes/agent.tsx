import { useRef, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { agentApplicationSchema  } from '@gavikina/schemas';
import type {AgentApplicationValues} from '@gavikina/schemas';
import { Field, Input, Textarea } from '@gavikina/ui';
import { submitAgentApplication } from '../lib/api';

export const Route = createFileRoute('/agent')({ component: Agent });

const AGENT_FACTS = [
  { label: 'What you do', body: 'Introduce customers, help them complete the assessment, attend the inspection.' },
  { label: 'What you earn', body: 'A commission on each commissioned system, tiered by system size.' },
  { label: 'When it is paid', body: 'After commissioning and final payment, in the following payment run.' },
  { label: 'What we provide', body: 'Training, the assessment tool, and an engineer on every site visit.' },
];

const AGENT_REQS = [
  'A defined area you know well and can cover on the ground',
  'A phone number you answer and a willingness to attend inspections',
  'Any sales, electrical or construction background is an advantage, not a requirement',
  'Completion of our two-day product and assessment training before your first introduction',
];

function buildNote(values: AgentApplicationValues) {
  const where = values.location.trim();
  const job = values.occupation.trim();
  let t = 'Thanks' + (values.name ? ', ' + values.name.trim().split(/\s+/)[0] : '') + '. ';
  t += where
    ? 'You are the first applicant we have from ' + where + ', so an introduction there would open ground we do not cover yet. '
    : 'Tell us your area when we call — coverage is how we prioritise agents. ';
  if (job) {
    t += 'Coming from ' + job.toLowerCase() + ', the part of the training that will matter most for you is load assessment: getting the appliance list right is what makes a quote hold. ';
  }
  t += 'Next step is a 15-minute call to confirm your area and book you onto the two-day training. Agents who complete it usually place their first introduction within three weeks.';
  return t;
}

function Agent() {
  const form = useForm<AgentApplicationValues>({
    resolver: zodResolver(agentApplicationSchema),
    defaultValues: { name: '', email: '', phone: '', location: '', occupation: '', reason: '' },
  });
  const [sent, setSent] = useState(false);
  const [aiText, setAiText] = useState('');
  const [typing, setTyping] = useState(false);
  const typeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mutation = useMutation({ mutationFn: submitAgentApplication });

  const onSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync(values);
    setSent(true);
    const full = buildNote(values);
    let i = 0;
    setAiText('');
    setTyping(true);
    if (typeRef.current) clearInterval(typeRef.current);
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
  });

  return (
    <div className="mx-auto max-w-[1260px] px-8 pb-22.5 pt-17.5 max-[640px]:px-5">
      <span className="text-[11.5px] font-semibold uppercase tracking-widest text-green">Become an agent</span>
      <h1 className="mt-3.5 max-w-[22ch] text-[clamp(34px,6vw,48px)] font-semibold leading-tight tracking-tight">
        Sell power in your own neighbourhood.
      </h1>
      <div className="mt-11 grid grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] gap-14 max-[900px]:grid-cols-1 max-[900px]:gap-8">
        <div>
          <p className="m-0 max-w-145 text-base leading-loose text-navy/70">
            Agents introduce customers, walk them through the assessment, and hand the site over to our engineers. You do not carry stock,
            quote prices or handle installation — you find the homes and businesses that are ready and stay with them until commissioning.
          </p>
          <div className="mt-8.5 grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
            {AGENT_FACTS.map((a) => (
              <div key={a.label} className="rounded-2xl border border-navy/10 bg-white p-5.5">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-navy/45">{a.label}</span>
                <p className="m-0 mt-2.25 text-[14.5px] font-medium leading-snug text-navy">{a.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-7.5 rounded-2xl bg-cream p-6.5 px-7">
            <h3 className="m-0 text-[17px] font-semibold tracking-tight">What we ask of you</h3>
            <div className="mt-3.5 flex flex-col gap-2.25">
              {AGENT_REQS.map((r) => (
                <div key={r} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-navy/75">
                  <span className="mt-1.25 h-1.25 w-1.25 flex-none rounded-full bg-green" />
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-navy/12 bg-white p-8 px-8.5 shadow-[0_18px_44px_-34px_rgba(16,19,40,.4)]">
          {!sent ? (
            <form onSubmit={onSubmit} noValidate>
              <h3 className="m-0 text-[22px] font-semibold tracking-tight">Apply to become an agent</h3>
              <p className="mb-6 mt-2 text-[13.5px] leading-relaxed text-navy/60">We review applications weekly and call the ones that fit.</p>
              <div className="flex flex-col gap-3.5">
                <Field label="Full name" error={form.formState.errors.name?.message}>
                  <Input type="text" placeholder="Your name" {...form.register('name')} />
                </Field>
                <Field label="Email address" error={form.formState.errors.email?.message}>
                  <Input type="email" placeholder="you@email.com" {...form.register('email')} />
                </Field>
                <Field label="Phone number" error={form.formState.errors.phone?.message}>
                  <Input type="tel" placeholder="0803 000 0000" {...form.register('phone')} />
                </Field>
                <Field label="Where are you based?" error={form.formState.errors.location?.message}>
                  <Input type="text" placeholder="Area and state" {...form.register('location')} />
                </Field>
                <Field label="Current occupation" error={form.formState.errors.occupation?.message}>
                  <Input type="text" placeholder="What you do now" {...form.register('occupation')} />
                </Field>
                <Field label="Why do you want to join?" error={form.formState.errors.reason?.message}>
                  <Textarea rows={4} placeholder="Tell us about your network and why this fits" {...form.register('reason')} />
                </Field>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="mt-1.5 rounded-xl border-0 bg-green px-5 py-3.5 text-[14.5px] font-semibold text-white hover:bg-green-dark disabled:opacity-60"
                >
                  {mutation.isPending ? 'Submitting…' : 'Submit application'}
                </button>
                <p className="m-0 text-[11.5px] leading-relaxed text-navy/50">
                  Goes to the dashboard tagged as an agent application, separate from customer enquiries.
                </p>
              </div>
            </form>
          ) : (
            <div className="animate-gv-in py-6.5">
              <span className="flex h-10.5 w-10.5 items-center justify-center rounded-2xl bg-green text-xl font-semibold text-white">✓</span>
              <h3 className="m-0 mt-4.5 text-[22px] font-semibold tracking-tight">Application received</h3>
              <p className="m-0 mt-2.5 text-[14.5px] leading-loose text-navy/66">
                Thank you. We review weekly and will call the number you left if there is a fit in your area.
              </p>
              <div className="mt-4.5 rounded-2xl border border-green/30 bg-green/5 px-5.5 py-5">
                <div className="mb-2.5 flex items-center gap-2.25">
                  <span className="flex h-5.5 w-5.5 items-center justify-center rounded-md bg-green text-xs font-bold text-white">G</span>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-green-dark">First read on your application</span>
                </div>
                <p className="m-0 min-h-19 text-[14.5px] leading-loose text-navy">
                  {aiText}
                  <span className={typing ? 'ml-0.5 inline animate-gv-caret text-green' : 'hidden'}>▌</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
