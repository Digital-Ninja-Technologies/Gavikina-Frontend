import { createFileRoute } from "@tanstack/react-router";
import SolarCalculator from "../modules/calculator/components/SolarCalculator";
import { openAssess } from "../store/modal";

export const Route = createFileRoute("/calculator")({
	component: CalculatorPage,
});

function CalculatorPage() {
	return (
		<div className="section-wrapper">
			<span className="text-xs font-semibold uppercase tracking-widest text-green">
				Solar calculator
			</span>
			<h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-navy sm:text-4xl lg:text-5xl leading-[1.2]">
				What size do you actually need?
			</h1>
			<p className="mb-10 mt-3 max-w-2xl text-base leading-loose text-navy/70">
				Pick your appliances. We compute the load, add engineering headroom, and
				match it to a system tier; the same calculation an engineer runs on
				site.
			</p>
			<SolarCalculator onAssessment={openAssess} />
		</div>
	);
}
