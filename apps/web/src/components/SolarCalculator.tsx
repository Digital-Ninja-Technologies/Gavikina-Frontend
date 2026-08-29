import type { Selection } from "@workspace/engine";
import {
	CATEGORIES,
	effectiveSize,
	fmtRange,
	useCalculatorAppliances,
} from "@workspace/engine";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";

interface SolarCalculatorProps {
	onAssessment?: (selection: Selection) => void;
}

export default function SolarCalculator({
	onAssessment,
}: SolarCalculatorProps) {
	const [sel, setSel] = useState<Selection>({});

	const bump = (id: string, d: number, dflt: number) => {
		setSel((cur) => {
			const curQty = cur[id] || 0;
			const next = curQty === 0 && d > 0 ? dflt || 1 : Math.max(0, curQty + d);
			const nextSel = { ...cur };
			if (next === 0) delete nextSel[id];
			else nextSel[id] = next;
			return nextSel;
		});
	};

	const appliances = useCalculatorAppliances();
	const groups = useMemo(
		() =>
			CATEGORIES.map((cat) => ({
				name: cat,
				items: appliances.filter((a) => a.category === cat),
			})),
		[appliances],
	);

	const result = useMemo(() => effectiveSize(sel), [sel]);
	const hasSelection = !!result.tier;

	return (
		<div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-xl lg:grid-cols-[1.35fr_1fr]">
			{/* APPLIANCE SELECTOR */}
			<div className="min-w-0 p-6 sm:p-8">
				<div className="mb-2 flex flex-wrap items-center gap-3">
					<h3 className="text-xl font-semibold tracking-tight text-navy sm:text-2xl">
						What do you want to power?
					</h3>
					<span className="rounded-full bg-green/10 px-3 py-1 text-xs font-medium text-green">
						No contact details needed
					</span>
				</div>
				<p className="mb-6 max-w-xl text-sm leading-relaxed text-navy/70">
					Pick your appliances and set the quantity. We size the system from the
					same engine our engineers quote from.
				</p>

				<div className="flex max-h-128 flex-col gap-6 overflow-y-auto pr-2">
					{groups.map((group) => (
						<div key={group.name}>
							<div className="mb-3 flex items-center gap-3">
								<span className="text-xs font-semibold uppercase tracking-wider text-navy/50">
									{group.name}
								</span>
								<span className="h-px flex-1 bg-navy/10" />
							</div>

							<div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
								{group.items.map((item) => {
									const qty = sel[item.id] || 0;
									const isSelected = qty > 0;

									return (
										<div
											key={item.id}
											className={cn(
												"flex items-center justify-between gap-3 rounded-xl border p-3 transition-colors",
												isSelected
													? "border-green/40 bg-green/5"
													: "border-navy/10 bg-white hover:border-navy/20",
											)}
										>
											<button
												type="button"
												className="flex min-w-0 flex-1 flex-col items-start text-left"
												onClick={() =>
													bump(
														item.id,
														qty > 0 ? -qty : 1,
														item.default_quantity,
													)
												}
											>
												<span className="text-sm font-medium text-navy">
													{item.name}
												</span>
												<span className="text-xs text-navy/50">
													{item.typical_wattage}W each
												</span>
											</button>

											<div className="flex shrink-0 items-center gap-1.5">
												<button
													type="button"
													aria-label={`Decrease ${item.name}`}
													className="flex size-7 items-center justify-center rounded-lg border border-navy/15 bg-white text-navy transition-colors hover:bg-cream"
													onClick={() =>
														bump(item.id, -1, item.default_quantity)
													}
												>
													<Minus className="size-3.5" />
												</button>

												<span className="w-5 text-center text-sm font-semibold tabular-nums text-navy">
													{qty}
												</span>

												<button
													type="button"
													aria-label={`Increase ${item.name}`}
													className="flex size-7 items-center justify-center rounded-lg border border-navy/15 bg-white text-navy transition-colors hover:bg-cream"
													onClick={() =>
														bump(item.id, 1, item.default_quantity)
													}
												>
													<Plus className="size-3.5" />
												</button>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* RESULT PANEL */}
			<div className="relative flex min-w-0 flex-col justify-between overflow-hidden bg-ink p-6 text-white sm:p-8">
				<div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(245,166,35,0.3),rgba(245,166,35,0)_70%)]" />

				<div className="relative">
					<span className="text-xs font-semibold uppercase tracking-wider text-white/50">
						Your estimate
					</span>

					{hasSelection && result.tier ? (
						<div className="mt-4">
							<div className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
								{result.tier.name}
							</div>
							<p className="mt-2 text-xs text-white/60 sm:text-sm">
								Calculated load {result.watts.toLocaleString()}W ·{" "}
								{result.requiredKva.toFixed(2)}kVA required
							</p>

							<div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
								<span className="text-xs font-semibold uppercase tracking-wider text-white/50">
									Indicative price range
								</span>
								<div className="mt-1.5 text-2xl font-semibold tracking-tight text-amber">
									{fmtRange(result.tier)}
								</div>
								<p className="mt-2 text-xs leading-relaxed text-white/60">
									Fully installed and commissioned. Final figure confirmed after
									site inspection.
								</p>
							</div>

							<div className="mt-6">
								<span className="text-xs font-semibold uppercase tracking-wider text-white/50">
									Typically powers
								</span>
								<div className="mt-3 flex flex-wrap gap-2">
									{result.tier.typically_powers.map((item) => (
										<span
											key={item}
											className="rounded-full border border-green/30 bg-green/20 px-3 py-1 text-xs font-medium text-green-light"
										>
											{item}
										</span>
									))}
								</div>
							</div>
						</div>
					) : (
						<div className="mt-4 pb-8">
							<div className="text-4xl font-semibold tracking-tight text-white/20 sm:text-5xl">
								— kVA
							</div>
							<p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
								Select an appliance on the left and your system size appears
								here instantly.
							</p>
						</div>
					)}
				</div>

				<div className="relative mt-8 border-t border-white/10 pt-6">
					<p className="mb-4 text-xs leading-relaxed text-white/70 sm:text-sm">
						This is a quick estimate. The full assessment factors in your backup
						hours and current fuel spend, then gives you a personalised
						recommendation and a site inspection.
					</p>
					<Button
						className="w-full"
						size="lg"
						onClick={() => onAssessment?.(sel)}
					>
						Take the full assessment →
					</Button>
					<Button
						variant="outline-dark"
						size="sm"
						className="mt-2 w-full text-xs"
						onClick={() => setSel({})}
					>
						Start over
					</Button>
				</div>
			</div>
		</div>
	);
}
