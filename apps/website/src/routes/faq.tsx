import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { cn } from '@gavikina/ui';
import { FAQS } from '../lib/content';

export const Route = createFileRoute('/faq')({ component: Faq });

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div className="mx-auto max-w-225 px-8 pb-22.5 pt-17.5 max-[640px]:px-5">
      <span className="text-[11.5px] font-semibold uppercase tracking-widest text-green">FAQ</span>
      <h1 className="mt-3.5 text-[clamp(34px,6vw,48px)] font-semibold leading-tight tracking-tight">Questions we get every week.</h1>
      <div className="mt-10 flex flex-col border-t border-navy/12">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="border-b border-navy/12">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-5 border-0 bg-transparent py-5.5 text-left text-navy"
              >
                <span className="text-[17px] font-medium tracking-tight">{f.q}</span>
                <span
                  className={cn(
                    'flex h-6.5 w-6.5 flex-none items-center justify-center rounded-full text-base transition-transform',
                    isOpen ? 'rotate-45 bg-green text-white' : 'bg-cream text-navy/60'
                  )}
                >
                  +
                </span>
              </button>
              {isOpen && <p className="animate-gv-in m-0 pb-6 pr-15 text-[15px] leading-loose text-navy/66">{f.a}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
