import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Upload } from 'lucide-react';
import { careerApplicationSchema  } from '@gavikina/schemas';
import type {CareerApplicationValues} from '@gavikina/schemas';
import { Field, Input, Textarea } from '@gavikina/ui';
import { submitCareerApplication } from '../lib/api';

export const Route = createFileRoute('/careers')({ component: Careers });

const CAREER_NOTES = [
  'Installers, electrical engineers, assessors and office roles all use this form',
  'Applications stay on file and are reviewed when a role opens',
  'We call shortlisted applicants on the number you leave here',
];

function Careers() {
  const form = useForm<CareerApplicationValues>({
    resolver: zodResolver(careerApplicationSchema),
    defaultValues: { role: '', name: '', email: '', phone: '', location: '', about: '' },
  });
  const [cvName, setCvName] = useState('');
  const [sent, setSent] = useState(false);
  const mutation = useMutation({ mutationFn: submitCareerApplication });

  const onSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync({ ...values, cvName });
    setSent(true);
  });

  const pickCv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCvName(file.name);
  };

  return (
    <div className="mx-auto max-w-[1260px] px-8 pb-22.5 pt-17.5 max-[640px]:px-5">
      <span className="text-[11.5px] font-semibold uppercase tracking-widest text-green">Careers</span>
      <h1 className="mt-3.5 max-w-[20ch] text-[clamp(34px,6vw,48px)] font-semibold leading-tight tracking-tight">
        Work on systems that stay up.
      </h1>
      <p className="mt-4 max-w-135 text-base leading-relaxed text-navy/65">
        We hire engineers and technicians who would rather do a job once, properly.
      </p>
      <div className="mt-11 grid grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] gap-14 max-[900px]:grid-cols-1 max-[900px]:gap-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Open application</h2>
          <p className="mt-3 max-w-110 text-[14.5px] leading-loose text-navy/66">
            We keep every application on file and go through them when a role opens. Tell us the role you are after, even if it is not
            advertised.
          </p>
          <div className="mt-6.5 flex flex-col gap-3">
            {CAREER_NOTES.map((n) => (
              <div key={n} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-navy/75">
                <span className="mt-1.25 h-1.25 w-1.25 flex-none rounded-full bg-green" />
                {n}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-navy/12 bg-white p-8 px-8.5 shadow-[0_18px_44px_-34px_rgba(16,19,40,.4)]">
          {!sent ? (
            <form onSubmit={onSubmit} noValidate>
              <h3 className="m-0 text-[22px] font-semibold tracking-tight">Apply to join the team</h3>
              <p className="mb-6 mt-2 text-[13.5px] leading-relaxed text-navy/60">One form for every role. We reply to the ones we can place.</p>
              <div className="flex flex-col gap-3.5">
                <Field label="Role you are applying for" error={form.formState.errors.role?.message}>
                  <Input type="text" placeholder="e.g. Installation technician" {...form.register('role')} />
                </Field>
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
                <Field label="Relevant experience" error={form.formState.errors.about?.message}>
                  <Textarea rows={4} placeholder="Where you have worked and what you have installed or maintained" {...form.register('about')} />
                </Field>
                <Field label="Upload your CV">
                  <div className="relative flex items-center gap-3.5 rounded-xl border border-dashed border-navy/28 bg-[#FBF9F5] px-4 py-3.5 hover:border-green/60 hover:bg-[#F5F9F4]">
                    <span className="flex h-8.5 w-8.5 flex-none items-center justify-center rounded-xl border border-navy/12 bg-white text-green">
                      <Upload className="h-4 w-4" />
                    </span>
                    <span className="flex min-w-0 flex-col gap-0.5">
                      <span className="truncate text-[13.5px] font-medium text-navy">{cvName || 'Choose a file'}</span>
                      <span className="text-[11.5px] text-navy/50">PDF or Word document, up to 5MB</span>
                    </span>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={pickCv} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                  </div>
                </Field>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="mt-1.5 rounded-xl border-0 bg-green px-5 py-3.5 text-[14.5px] font-semibold text-white hover:bg-green-dark disabled:opacity-60"
                >
                  {mutation.isPending ? 'Submitting…' : 'Submit application'}
                </button>
                <p className="m-0 text-[11.5px] leading-relaxed text-navy/50">Your CV is attached to the application in the dashboard. No email needed.</p>
              </div>
            </form>
          ) : (
            <div className="animate-gv-in py-6.5">
              <span className="flex h-10.5 w-10.5 items-center justify-center rounded-2xl bg-green text-xl font-semibold text-white">✓</span>
              <h3 className="m-0 mt-4.5 text-[22px] font-semibold tracking-tight">Application received</h3>
              <p className="m-0 mt-2.5 text-[14.5px] leading-loose text-navy/66">
                Thank you. We keep it on file and will call the number you left when a matching role opens.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
