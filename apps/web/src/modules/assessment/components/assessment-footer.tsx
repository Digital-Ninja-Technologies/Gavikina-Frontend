import { useMutation } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/toast";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowLeft } from "lucide-react";
import { saveAssessmentStep } from "../api";
import { assessmentActions, assessmentStore } from "../store";

interface AssessmentFooterProps {
	canAdvance: boolean;
	apiStepNumber?: number;
	apiPayload?: Record<string, unknown>;
	onNextOverride?: () => void;
	nextLabel?: string;
	hideNext?: boolean;
}

export default function AssessmentFooter({
	canAdvance,
	apiStepNumber,
	apiPayload,
	onNextOverride,
	nextLabel = "Next",
	hideNext = false,
}: AssessmentFooterProps) {
	const uiStep = useSelector(assessmentStore, (s) => s.uiStep);
	const sessionId = useSelector(assessmentStore, (s) => s.sessionId);

	const stepMutation = useMutation({
		mutationFn: saveAssessmentStep,
		onSuccess: () => assessmentActions.nextStep(),
		// biome-ignore lint/suspicious/noExplicitAny: <any err>
		onError: (error: any) => {
			toast.add({
				title: "Error",
				description:
					error?.message || "Failed to save progress. Please try again.",
				type: "error",
			});
		},
	});

	const handleNext = () => {
		if (!canAdvance) return;

		if (onNextOverride) {
			onNextOverride();
			return;
		}

		if (apiPayload && sessionId && apiStepNumber) {
			stepMutation.mutate({
				data: {
					sessionId,
					step: apiStepNumber,
					data: apiPayload,
				},
			});
		} else {
			assessmentActions.nextStep();
		}
	};

	return (
		<div className="mt-8 flex items-center justify-between border-t border-navy/10 pt-6">
			<button
				type="button"
				className={cn(
					"inline-flex items-center gap-1.5 text-xs font-medium text-navy/70 transition-colors hover:text-navy sm:text-sm",
					uiStep === 0 && "invisible pointer-events-none",
				)}
				onClick={assessmentActions.prevStep}
			>
				<ArrowLeft className="size-4" /> Back
			</button>

			<div className="flex items-center gap-4">
				<span className="text-xs text-navy/50">Step {uiStep + 1} of 8</span>
				{!hideNext && (
					<Button
						disabled={!canAdvance || stepMutation.isPending}
						variant={canAdvance ? "default" : "outline"}
						onClick={handleNext}
					>
						{stepMutation.isPending ? "Saving..." : nextLabel}
					</Button>
				)}
			</div>
		</div>
	);
}
