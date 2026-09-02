import { useSelector } from "@tanstack/react-store";
import { PAYMENT_METHODS } from "@workspace/engine";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { cn } from "@workspace/ui/lib/utils";
import AssessmentFooter from "../components/assessment-footer";
import { assessmentActions, assessmentStore } from "../store";

export default function StepPayment() {
	const payment = useSelector(assessmentStore, (s) => s.payment);
	const inspection = useSelector(assessmentStore, (s) => s.requestSiteInspection);

	return (
		<div className="flex h-full min-w-0 flex-col justify-between animate-gv-fade">
			<div>
				<h3 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
					How would you prefer to pay?
				</h3>
				<p className="mt-2 text-sm text-navy/70 sm:text-base">
					Nothing is charged here. It tells the engineer what to prepare.
				</p>

				<div className="mt-6 flex max-w-md flex-col gap-3">
					{PAYMENT_METHODS.map((o) => (
						<button
							key={o.id}
							type="button"
							className={cn(
								"flex items-center rounded-xl border px-5 py-3.5 text-left text-sm font-medium transition-all",
								payment === o.id
									? "border-green bg-green/5 text-navy font-semibold"
									: "border-navy/10 bg-white text-navy/80 hover:border-navy/20",
							)}
							onClick={() => assessmentActions.updateField("payment", o.id)}
						>
							{o.label}
						</button>
					))}
				</div>

				<label
					htmlFor="inspection"
					className="mt-6 flex max-w-md cursor-pointer items-start gap-3"
				>
					<Checkbox
						id="inspection"
						checked={inspection}
						onCheckedChange={(checked) =>
							assessmentActions.updateField("requestSiteInspection", !!checked)
						}
						className="mt-0.5"
					/>
					<span className="text-xs leading-relaxed text-navy/75 sm:text-sm">
						Request a free site inspection. An engineer visits, confirms the
						roof and load, and issues the final quote.
					</span>
				</label>
			</div>

			<AssessmentFooter
				canAdvance={!!payment}
				apiStepNumber={8}
				apiPayload={{ paymentPreference: payment, inspection }}
				nextLabel="Submit assessment"
			/>
		</div>
	);
}
