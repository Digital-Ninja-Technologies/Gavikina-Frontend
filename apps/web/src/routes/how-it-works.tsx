import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { openAssess } from "../store/modal";

export const Route = createFileRoute("/how-it-works")({
	component: HowItWorks,
});

const STEPS_LONG = [
	{
		num: "01",
		title: "Tell us what you run",
		body: "The assessment walks you through property type, appliances, how long you need to run without the grid, and what you currently spend on fuel. You see the recommendation before we ask for your name.",
		meta: "Ten minutes, online",
	},
	{
		num: "02",
		title: "We call to book the inspection",
		body: "An engineer calls to confirm what you entered and agree a visit. Nothing is charged and nothing is ordered at this stage.",
		meta: "Within one working day",
	},
	{
		num: "03",
		title: "Site inspection",
		body: "We measure the real load at the board, assess the roof or ground area, check cable runs and shading, and confirm where the batteries and inverter will live.",
		meta: "Free, about two hours",
	},
	{
		num: "04",
		title: "Fixed quote",
		body: "You get a single figure, a component list with brands and warranties, and a payment schedule. The figure does not move after this point unless you change the scope.",
		meta: "Within two working days",
	},
	{
		num: "05",
		title: "Installation and commissioning",
		body: "Mounting, DC and AC wiring, protection devices, and full commissioning with you present. We hand over the as-built drawing and register every warranty in your name.",
		meta: "One to three days for most homes",
	},
	{
		num: "06",
		title: "Aftercare",
		body: "Workmanship faults are ours to fix. Components carry manufacturer cover we registered for you. Call the same number you called at the start.",
		meta: "Ongoing",
	},
];

function HowItWorks() {
	return (
		<div className="section-wrapper">
			<span className="text-xs font-semibold uppercase tracking-widest text-green">
				How it works
			</span>
			<h1 className="mt-2 max-w-2xl font-semibold text-3xl tracking-tight text-navy sm:text-4xl lg:text-5xl leading-[1.2]">
				Six steps, and then it just runs.
			</h1>

			{/* Timeline Steps */}
			<div className="mt-12 flex max-w-3xl flex-col">
				{STEPS_LONG.map((s, i) => (
					<div
						key={s.num}
						className="relative grid grid-cols-[3rem_1fr] gap-4 pb-10 last:pb-0 sm:grid-cols-[3.5rem_1fr] sm:gap-6"
					>
						<div className="relative flex flex-col items-center">
							<span className="z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl bg-ink text-base font-semibold text-amber shadow-xs">
								{s.num}
							</span>
							{i < STEPS_LONG.length - 1 && (
								<span className="mt-2 w-px flex-1 bg-navy/10" />
							)}
						</div>
						<div className="pt-1.5">
							<h3 className="text-xl font-semibold tracking-tight text-navy sm:text-2xl">
								{s.title}
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-navy/70 sm:text-base">
								{s.body}
							</p>
							<span className="mt-2.5 inline-block text-xs font-semibold tracking-wider text-green sm:text-sm">
								{s.meta}
							</span>
						</div>
					</div>
				))}
			</div>

			{/* CTA Card */}
			<div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl bg-cream p-6 sm:p-8 lg:flex-row lg:items-center lg:p-10">
				<div>
					<h3 className="text-xl font-semibold tracking-tight text-navy sm:text-2xl">
						Start at step one now
					</h3>
					<p className="mt-2 max-w-xl text-sm leading-loose text-navy/70 sm:text-base">
						The assessment is the enquiry. Ten minutes, and an engineer calls to
						book the inspection.
					</p>
				</div>
				<Button
					size="lg"
					className="w-full shrink-0 sm:w-auto"
					onClick={() => openAssess()}
				>
					Take the full assessment
				</Button>
			</div>
		</div>
	);
}
