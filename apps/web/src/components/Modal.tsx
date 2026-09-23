import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
} from "@workspace/ui/components/dialog";
import { cn } from "@workspace/ui/lib/utils";
import { X } from "lucide-react";
import AssessmentWizard from "#/modules/assessment/components/assessment-wizard";
import SolarCalculator from "../modules/calculator/components/SolarCalculator";
import ProjectDetailModal from "../modules/projects/components/project-details-modal";
import { closeModal, openAssess, useModalState } from "../store/modal";

export default function Modal() {
	const { kind, projectId } = useModalState();

	const title =
		kind === "calc"
			? "Solar System Calculator"
			: kind === "assess"
				? "Full Engineering Assessment"
				: "Project Details";

	return (
		<Dialog open={!!kind} onOpenChange={(open) => !open && closeModal()}>
			{kind && (
				<DialogContent
					showCloseButton={false}
					className={cn(
						"flex flex-col p-0 gap-0 overflow-hidden focus:outline-none",
						"rounded-2xl border border-navy/10 bg-white shadow-2xl",
						kind === "project"
							? "sm:max-w-xl max-h-[85vh]"
							: "sm:max-w-5xl max-h-[92dvh] sm:max-h-[90dvh]",
					)}
				>
					<DialogTitle className="sr-only">{title}</DialogTitle>

					<DialogClose
						aria-label="Close dialog"
						className="absolute right-4 top-4 z-50 flex size-7 items-center justify-center rounded-lg border border-navy/10 bg-white text-navy/70 transition-colors hover:bg-cream/40 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
					>
						<X className="size-4" />
					</DialogClose>

					{kind === "project" && projectId ? (
						<ProjectDetailModal projectId={projectId} />
					) : (
						<div className="no-scrollbar flex-1 overflow-y-auto">
							{kind === "calc" && (
								<SolarCalculator
									isModal
									onAssessment={(sel) => openAssess(sel)}
								/>
							)}
							{kind === "assess" && <AssessmentWizard />}
						</div>
					)}
				</DialogContent>
			)}
		</Dialog>
	);
}
