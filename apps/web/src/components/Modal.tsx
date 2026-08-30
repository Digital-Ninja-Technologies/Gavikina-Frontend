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
import { closeModal, openAssess, useModalState } from "../store/modal";

export default function Modal() {
	const { kind } = useModalState();

	const title =
		kind === "calc" ? "Solar System Calculator" : "Full Engineering Assessment";

	return (
		<Dialog open={!!kind} onOpenChange={(open) => !open && closeModal()}>
			{kind && (
				<DialogContent
					showCloseButton={false}
					className={cn(
						"flex flex-col p-0 gap-0 overflow-hidden",
						"sm:max-w-5xl",
						"max-h-[92dvh] sm:max-h-[90dvh]",
						"rounded-2xl border border-navy/10 bg-white shadow-2xl",
						"focus:outline-none",
					)}
				>
					<DialogTitle className="sr-only">{title}</DialogTitle>

					<DialogClose
						aria-label="Close dialog"
						className="absolute right-3.5 top-3.5 z-50 flex size-8 items-center justify-center rounded-full border border-navy/15 bg-white/90 text-navy backdrop-blur-sm transition-colors hover:bg-cream/40 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy sm:right-4 sm:top-4"
					>
						<X className="size-4" />
					</DialogClose>

					<div className="no-scrollbar flex-1 overflow-y-auto">
						{kind === "calc" && (
							<SolarCalculator
								isModal
								onAssessment={(sel) => openAssess(sel)}
							/>
						)}
						{kind === "assess" && <AssessmentWizard />}
					</div>
				</DialogContent>
			)}
		</Dialog>
	);
}
