import { useMutation } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";
import { BACKUP_OPTIONS } from "@workspace/engine";
import { toast } from "@workspace/ui/components/toast";
import { cn } from "@workspace/ui/lib/utils";
import { Loader2 } from "lucide-react";
import { saveAssessmentStep } from "../api";
import AssessmentFooter from "../components/assessment-footer";
import { assessmentActions, assessmentStore } from "../store";

export default function StepBackup() {
	const backupHours = useSelector(assessmentStore, (s) => s.backupHours);
	const sessionId = useSelector(assessmentStore, (s) => s.sessionId);

	const mutation = useMutation({
		mutationFn: async (selectedHours: number) => {
			if (!sessionId) throw new Error("No session ID found");

			await saveAssessmentStep({
				data: {
					sessionId,
					step: 4,
					data: { backupHours: selectedHours },
				},
			});

			return selectedHours;
		},
		onSuccess: (selectedHours) => {
			// Update the store with the number and advance
			assessmentActions.updateField("backupHours", selectedHours);
			assessmentActions.nextStep();
		},
		onError: (error: any) => {
			console.error("Failed to save step:", error);
			toast.add({
				title: "Error",
				description:
					error?.message ||
					"Failed to save progress. Please check your connection.",
				type: "error",
			});
		},
	});

	const selectOption = (hours: number) => {
		assessmentActions.updateField("backupHours", hours);
		mutation.mutate(hours);
	};

	return (
		<div className="flex h-full flex-col justify-between animate-gv-fade">
			<div>
				<h3 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
					How long should it run with no grid supply?
				</h3>
				<p className="mt-2 text-sm text-navy/70 sm:text-base">
					This sets the battery bank capacity, not the panel array.
				</p>
				<div className="mt-6 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
					{BACKUP_OPTIONS.map((o) => {
						const isSelected = backupHours === o.hours;
						const isPending =
							mutation.isPending && mutation.variables === o.hours;

						return (
							<button
								key={o.id}
								type="button"
								disabled={mutation.isPending}
								className={cn(
									"relative flex flex-col items-start gap-1 overflow-hidden rounded-2xl border p-5 text-left transition-all disabled:cursor-not-allowed disabled:opacity-70",
									isSelected
										? "border-green bg-green/5 shadow-xs"
										: "border-navy/10 bg-white hover:border-navy/20",
								)}
								onClick={() => selectOption(o.hours)}
							>
								<div className="flex w-full items-center justify-between">
									<span className="text-base font-semibold text-navy sm:text-lg">
										{o.label}
									</span>
									{isPending && (
										<Loader2 className="size-4 animate-spin text-green" />
									)}
								</div>
								<span className="text-xs text-navy/60 sm:text-sm">
									{o.note}
								</span>
							</button>
						);
					})}
				</div>
			</div>

			<AssessmentFooter canAdvance={!!backupHours} hideNext />
		</div>
	);
}
