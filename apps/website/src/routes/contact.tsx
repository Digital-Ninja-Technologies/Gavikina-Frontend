import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { contactFormSchema  } from '@gavikina/schemas';
import type {ContactFormValues} from '@gavikina/schemas';
import { Button, Field, Input, Textarea } from '@gavikina/ui';
import { submitContact } from '../lib/api';

export const Route = createFileRoute('/contact')({ component: Contact });

const CONTACT_METHODS = [
  { icon: '☎', label: 'Phone', value: '0800 428 4546', note: 'Mon–Sat, 8am to 6pm' },
  { icon: '✆', label: 'WhatsApp', value: '+234 803 000 0000', note: 'Fastest for photos of your board or roof' },
  { icon: '✉', label: 'Email', value: 'hello@gavikinaenergy.com', note: 'Replied the same working day' },
  { icon: '⌖', label: 'Office', value: '14 Adeola Odeku Street, Victoria Island, Lagos', note: 'Visits by appointment' },
];

function Contact() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', contact: '', message: '' },
  });
  const [sent, setSent] = useState(false);
  const mutation = useMutation({ mutationFn: submitContact });

  const onSubmit = form.handleSubmit(async (values) => {
    await mutation.mutateAsync(values);
    setSent(true);
  });

  return (
    <div className="mx-auto max-w-[1260px] px-8 pb-22.5 pt-17.5 max-[640px]:px-5">
      <span className="text-[11.5px] font-semibold uppercase tracking-widest text-green">Contact</span>
      <h1 className="mt-3.5 text-[clamp(34px,6vw,48px)] font-semibold leading-tight tracking-tight">Talk to an engineer.</h1>
      <div className="mt-11 grid grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] gap-13 max-[900px]:grid-cols-1 max-[900px]:gap-8">
        <div>
          <div className="flex flex-col gap-3">
            {CONTACT_METHODS.map((c) => (
              <div key={c.label} className="flex items-start gap-4 rounded-2xl border border-navy/11 px-6 py-5.5">
                <span className="flex h-9.5 w-9.5 flex-none items-center justify-center rounded-xl bg-green/10 text-[15px] font-semibold text-green">
                  {c.icon}
                </span>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-navy/45">{c.label}</span>
                  <div className="mt-1 text-base font-medium tracking-tight">{c.value}</div>
                  <div className="mt-0.5 text-[12.5px] text-navy/55">{c.note}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-navy/11 bg-cream">
            <iframe
              title="Map of 14 Adeola Odeku Street, Victoria Island, Lagos"
              src="https://www.openstreetmap.org/export/embed.html?bbox=3.4141%2C6.4231%2C3.4291%2C6.4331&layer=mapnik&marker=6.4281%2C3.4216"
              className="block h-57.5 w-full border-0"
            />
            <div className="flex flex-wrap items-center justify-between gap-4.5 bg-white px-5 py-4">
              <div>
                <div className="text-[14.5px] font-medium tracking-tight">14 Adeola Odeku Street</div>
                <div className="mt-0.5 text-[12.5px] text-navy/55">Victoria Island, Lagos</div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="https://www.openstreetmap.org/?mlat=6.4281&mlon=3.4216#map=17/6.4281/3.4216" target="_blank" rel="noopener noreferrer">
                  Get directions
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-cream p-8.5 px-9">
          {!sent ? (
            <form onSubmit={onSubmit} noValidate>
              <h3 className="m-0 text-[23px] font-semibold tracking-tight">Send us a message</h3>
              <p className="mb-6 mt-2 text-[13.5px] leading-relaxed text-navy/62">
                Goes straight to our team inbox. For a sized recommendation, the assessment is faster.
              </p>
              <div className="flex flex-col gap-3.5">
                <Field label="Name" error={form.formState.errors.name?.message}>
                  <Input type="text" placeholder="Full name" {...form.register('name')} />
                </Field>
                <Field label="Email or phone" error={form.formState.errors.contact?.message}>
                  <Input type="text" placeholder="How we reach you" {...form.register('contact')} />
                </Field>
                <Field label="Message" error={form.formState.errors.message?.message}>
                  <Textarea rows={5} placeholder="What do you need?" {...form.register('message')} />
                </Field>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="mt-1.5 rounded-xl border-0 bg-green px-5 py-3.5 text-[14.5px] font-semibold text-white hover:bg-green-dark disabled:opacity-60"
                >
                  {mutation.isPending ? 'Sending…' : 'Send message'}
                </button>
              </div>
            </form>
          ) : (
            <div className="animate-gv-in py-7.5">
              <span className="flex h-10.5 w-10.5 items-center justify-center rounded-2xl bg-green text-xl font-semibold text-white">✓</span>
              <h3 className="m-0 mt-4.5 text-[22px] font-semibold tracking-tight">Message sent</h3>
              <p className="m-0 mt-2.5 text-[14.5px] leading-loose text-navy/66">
                It is in our inbox and we reply the same working day. If it is urgent, WhatsApp is fastest.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
