import { useSelector } from "@tanstack/react-store";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Check } from "lucide-react";
import StepAppliances from "../steps/step-appliances";
import StepBackup from "../steps/step-backup";
import StepContact from "../steps/step-contact";
import StepFuel from "../steps/step-fuel";
import StepPayment from "../steps/step-payment";
import StepProperty from "../steps/step-property";
import StepReason from "../steps/step-reason";
import StepRecommendation from "../steps/step-recommendation";
import { assessmentActions, assessmentStore } from "../store";

const STEPS = [
	"Property type",
	"Your reason",
	"Appliances",
	"Backup duration",
	"Fuel spend",
	"Recommendation",
	"Your details",
	"Payment & inspection",
];

export default function AssessmentWizard() {
	const step = useSelector(assessmentStore, (s) => s.uiStep);
	const sessionId = useSelector(assessmentStore, (s) => s.sessionId);
	const contact = useSelector(assessmentStore, (s) => s.contact);

	const effectiveStep = Math.min(step, 8);

	const restart = () => {
		assessmentActions.reset();
	};

	const nameOrYou = contact.name.trim().split(" ")[0] || "there";
	const phoneOrSoon = contact.phone.trim()
		? `on ${contact.phone.trim()}`
		: "shortly";

	return (
		<div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-xl lg:grid-cols-[260px_1fr]">
			{/* Steps Sidebar */}
			<div className="flex flex-col justify-between bg-ink p-6 text-white sm:p-8">
				<div className="flex flex-col gap-6">
					<div>
						<span className="text-xs font-semibold uppercase tracking-wider text-amber">
							Full assessment
						</span>
						<p className="mt-1 text-xs text-white/60 sm:text-sm">
							Five questions, then your recommendation.
						</p>
					</div>

					<div className="hidden flex-col gap-1 lg:flex">
						{STEPS.map((label, i) => {
							const active = i === effectiveStep;
							const past = i < effectiveStep;
							return (
								<div
									key={label}
									className={cn(
										"flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
										active ? "bg-white/10" : "bg-transparent",
									)}
								>
									<span
										className={cn(
											"flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
											active
												? "bg-green text-white"
												: past
													? "bg-green/20 text-green-light"
													: "bg-white/10 text-white/40",
										)}
									>
										{past ? <Check className="size-3.5" /> : String(i + 1)}
									</span>
									<span
										className={cn(
											"text-xs font-medium leading-tight sm:text-sm",
											active
												? "text-white font-semibold"
												: past
													? "text-white/70"
													: "text-white/40",
										)}
									>
										{label}
									</span>
								</div>
							);
						})}
					</div>
				</div>

				<div className="mt-4 flex items-center gap-2 text-xs text-white/50 lg:mt-8">
					<span className="size-1.5 rounded-full bg-green" />
					{effectiveStep > 0 && effectiveStep < 8
						? "Progress saved"
						: "Nothing saved yet"}
				</div>
			</div>

			{/* Step Body Container */}
			<div className="flex min-h-128 flex-col justify-between p-6 sm:p-8 lg:p-10">
				{step === 0 && <StepProperty />}
				{step === 1 && <StepReason />}
				{step === 2 && <StepAppliances />}
				{step === 3 && <StepBackup />}
				{step === 4 && <StepFuel />}
				{step === 5 && <StepRecommendation />}
				{step === 6 && <StepContact />}
				{step === 7 && <StepPayment />}

				{/* Success State */}
				{step === 8 && (
					<div className="flex max-w-md flex-1 animate-gv-fade flex-col items-start justify-center py-6">
						<span className="flex size-12 items-center justify-center rounded-2xl bg-green text-white shadow-md">
							<Check className="size-6" />
						</span>
						<h3 className="mt-5 text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
							Assessment complete
						</h3>
						<p className="mt-3 text-sm leading-relaxed text-navy/70 sm:text-base">
							Thank you, {nameOrYou}. Your recommendation and everything you
							entered has gone to our team. An engineer will call {phoneOrSoon}{" "}
							to arrange the inspection.
						</p>
						<div className="mt-6 rounded-2xl bg-cream p-4 text-xs text-navy/80 sm:text-sm">
							Session ID{" "}
							<strong className="block font-semibold text-navy break-all">
								{sessionId}
							</strong>
							Quote this ID if you contact us directly.
						</div>
						<Button variant="outline" className="mt-6" onClick={restart}>
							Run another assessment
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
