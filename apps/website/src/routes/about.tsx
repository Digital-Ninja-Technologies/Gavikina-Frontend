import { createFileRoute } from '@tanstack/react-router';
import ImageSlot from '../components/ImageSlot';
import { ABOUT_PHOTO } from '../lib/content';

export const Route = createFileRoute('/about')({ component: About });

const PRINCIPLES = [
  { title: 'Measured, not guessed', body: 'Every quote starts from a load audit at your distribution board.' },
  { title: 'One price, all in', body: 'Mounting, protection and commissioning are never separate line items.' },
  { title: 'Lithium only', body: 'We stopped installing lead-acid banks. They do not survive the duty cycle here.' },
  { title: 'You own it', body: 'No lease, no subscription, no lock-in to us for spares.' },
];

function About() {
  return (
    <div className="mx-auto max-w-[1260px] px-8 pb-22.5 pt-17.5 max-[640px]:px-5">
      <span className="text-[11.5px] font-semibold uppercase tracking-widest text-green">About us</span>
      <h1 className="mt-3.5 max-w-[20ch] text-[clamp(34px,6vw,48px)] font-semibold leading-tight tracking-tight">
        We build power you own outright.
      </h1>
      <div className="mt-11 grid grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] gap-14 max-[900px]:grid-cols-1 max-[900px]:gap-8">
        <div className="flex flex-col gap-5 text-[15.5px] leading-loose text-navy/72">
          <p className="m-0">
            Gavikina Energy installs solar systems for homes and businesses that are tired of budgeting for fuel. We are engineers first:
            every system is sized from a measured load, not a sales target, and every quote is confirmed on site before a panel is ordered.
          </p>
          <p className="m-0">
            The work is deliberately narrow. We size, supply, install and commission complete systems — panels, inverter, batteries,
            mounting, protection and cabling — and we stay reachable afterwards. No cart, no bundles, no upsell on hardware you will not use.
          </p>
          <p className="m-0">What you own at the end is an asset on your roof, not a subscription.</p>
          <div className="mt-3.5 grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="rounded-2xl bg-cream p-5">
                <h3 className="m-0 text-[15px] text-navy">{p.title}</h3>
                <p className="m-0 mt-1.75 text-[13px] leading-relaxed text-navy/65">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-cream max-[900px]:aspect-[16/10]">
          <ImageSlot src={ABOUT_PHOTO.src} placeholder="Team or install photo" credit={ABOUT_PHOTO.credit} creditHref={ABOUT_PHOTO.creditHref} />
        </div>
      </div>
    </div>
  );
}
