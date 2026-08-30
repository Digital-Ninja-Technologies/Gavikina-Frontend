import { useQuery } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";
import { cn } from "@workspace/ui/lib/utils";
import { Loader2, Minus, Plus } from "lucide-react";
import { useMemo } from "react";
import { catalogueAppliancesQueryOptions } from "#/modules/catalogue/query-options";
import AssessmentFooter from "../components/assessment-footer";
import { assessmentStore } from "../store";

export default function StepAppliances() {
	const sel = useSelector(assessmentStore, (s) => s.selection);
	const property = useSelector(assessmentStore, (s) => s.property);

	const {
		data: appliances,
		isPending,
		isError,
	} = useQuery(catalogueAppliancesQueryOptions());

	const groups = useMemo(() => {
		if (!appliances) return [];
		const cats = [...new Set(appliances.map((a) => a.category))].filter(
			(cat) => property === "business" || cat !== "Business",
		);
		return cats.map((cat) => ({
			name: cat,
			items: appliances.filter((a) => a.category === cat),
		}));
	}, [property, appliances]);

	const bump = (id: string, d: number, dflt: number) => {
		assessmentStore.setState((s) => {
			const curQty = s.selection[id] || 0;
			const next = curQty === 0 && d > 0 ? dflt || 1 : Math.max(0, curQty + d);
			const nextSel = { ...s.selection };
			if (next === 0) delete nextSel[id];
			else nextSel[id] = next;
			return { ...s, selection: nextSel };
		});
	};

	const apiApplianceArray = useMemo(() => {
		return Object.entries(sel).map(([applianceId, quantity]) => ({
			applianceId,
			quantity,
		}));
	}, [sel]);

	const localWatts = useMemo(() => {
		if (!appliances) return 0;
		return Object.entries(sel).reduce((total, [id, qty]) => {
			const app = appliances.find((a) => a.id === id);
			return total + (app ? app.typical_wattage * qty : 0);
		}, 0);
	}, [sel, appliances]);

	if (isPending) {
		return (
			<div className="flex h-full flex-col justify-between animate-gv-fade">
				<div className="flex flex-1 flex-col items-center justify-center text-center">
					<Loader2 className="mb-4 size-8 animate-spin text-green" />
					<h3 className="text-xl font-semibold tracking-tight text-navy">
						Loading appliances...
					</h3>
				</div>
			</div>
		);
	}

	if (isError || !appliances) {
		return (
			<div className="flex h-full min-w-0 flex-col justify-between animate-gv-fade">
				<div>
					<span className="text-xs font-semibold uppercase tracking-wider text-amber">
						Connection Error
					</span>

					<div className="mt-4 overflow-hidden rounded-2xl bg-ink p-6 text-white shadow-xs sm:p-8">
						<h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
							Unable to load catalogue
						</h3>
						<p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
							We couldn't retrieve the appliance list. Please check your
							connection and try again.
						</p>
					</div>
				</div>

				<AssessmentFooter canAdvance={false} hideNext />
			</div>
		);
	}

	return (
		<div className="flex h-full min-w-0 flex-col justify-between animate-gv-fade">
			<div>
				<h3 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
					What should the system power?
				</h3>
				<p className="mt-2 text-sm text-navy/70 sm:text-base">
					Tap to add, then set quantities. Running total:{" "}
					<strong className="font-semibold text-navy">
						{localWatts.toLocaleString()}W
					</strong>
				</p>

				<div className="mt-6 flex max-h-80 flex-col gap-5 overflow-y-auto pr-2">
					{groups.map((group) => (
						<div key={group.name}>
							<div className="mb-2.5 flex items-center gap-3">
								<span className="text-xs font-semibold uppercase tracking-wider text-navy/50">
									{group.name}
								</span>
								<span className="h-px flex-1 bg-navy/10" />
							</div>

							<div className="flex flex-wrap gap-2">
								{group.items.map((item) => {
									const qty = sel[item.id] || 0;
									const on = qty > 0;
									return (
										<div
											key={item.id}
											className={cn(
												"flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors",
												on
													? "border-green/40 bg-green/5"
													: "border-navy/10 bg-white",
											)}
										>
											<button
												type="button"
												className="text-xs font-medium text-navy sm:text-sm"
												onClick={() =>
													bump(
														item.id,
														qty > 0 ? -qty : 1,
														item.default_quantity,
													)
												}
											>
												{item.name}
											</button>
											{on && (
												<span className="flex items-center gap-1 border-l border-navy/15 pl-2">
													<button
														type="button"
														className="flex size-5 items-center justify-center rounded-md bg-green/10 text-green transition-colors hover:bg-green/20"
														onClick={() =>
															bump(item.id, -1, item.default_quantity)
														}
													>
														<Minus className="size-3" />
													</button>
													<span className="w-4 text-center text-xs font-semibold tabular-nums text-navy">
														{qty}
													</span>
													<button
														type="button"
														className="flex size-5 items-center justify-center rounded-md bg-green/10 text-green transition-colors hover:bg-green/20"
														onClick={() =>
															bump(item.id, 1, item.default_quantity)
														}
													>
														<Plus className="size-3" />
													</button>
												</span>
											)}
										</div>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</div>

			<AssessmentFooter
				canAdvance={apiApplianceArray.length > 0}
				apiStepNumber={3}
				apiPayload={{ appliances: apiApplianceArray }}
			/>
		</div>
	);
}
