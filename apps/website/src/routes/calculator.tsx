import { createFileRoute } from '@tanstack/react-router';
import SolarCalculator from '../components/SolarCalculator';
import { openAssess } from '../store/modal';

export const Route = createFileRoute('/calculator')({ component: CalculatorPage });

function CalculatorPage() {
  return (
    <div className="mx-auto max-w-[1260px] px-8 pb-22.5 pt-17.5 max-[640px]:px-5">
      <span className="text-[11.5px] font-semibold uppercase tracking-widest text-green">Solar calculator</span>
      <h1 className="mt-3.5 max-w-[22ch] text-[clamp(34px,6vw,48px)] font-semibold leading-tight tracking-tight">
        What size do you actually need?
      </h1>
      <p className="mb-8.5 mt-4 max-w-145 text-base leading-relaxed text-navy/65">
        Pick your appliances. We compute the load, add engineering headroom, and match it to a system tier — the same calculation an
        engineer runs on site.
      </p>
      <SolarCalculator onAssessment={openAssess} />
    </div>
  );
}
