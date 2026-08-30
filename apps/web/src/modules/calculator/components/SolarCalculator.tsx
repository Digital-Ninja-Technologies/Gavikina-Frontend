import { useAsyncDebouncer } from "@tanstack/react-pacer";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { Selection } from "@workspace/engine";
import { fmt } from "@workspace/engine";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "@workspace/ui/components/toast";
import { cn } from "@workspace/ui/lib/utils";
import { Loader2, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CalculateResponseData } from "#/modules/calculator/api";
import { calculateSystemLoad } from "#/modules/calculator/api";
import { catalogueAppliancesQueryOptions } from "#/modules/catalogue/query-options";
import { AsyncBoundary } from "@/components/async-boundary";

interface SolarCalculatorProps {
	onAssessment?: (selection: Selection) => void;
	isModal?: boolean;
}

export default function SolarCalculator(props: SolarCalculatorProps) {
	return (
		<AsyncBoundary
			fallback={<SolarCalculatorSkeleton isModal={props.isModal} />}
		>
			<SolarCalculatorContent {...props} />
		</AsyncBoundary>
	);
}

function SolarCalculatorContent({
	onAssessment,
	isModal = false,
}: SolarCalculatorProps) {
	const [sel, setSel] = useState<Selection>({});
	const [calcResult, setCalcResult] = useState<CalculateResponseData | null>(
		null,
	);

	const { data: appliances } = useSuspenseQuery(
		catalogueAppliancesQueryOptions(),
	);

	const payload = useMemo(() => {
		return Object.entries(sel)
			.filter(([, qty]) => qty > 0)
			.map(([applianceId, quantity]) => ({ applianceId, quantity }));
	}, [sel]);

	const executeCalculation = useCallback(
		async (currentPayload: typeof payload) => {
			const res = await calculateSystemLoad({
				data: { appliances: currentPayload },
			});
			return res.data;
		},
		[],
	);

	const debouncerOptions = useMemo(
		() => ({
			wait: 350,
			onSuccess: (data: CalculateResponseData) => setCalcResult(data),
			onError: (error: any) => {
				console.error("Failed to calculate system load:", error);
				toast.add({
					title: "Error",
					description: error?.message || "Failed to calculate system load.",
					type: "error",
				});
			},
		}),
		[],
	);

	const {
		maybeExecute,
		cancel,
		state: { isPending, isExecuting },
	} = useAsyncDebouncer<
		(currentPayload: typeof payload) => Promise<CalculateResponseData>,
		{ isPending: boolean; isExecuting: boolean }
	>(executeCalculation, debouncerOptions, (state) => ({
		isPending: state.isPending,
		isExecuting: state.isExecuting,
	}));

	useEffect(() => {
		if (payload.length > 0) {
			void maybeExecute(payload);
		} else {
			cancel();
			setCalcResult((prev) => (prev !== null ? null : prev));
		}
	}, [payload, maybeExecute, cancel]);

	const bump = (id: string, d: number) => {
		setSel((cur) => {
			const curQty = cur[id] || 0;
			const next = Math.max(0, curQty + d);
			const nextSel = { ...cur };
			if (next === 0) delete nextSel[id];
			else nextSel[id] = next;
			return nextSel;
		});
	};

	const groups = useMemo(() => {
		const cats = [...new Set(appliances.map((a) => a.category))];
		return cats.map((cat) => ({
			name: cat,
			items: appliances.filter((a) => a.category === cat),
		}));
	}, [appliances]);

	const hasSelection = payload.length > 0;
	const isCalculating = isPending || isExecuting;

	const isMaxedOut = calcResult?.customSolutionRequired || false;

	return (
		<div
			className={cn(
				"grid grid-cols-1 overflow-hidden rounded-2xl border border-navy/14 bg-white shadow-xl lg:grid-cols-[1.35fr_1fr]",
				isModal && "rounded-xl rounded-t-none border-none bg-transparent!",
			)}
		>
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

				<div className="no-scrollbar flex max-h-128 flex-col gap-6 overflow-y-auto pr-2">
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
												disabled={isMaxedOut && !isSelected}
												className="flex min-w-0 flex-1 flex-col items-start text-left disabled:opacity-50"
												onClick={() =>
													bump(
														item.id,
														qty > 0 ? -qty : item.default_quantity || 1,
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
													onClick={() => bump(item.id, -1)}
												>
													<Minus className="size-3.5" />
												</button>

												<span className="w-5 tabular-nums text-center text-sm font-semibold text-navy">
													{qty}
												</span>

												<button
													type="button"
													aria-label={`Increase ${item.name}`}
													disabled={isMaxedOut}
													className="flex size-7 items-center justify-center rounded-lg border border-navy/15 bg-white text-navy transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
													onClick={() => bump(item.id, 1)}
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

			<div className="relative flex min-w-0 flex-col justify-between overflow-hidden bg-ink p-6 text-white sm:p-8">
				{!isModal && (
					<div className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(245,166,35,0.3),rgba(245,166,35,0)_70%)]" />
				)}
				<div className="relative">
					<div className="flex items-center justify-between">
						<span className="text-xs font-semibold uppercase tracking-wider text-white/50">
							Your estimate
						</span>
						{isCalculating && (
							<Loader2 className="size-4 animate-spin text-white/50" />
						)}
					</div>

					{hasSelection && calcResult ? (
						<div
							className={cn(
								"mt-4 transition-opacity",
								isCalculating && "opacity-70",
							)}
						>
							{calcResult.customSolutionRequired ? (
								<div className="pb-8">
									<div className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
										Custom Size
									</div>
									<p className="mt-2 text-xs text-amber sm:text-sm">
										Calculated load {calcResult.totalLoad.toLocaleString()}W ·{" "}
										{calcResult.totalLoadKVA.toFixed(2)}kVA required
									</p>
									<p className="mt-4 max-w-xs text-sm leading-relaxed text-white/80">
										Your load exceeds our standard residential and small
										business tiers. Take the assessment and an engineer will
										reach out to build a bespoke quote.
									</p>
								</div>
							) : (
								<>
									<div className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
										{calcResult.tierDetails?.name}
									</div>
									<p className="mt-2 text-xs text-white/60 sm:text-sm">
										Calculated load {calcResult.totalLoad.toLocaleString()}W ·{" "}
										{calcResult.totalLoadKVA.toFixed(2)}kVA required
									</p>

									<div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
										<span className="text-xs font-semibold uppercase tracking-wider text-white/50">
											Indicative price range
										</span>
										<div className="mt-1.5 text-2xl font-semibold tracking-tight text-amber">
											{calcResult.priceRange
												? `${fmt(calcResult.priceRange.min)} – ${fmt(calcResult.priceRange.max)}`
												: "Price pending"}
										</div>
										<p className="mt-2 text-xs leading-relaxed text-white/60">
											Fully installed and commissioned. Final figure confirmed
											after site inspection.
										</p>
									</div>

									<div className="mt-6">
										<span className="text-xs font-semibold uppercase tracking-wider text-white/50">
											Typically powers
										</span>
										<div className="mt-3 flex flex-wrap gap-2">
											{calcResult.tierDetails?.typically_powers.map((item) => (
												<span
													key={item}
													className="rounded-full border border-green/30 bg-green/20 px-3 py-1 text-xs font-medium text-green-light"
												>
													{item}
												</span>
											))}
										</div>
									</div>
								</>
							)}
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

function SolarCalculatorSkeleton({ isModal }: { isModal?: boolean }) {
	return (
		<div
			className={cn(
				"grid grid-cols-1 overflow-hidden rounded-2xl border border-navy/14 bg-white shadow-xl lg:grid-cols-[1.35fr_1fr]",
				isModal && "rounded-xl rounded-t-none border-none bg-transparent!",
			)}
		>
			<div className="min-w-0 p-6 sm:p-8">
				<Skeleton className="mb-2 h-8 w-64" />
				<Skeleton className="mb-6 h-10 w-full max-w-xl" />
				<div className="flex flex-col gap-6">
					{[...Array(3)].map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<div key={i}>
							<Skeleton className="mb-3 h-4 w-24" />
							<div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
								<Skeleton className="h-16 w-full rounded-xl" />
								<Skeleton className="h-16 w-full rounded-xl" />
								<Skeleton className="h-16 w-full rounded-xl" />
								<Skeleton className="h-16 w-full rounded-xl" />
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="bg-ink p-6 sm:p-8">
				<Skeleton className="h-4 w-24 bg-white/20" />
				<Skeleton className="mt-4 h-12 w-32 bg-white/20" />
				<Skeleton className="mt-3 h-16 w-full rounded-2xl bg-white/10" />
				<Skeleton className="mt-6 h-24 w-full bg-white/10" />
			</div>
		</div>
	);
}
