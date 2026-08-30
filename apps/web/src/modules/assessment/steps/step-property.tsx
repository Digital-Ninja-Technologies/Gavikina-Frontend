import { useMutation } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";
import { toast } from "@workspace/ui/components/toast";
import { cn } from "@workspace/ui/lib/utils";
import { Loader2 } from "lucide-react";
import { saveAssessmentStep, startAssessmentSession } from "../api";
import AssessmentFooter from "../components/assessment-footer";
import { assessmentActions, assessmentStore } from "../store";

export default function StepProperty() {
	const property = useSelector(assessmentStore, (s) => s.property);
	const sessionId = useSelector(assessmentStore, (s) => s.sessionId);

	const mutation = useMutation({
		mutationFn: async (selectedId: "home" | "business") => {
			let currentSessionId = sessionId;

			if (!currentSessionId) {
				const startRes = await startAssessmentSession();
				currentSessionId = startRes.data.sessionId;
				assessmentActions.setSessionId(currentSessionId);
			}

			await saveAssessmentStep({
				data: {
					sessionId: currentSessionId,
					step: 1,
					data: { propertyType: selectedId },
				},
			});

			return selectedId;
		},
		onSuccess: (selectedId) => {
			assessmentActions.updateField("property", selectedId);
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

	const selectOption = (id: "home" | "business") => {
		assessmentActions.updateField("property", id);
		mutation.mutate(id);
	};

	return (
		<div className="flex h-full flex-col justify-between animate-gv-fade">
			<div>
				<h3 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
					Is this for a home or a business?
				</h3>
				<p className="mt-2 text-sm text-navy/70 sm:text-base">
					It changes which appliances we show you and how we size for peak
					demand.
				</p>
				<div className="mt-6 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
					{[
						{
							id: "home",
							label: "My home",
							note: "Flat, duplex or family house",
						},
						{
							id: "business",
							label: "My business",
							note: "Shop, office, clinic or workshop",
						},
					].map((o) => {
						const isSelected = property === o.id;
						const isPending = mutation.isPending && mutation.variables === o.id;

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
								onClick={() => selectOption(o.id as "home" | "business")}
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

			<AssessmentFooter canAdvance={!!property} hideNext />
		</div>
	);
}
