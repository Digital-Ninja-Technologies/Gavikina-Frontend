import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@gavikina/ui';
import { openAssess } from '../store/modal';

export const Route = createFileRoute('/how-it-works')({ component: HowItWorks });

const STEPS_LONG = [
  { num: '01', title: 'Tell us what you run', body: 'The assessment walks you through property type, appliances, how long you need to run without the grid, and what you currently spend on fuel. You see the recommendation before we ask for your name.', meta: 'Ten minutes, online' },
  { num: '02', title: 'We call to book the inspection', body: 'An engineer calls to confirm what you entered and agree a visit. Nothing is charged and nothing is ordered at this stage.', meta: 'Within one working day' },
  { num: '03', title: 'Site inspection', body: 'We measure the real load at the board, assess the roof or ground area, check cable runs and shading, and confirm where the batteries and inverter will live.', meta: 'Free, about two hours' },
  { num: '04', title: 'Fixed quote', body: 'You get a single figure, a component list with brands and warranties, and a payment schedule. The figure does not move after this point unless you change the scope.', meta: 'Within two working days' },
  { num: '05', title: 'Installation and commissioning', body: 'Mounting, DC and AC wiring, protection devices, and full commissioning with you present. We hand over the as-built drawing and register every warranty in your name.', meta: 'One to three days for most homes' },
  { num: '06', title: 'Aftercare', body: 'Workmanship faults are ours to fix. Components carry manufacturer cover we registered for you. Call the same number you called at the start.', meta: 'Ongoing' },
];

function HowItWorks() {
  return (
    <div className="mx-auto max-w-[1260px] px-8 pb-22.5 pt-17.5 max-[640px]:px-5">
      <span className="text-[11.5px] font-semibold uppercase tracking-widest text-green">How it works</span>
      <h1 className="mt-3.5 max-w-[20ch] text-[clamp(34px,6vw,48px)] font-semibold leading-tight tracking-tight">
        Six steps, and then it just runs.
      </h1>
      <div className="mt-12 flex max-w-220 flex-col">
        {STEPS_LONG.map((s, i) => (
          <div key={s.num} className="relative grid grid-cols-[74px_minmax(0,1fr)] gap-7 pb-9.5">
            <div className="relative flex flex-col items-center">
              <span className="z-1 flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-ink text-base font-semibold text-amber">
                {s.num}
              </span>
              {i < STEPS_LONG.length - 1 && <span className="mt-1.5 w-px flex-1 bg-navy/13" />}
            </div>
            <div className="pt-2">
              <h3 className="m-0 text-[22px] font-semibold tracking-tight">{s.title}</h3>
              <p className="m-0 mt-2.5 max-w-150 text-[15px] leading-loose text-navy/66">{s.body}</p>
              <span className="mt-2.5 inline-block text-[12.5px] font-semibold text-green">{s.meta}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-7.5 rounded-3xl bg-cream p-8.5 px-9.5">
        <div>
          <h3 className="m-0 text-[22px] font-semibold tracking-tight">Start at step one now</h3>
          <p className="m-0 mt-2 max-w-115 text-[14.5px] text-navy/65">
            The assessment is the enquiry. Ten minutes, and an engineer calls to book the inspection.
          </p>
        </div>
        <Button size="lg" className="flex-none" onClick={() => openAssess()}>
          Take the full assessment
        </Button>
      </div>
    </div>
  );
}
