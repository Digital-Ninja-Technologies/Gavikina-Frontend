import { useSelector } from "@tanstack/react-store";
import { fmt } from "@workspace/engine";
import { cn } from "@workspace/ui/lib/utils";
import AssessmentFooter from "../components/assessment-footer";
import { assessmentActions, assessmentStore } from "../store";

export default function StepFuel() {
	const fuelSpend = useSelector(assessmentStore, (s) => s.fuelSpend);

	const setFuel = (value: number) => {
		assessmentActions.updateField("fuelSpend", value);
	};

	return (
		<div className="flex h-full flex-col justify-between animate-gv-fade">
			<div>
				<h3 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
					What do you spend on generator fuel each month?
				</h3>
				<p className="mt-2 text-sm text-navy/70 sm:text-base">
					Petrol or diesel, your rough average. We compare it against the system
					cost.
				</p>

				<div className="mt-6 max-w-xl">
					<div className="flex items-baseline gap-2">
						<span className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
							{fmt(fuelSpend)}
						</span>
						<span className="text-xs text-navy/50 sm:text-sm">per month</span>
					</div>

					<input
						type="range"
						min={0}
						max={500000}
						step={5000}
						value={fuelSpend}
						onChange={(e) => setFuel(Number(e.target.value))}
						className="my-6 h-2 w-full cursor-pointer accent-green"
					/>

					<div className="flex justify-between text-xs text-navy/50">
						<span>₦0</span>
						<span>₦500,000+</span>
					</div>

					<div className="mt-6 flex flex-wrap gap-2">
						{[20000, 60000, 120000, 250000].map((v) => (
							<button
								key={v}
								type="button"
								className={cn(
									"rounded-full border px-4 py-1.5 text-xs font-medium transition-colors sm:text-sm",
									fuelSpend === v
										? "border-green bg-green/10 text-green font-semibold"
										: "border-navy/15 bg-white text-navy/70 hover:bg-cream hover:text-navy",
								)}
								onClick={() => setFuel(v)}
							>
								{fmt(v)}
							</button>
						))}
					</div>
				</div>
			</div>

			<AssessmentFooter
				canAdvance={true}
				apiStepNumber={5}
				apiPayload={{ fuelSpend }}
			/>
		</div>
	);
}
