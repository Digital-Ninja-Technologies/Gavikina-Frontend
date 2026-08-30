import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTitle,
} from "@workspace/ui/components/dialog";
import { cn } from "@workspace/ui/lib/utils";
import { X } from "lucide-react";
import FullAssessment from "#/modules/assessment/components/FullAssessment";
import { closeModal, openAssess, useModalState } from "../store/modal";
import SolarCalculator from "../modules/calculator/components/SolarCalculator";

export default function Modal() {
	const { kind, prefillSelection } = useModalState();

	const title =
		kind === "calc" ? "Solar System Calculator" : "Full Assessment";

	return (
		<Dialog open={!!kind} onOpenChange={(open) => !open && closeModal()}>
			{kind && (
				<DialogContent
					showCloseButton={false}
					className={cn(
						"flex flex-col p-0 gap-0 overflow-hidden",
						"sm:max-w-5xl",
						"max-h-[92dvh] sm:max-h-[88dvh]",
						// "rounded-2xl bg-white shadow-2xl",
						"focus:outline-none",
					)}
				>
					{/* Modal Header */}
					<div className="flex shrink-0 items-center justify-between border-b border-navy/10 bg-ink px-4 py-3 sm:px-6 text-white">
						<div className="flex items-center gap-2 sm:gap-3">
							<span className="text-[11px] font-semibold uppercase tracking-wider text-amber sm:text-xs">
								{kind === "calc" ? "Estimator" : "Lead Assessment"}
							</span>
							<span className="text-white/30">•</span>
							<DialogTitle className="text-sm font-semibold text-white sm:text-base">
								{title}
							</DialogTitle>
						</div>

						<DialogClose
							aria-label="Close modal"
							className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
						>
							<X className="size-4" />
						</DialogClose>
					</div>

					{/* Modal Body Container with Smooth Scrolling */}
					<div className="flex-1 overflow-y-auto ">
						{kind === "calc" && (
							<div className="p-0">
								<SolarCalculator isModal onAssessment={(sel) => openAssess(sel)} />
							</div>
						)}
						{kind === "assess" && (
							<div className="p-4 sm:p-6 lg:p-8">
								<FullAssessment initialSelection={prefillSelection} />
							</div>
						)}
					</div>
				</DialogContent>
			)}
		</Dialog>
	);
}
