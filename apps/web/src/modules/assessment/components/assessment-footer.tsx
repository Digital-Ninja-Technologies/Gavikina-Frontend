import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/toast";
import { saveAssessmentStep } from "../api";
import { assessmentKeys } from "../query-options";
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
	const queryClient = useQueryClient();

	const stepMutation = useMutation({
		mutationFn: saveAssessmentStep,
		onSuccess: () => {
			if (sessionId) {
				queryClient.invalidateQueries({
					queryKey: assessmentKeys.session(sessionId),
				});
			}
			assessmentActions.nextStep();
		},
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
		<div className="mt-8 flex items-center justify-end border-t border-navy/10 pt-6">
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
