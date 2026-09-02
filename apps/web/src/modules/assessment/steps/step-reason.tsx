import { useMutation } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";
import { REASONS } from "@workspace/engine";
import { toast } from "@workspace/ui/components/toast";
import { cn } from "@workspace/ui/lib/utils";
import { Loader2 } from "lucide-react";
import { saveAssessmentStep } from "../api";
import AssessmentFooter from "../components/assessment-footer";
import { assessmentActions, assessmentStore } from "../store";

export default function StepReason() {
	const reason = useSelector(assessmentStore, (s) => s.reason);
	const sessionId = useSelector(assessmentStore, (s) => s.sessionId);

	const mutation = useMutation({
		mutationFn: async (selectedId: string) => {
			if (!sessionId) throw new Error("No session ID found");

			const selectedReason = REASONS.find((r) => r.id === selectedId);

			await saveAssessmentStep({
				data: {
					sessionId,
					step: 2,
					data: { reason: selectedReason?.label || selectedId },
				},
			});

			return selectedId;
		},
		onSuccess: (selectedId) => {
			assessmentActions.updateField("reason", selectedId);
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

	const selectOption = (id: string) => {
		// Instant optimistic UI update
		assessmentActions.updateField("reason", id);
		// Fire the API call
		mutation.mutate(id);
	};

	return (
		<div className="flex h-full animate-gv-fade flex-col justify-between">
			<div>
				<h3 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
					Why are you considering solar?
				</h3>
				<p className="mt-2 text-sm text-navy/70 sm:text-base">
					Pick the closest reason. It shapes the recommendation you get at the
					end.
				</p>
				<div className="mt-6 flex max-w-xl flex-col gap-3">
					{REASONS.map((o) => {
						const isSelected = reason === o.id;
						// Only show the spinner on the button currently being saved
						const isPending = mutation.isPending && mutation.variables === o.id;

						return (
							<button
								key={o.id}
								type="button"
								disabled={mutation.isPending}
								className={cn(
									"flex items-center justify-between rounded-xl border px-5 py-3.5 text-left text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-70",
									isSelected
										? "border-green bg-green/5 font-semibold text-navy"
										: "border-navy/10 bg-white text-navy/80 hover:border-navy/20",
								)}
								onClick={() => selectOption(o.id)}
							>
								<span>{o.label}</span>
								{isPending && (
									<Loader2 className="size-4 animate-spin text-green" />
								)}
							</button>
						);
					})}
				</div>
			</div>

			{/* Hide the Next button because clicking the option auto-advances */}
			<AssessmentFooter canAdvance={!!reason} hideNext />
		</div>
	);
}
