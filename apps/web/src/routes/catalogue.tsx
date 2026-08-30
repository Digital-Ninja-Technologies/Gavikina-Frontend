import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fmtRange, INCLUDED } from "@workspace/engine";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Check } from "lucide-react";
import { AsyncBoundary } from "@/components/async-boundary";
import { catalogueTiersQueryOptions } from "@/modules/catalogue/query-options";
import { openAssess, openCalc } from "../store/modal";

export const Route = createFileRoute("/catalogue")({
	component: CataloguePage,
	loader: async ({ context }) => {
		await context.queryClient.query(catalogueTiersQueryOptions());
	},
});

const COMPONENTS = [
	{
		part: "Solar panels",
		warranty: "25-year output",
		note: "Tier-1 monocrystalline. Brand confirmed at quotation.",
	},
	{
		part: "Hybrid inverter",
		warranty: "5 years",
		note: "Pure sine wave, generator input capable.",
	},
	{
		part: "Lithium batteries",
		warranty: "10 years / cycles",
		note: "LiFePO4 only. We do not install lead-acid banks.",
	},
	{
		part: "Mounting & protection",
		warranty: "Workmanship covered",
		note: "Aluminium rails, surge arrestors, DC isolators, earthing.",
	},
];

const ADDONS = [
	"Additional battery module",
	"Extra panel string",
	"Monitoring gateway",
	"Automatic changeover",
	"Panel cleaning visit",
	"Extended maintenance plan",
];

function CataloguePage() {
	return (
		<div className="section-wrapper">
			<span className="text-xs font-semibold uppercase tracking-widest text-green">
				Product catalogue
			</span>
			<h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-navy sm:text-4xl lg:text-5xl leading-[1.2]">
				Complete systems, by size.
			</h1>
			<p className="mt-3 max-w-2xl text-base leading-relaxed text-navy/70">
				Prices are indicative ranges for a fully installed system and come from
				the same tier data the calculator uses. Nothing is sold from this page —
				use the calculator or the assessment and an engineer confirms the final
				figure on site.
			</p>

			<div className="mt-10 mb-12">
				<AsyncBoundary
					errorTitle="Failed to load catalogue"
					fallback={<CatalogueSkeleton />}
				>
					<CatalogueTiersList />
				</AsyncBoundary>
			</div>

			<div className="mt-12 grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
				<div className="rounded-3xl bg-cream/80 p-6 sm:p-8 lg:p-10">
					<h2 className="text-xl font-semibold tracking-tight text-navy sm:text-2xl">
						In every system, at every size
					</h2>
					<p className="mt-2 text-sm leading-loose text-navy/70">
						No line item is optional. If it is needed to make the system work
						safely, it is in the price.
					</p>
					<div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
						{INCLUDED.map((item) => (
							<div
								key={item}
								className="flex items-center gap-2.5 text-xs font-medium text-navy/80 sm:text-sm"
							>
								<span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-green text-white">
									<Check className="size-2.5" />
								</span>
								{item}
							</div>
						))}
					</div>
				</div>

				<div className="rounded-3xl border border-navy/10 bg-white p-6 sm:p-8 lg:p-10">
					<h2 className="text-xl font-semibold tracking-tight text-navy sm:text-2xl">
						Components &amp; warranty
					</h2>
					<div className="mt-6 flex flex-col gap-4">
						{COMPONENTS.map((c) => (
							<div
								key={c.part}
								className="border-b border-navy/10 pb-4 last:border-b-0 last:pb-0"
							>
								<div className="flex items-baseline justify-between gap-3">
									<span className="text-sm font-semibold text-navy">
										{c.part}
									</span>
									<span className="shrink-0 text-xs font-semibold text-green">
										{c.warranty}
									</span>
								</div>
								<p className="mt-1 text-xs leading-relaxed text-navy/60 sm:text-sm">
									{c.note}
								</p>
							</div>
						))}
					</div>
					<p className="mt-4 text-xs italic text-navy/50">
						Brand names and warranty terms pending confirmation.
					</p>
				</div>
			</div>

			<div className="mt-8 rounded-3xl border border-dashed border-navy/20 p-6 sm:p-8">
				<h2 className="text-lg font-semibold tracking-tight text-navy sm:text-xl">
					Accessories &amp; add-ons
				</h2>
				<div className="mt-4 flex flex-wrap gap-2">
					{ADDONS.map((a) => (
						<span
							key={a}
							className="rounded-full border border-navy/10 bg-white px-3.5 py-1.5 text-xs font-medium text-navy/80 shadow-2xs sm:text-sm"
						>
							{a}
						</span>
					))}
				</div>
			</div>
		</div>
	);
}

function CatalogueTiersList() {
	const { data: tiers } = useSuspenseQuery(catalogueTiersQueryOptions());

	return (
		<div className="flex flex-col gap-4">
			{tiers.map((t) => (
				<div
					key={t.id}
					className="grid grid-cols-1 items-start gap-6 rounded-2xl border border-navy/10 bg-white p-6 shadow-xs transition-all hover:ring-green/14 hover:ring-2 hover:border-green/10 hover:bg-cream/20 sm:grid-cols-2 lg:grid-cols-[140px_1fr_200px_180px] lg:items-center"
				>
					<div>
						<div className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
							{t.name}
						</div>
						<div className="mt-0.5 text-xs text-navy/60">
							{t.size_kva} kVA continuous
						</div>
					</div>

					<div>
						<span className="text-xs font-semibold uppercase tracking-wider text-navy/50">
							Typically powers
						</span>
						<div className="mt-2 flex flex-wrap gap-1.5">
							{t.typically_powers.map((p) => (
								<span
									key={p}
									className="rounded-full bg-cream px-3 py-1 text-xs font-medium text-navy/80"
								>
									{p}
								</span>
							))}
						</div>
					</div>

					<div>
						<span className="text-xs font-medium uppercase tracking-wider text-navy/50">
							Indicative range
						</span>
						<div className="mt-1 font-medium tracking-tight text-navy">
							{fmtRange(t)}
						</div>
						<div className="text-xs text-navy/60">
							Installed &amp; commissioned
						</div>
					</div>

					<div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-1">
						<Button size="lg" onClick={() => openAssess()}>
							Full assessment
						</Button>
						<Button size="lg" variant="outline" onClick={openCalc}>
							Check my load
						</Button>
					</div>
				</div>
			))}
		</div>
	);
}

function CatalogueSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			{[...Array(4)].map((_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: static skeleton
					key={i}
					className="grid grid-cols-1 gap-6 rounded-2xl border border-navy/10 bg-white p-6 sm:grid-cols-2 lg:grid-cols-[140px_1fr_200px_180px] lg:items-center"
				>
					<div>
						<Skeleton className="mb-2 h-8 w-24" />
						<Skeleton className="h-4 w-28" />
					</div>
					<div>
						<Skeleton className="mb-2 h-3 w-24" />
						<div className="flex flex-wrap gap-1.5">
							<Skeleton className="h-6 w-20 rounded-full" />
							<Skeleton className="h-6 w-24 rounded-full" />
							<Skeleton className="h-6 w-16 rounded-full" />
						</div>
					</div>
					<div>
						<Skeleton className="mb-2 h-3 w-24" />
						<Skeleton className="mb-1 h-6 w-32" />
						<Skeleton className="h-3 w-28" />
					</div>
					<div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-1">
						<Skeleton className="h-9 w-full rounded-md" />
						<Skeleton className="h-9 w-full rounded-md" />
					</div>
				</div>
			))}
		</div>
	);
}
