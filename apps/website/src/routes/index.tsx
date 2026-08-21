import { createFileRoute, Link } from '@tanstack/react-router';
import { fmtRange, SEED_PROJECTS, TIERS } from '@gavikina/engine';
import { Button, cn } from '@gavikina/ui';
import ImageSlot from '../components/ImageSlot';
import Reveal from '../components/Reveal';
import SolarCalculator from '../components/SolarCalculator';
import { HERO_SLOTS, PROJECT_PHOTOS } from '../lib/content';
import { openCalc, openAssess } from '../store/modal';

export const Route = createFileRoute('/')({ component: Home });

const VALUE_PROPS = [
  { icon: '⌁', title: 'Sized from a measured load', body: 'We add up what you actually run, add engineering headroom, then pick the tier. No guessing from your house size.' },
  { icon: '₦', title: 'Cheaper than the generator', body: 'Most customers are already spending a system every few years on fuel. The assessment shows you that comparison in your own numbers.' },
  { icon: '✓', title: 'One team, start to finish', body: 'The engineer who sizes your system is the one who commissions it, and the one you call afterwards.' },
];

const HERO_FACTS = [
  { value: '1.5–10kVA', label: 'Five system tiers, sized from your real load' },
  { value: 'Free', label: 'Site inspection before any quote is fixed' },
  { value: 'One price', label: 'Panels, inverter, batteries, install, commissioning' },
];

const STEPS_SHORT = [
  { num: '01', title: 'Size it', body: 'Use the calculator, or go straight to the full assessment.' },
  { num: '02', title: 'Inspect', body: 'An engineer visits, measures the load and checks the roof.' },
  { num: '03', title: 'Install', body: 'Mounting, wiring, protection and commissioning by our team.' },
  { num: '04', title: 'Aftercare', body: 'Warranty registered in your name, and we stay reachable.' },
];

const KEN_ANIM = ['animate-[gvKenA_32s_ease-in-out_infinite]', 'animate-[gvKenB_32s_ease-in-out_infinite]', 'animate-[gvKenA_32s_ease-in-out_infinite]', 'animate-[gvKenB_32s_ease-in-out_infinite]'];
const KEN_DELAY = ['0s', '-24s', '-16s', '-8s'];

function Home() {
  const homeProjects = SEED_PROJECTS.slice(0, 3);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div
          className="absolute inset-0 opacity-50 [background-size:56px_56px] [mask-image:radial-gradient(ellipse_70%_80%_at_15%_30%,#000,transparent)]"
          style={{ backgroundImage: 'linear-gradient(rgba(46,158,69,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(46,158,69,.16) 1px,transparent 1px)' }}
        />
        <div className="absolute -right-15 -top-35 h-130 w-130 rounded-full bg-[radial-gradient(circle_at_38%_32%,rgba(245,166,35,.3),rgba(245,166,35,0)_66%)]" />
        <div className="relative mx-auto grid max-w-[1260px] grid-cols-[minmax(0,1.05fr)_minmax(0,.85fr)] items-center gap-15 px-8 pb-24 pt-22 max-[900px]:grid-cols-1 max-[900px]:gap-10 max-[640px]:px-5">
          <div>
            <span className="inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-widest text-amber">
              <span className="h-px w-5.5 bg-amber" />
              Homes &amp; businesses across Nigeria
            </span>
            <h1 className="mt-5 max-w-[16ch] text-[clamp(34px,5.2vw,60px)] font-semibold leading-[1.06] tracking-tight">
              Stop renting your power from a generator.
            </h1>
            <p className="mt-5.5 max-w-[52ch] text-[17.5px] leading-relaxed text-white/68">
              We design, install and maintain solar systems sized to what you actually run. Size yours in ninety seconds — no contact details
              required.
            </p>
            <div className="mt-8.5 flex gap-3 max-[520px]:gap-2">
              <Button size="lg" onClick={openCalc} className="max-[520px]:flex-1 max-[520px]:whitespace-normal max-[520px]:px-2.5 max-[520px]:py-3.25 max-[520px]:text-[12.5px] max-[520px]:leading-snug">
                Size my system
              </Button>
              <Button
                variant="outline-dark"
                size="lg"
                onClick={() => openAssess()}
                className="max-[520px]:flex-1 max-[520px]:whitespace-normal max-[520px]:px-2.5 max-[520px]:py-3.25 max-[520px]:text-[12.5px] max-[520px]:leading-snug"
              >
                Take the full assessment
              </Button>
            </div>
            <div className="mt-13 flex flex-wrap gap-8.5">
              {HERO_FACTS.map((f) => (
                <div className="flex flex-col gap-1" key={f.label}>
                  <span className="text-[22px] font-semibold tracking-tight text-white">{f.value}</span>
                  <span className="max-w-[20ch] text-[12.5px] leading-snug text-white/50">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/12">
              {HERO_SLOTS.map((slot, i) => (
                <div key={slot.id} className={cn('absolute inset-0 will-change-[transform,opacity]', KEN_ANIM[i])} style={{ animationDelay: KEN_DELAY[i] }}>
                  <ImageSlot {...slot} />
                </div>
              ))}
            </div>
            <div className="absolute -bottom-6.5 -left-6.5 z-2 max-w-57.5 rounded-2xl bg-white px-5 py-4 text-navy shadow-[0_22px_44px_-18px_rgba(16,19,40,.55)]">
              <span className="text-[10.5px] font-semibold uppercase tracking-widest text-navy/45">Typical outcome</span>
              <p className="m-0 mt-1.5 text-[13.5px] font-medium leading-snug">A 3.5kVA system replaces the generator for most two-bedroom homes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="mx-auto max-w-[1260px] px-8 pb-5 pt-20 max-[640px]:px-5">
        <div className="grid grid-cols-3 gap-6.5 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
          {VALUE_PROPS.map((v, i) => (
            <Reveal key={v.title} delay={i * 60}>
              <div className="rounded-2xl border border-navy/10 bg-white p-7">
                <span className="flex h-9.5 w-9.5 items-center justify-center rounded-xl bg-green/10 text-base font-semibold text-green">
                  {v.icon}
                </span>
                <h3 className="mt-4.5 text-lg font-semibold">{v.title}</h3>
                <p className="mt-2.25 text-sm leading-relaxed text-navy/62">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CALCULATOR TEASER */}
      <section className="mt-20 bg-cream py-19.5">
        <div className="mx-auto max-w-[1260px] px-8 max-[640px]:px-5">
          <div className="mb-8.5 flex flex-wrap items-end justify-between gap-7.5">
            <div>
              <span className="text-[11.5px] font-semibold uppercase tracking-widest text-green">Solar calculator</span>
              <h2 className="mt-3 max-w-[22ch] text-[clamp(26px,4vw,38px)] font-semibold leading-[1.14] tracking-tight">
                Size your system without leaving this page.
              </h2>
            </div>
          </div>
          <SolarCalculator onAssessment={openAssess} />
        </div>
      </section>

      {/* TIERS */}
      <section className="mx-auto max-w-[1260px] px-8 pt-20.5 max-[640px]:px-5">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-7.5">
          <div>
            <span className="text-[11.5px] font-semibold uppercase tracking-widest text-green">System tiers</span>
            <h2 className="mt-3 text-[clamp(26px,4vw,38px)] font-semibold leading-[1.14] tracking-tight">Five sizes. One honest price range each.</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/catalogue">See the full catalogue →</Link>
          </Button>
        </div>
        <div className="grid grid-cols-5 gap-3.5 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
          {TIERS.map((t, i) => (
            <Reveal key={t.id} delay={i * 50}>
              <div className="flex flex-col gap-3 rounded-2xl border border-navy/10 bg-white p-5.5 pb-6">
                <span className="text-[26px] font-semibold tracking-tight">{t.name}</span>
                <span className="text-sm font-semibold text-green">{fmtRange(t)}</span>
                <p className="m-0 flex-1 text-[12.5px] leading-relaxed text-navy/60">{t.notes}</p>
                <button type="button" className="border-t border-navy/10 pt-2.25 text-left text-[12.5px] font-semibold text-green hover:text-green-dark" onClick={openCalc}>
                  Check my fit →
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* RECENT PROJECTS */}
      <section className="mx-auto max-w-[1260px] px-8 pt-20.5 max-[640px]:px-5">
        <div className="mb-7.5 flex flex-wrap items-end justify-between gap-7.5">
          <h2 className="text-[clamp(26px,4vw,38px)] font-semibold leading-[1.14] tracking-tight">Recently commissioned</h2>
          <Button variant="outline" asChild>
            <Link to="/projects">All past projects →</Link>
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-5 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
          {homeProjects.map((p, i) => {
            const photo = PROJECT_PHOTOS[p.id];
            return (
              <Reveal key={p.id} delay={i * 60}>
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-cream">
                    <ImageSlot src={photo.src} placeholder={p.title + ' — install photo'} credit={photo.credit} creditHref={photo.creditHref} />
                  </div>
                  <div className="mt-3.5 flex items-baseline justify-between gap-3">
                    <span className="text-[15.5px] font-semibold tracking-tight">{p.title}</span>
                    <span className="whitespace-nowrap text-[12.5px] font-semibold text-green">{p.size}</span>
                  </div>
                  <span className="text-[12.5px] text-navy/55">{p.location}</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-[1260px] px-8 pt-20.5 max-[640px]:px-5">
        <h2 className="mb-8.5 text-[clamp(26px,4vw,38px)] font-semibold leading-[1.14] tracking-tight">From first call to power on</h2>
        <div className="grid grid-cols-4 border-t border-navy/12 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
          {STEPS_SHORT.map((s) => (
            <div key={s.num} className="border-r border-navy/8 py-6 pr-6 last:border-r-0 max-[980px]:border-r-0">
              <span className="text-[11.5px] font-semibold tracking-widest text-amber">{s.num}</span>
              <h3 className="mt-3 text-[16.5px] font-semibold">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-navy/60">{s.body}</p>
            </div>
          ))}
        </div>
        <Link to="/how-it-works" className="mt-6.5 inline-block text-[13.5px] font-semibold text-green hover:text-green-dark">
          The full process, step by step →
        </Link>
      </section>

      {/* CTA */}
      <section className="relative mt-22.5 overflow-hidden bg-navy text-white">
        <div className="absolute -bottom-40 left-2/5 h-110 w-110 rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(46,158,69,.4),rgba(46,158,69,0)_68%)]" />
        <div className="relative mx-auto flex max-w-[1260px] flex-wrap items-center justify-between gap-11 px-8 py-19 max-[640px]:px-5">
          <div>
            <h2 className="max-w-[22ch] text-[clamp(28px,4vw,40px)] font-semibold leading-[1.12] tracking-tight">
              Ready for the number that comes with a plan?
            </h2>
            <p className="mt-4 max-w-[50ch] text-base leading-relaxed text-white/68">
              The full assessment adds your backup hours and fuel spend, then gives you a personalised recommendation and a free site
              inspection.
            </p>
          </div>
          <Button variant="amber" size="lg" className="flex-none" onClick={() => openAssess()}>
            Start the full assessment
          </Button>
        </div>
      </section>
    </div>
  );
}
