import { createFileRoute } from '@tanstack/react-router';
import FullAssessment from '../components/FullAssessment';

export const Route = createFileRoute('/assessment')({ component: AssessmentPage });

function AssessmentPage() {
  return (
    <div className="mx-auto max-w-[1160px] px-8 pb-22.5 pt-17.5 max-[640px]:px-5">
      <span className="text-[11.5px] font-semibold uppercase tracking-widest text-green">Full assessment</span>
      <h1 className="mt-3.5 max-w-[22ch] text-[clamp(34px,6vw,48px)] font-semibold leading-tight tracking-tight">
        Ten minutes for a real recommendation.
      </h1>
      <p className="mb-8.5 mt-4 max-w-145 text-base leading-relaxed text-navy/65">
        Your size, your price range, and how it compares to what you already spend on fuel. We ask for your details only after you have
        seen the result.
      </p>
      <FullAssessment />
    </div>
  );
}
