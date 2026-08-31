import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { useMemo } from "react";
import { AsyncBoundary } from "#/components/async-boundary";
import { getStableDateRange } from "#/lib/get-date-range";
import { dashboardOverviewQueryOptions } from "@/modules/dashboard/query-options";

export const Route = createFileRoute("/_protected/")({
	component: OverviewRoute,
});

const TYPE_STYLES: Record<string, { label: string; colorClass: string }> = {
	customer: { label: "Customer enquiries", colorClass: "bg-green" },
	agent: { label: "Agent enquiries", colorClass: "bg-amber" },
	investor: { label: "Investor enquiries", colorClass: "bg-navy" },
	careers: { label: "Job applications", colorClass: "bg-purple-700" },
	contact: { label: "Contact form", colorClass: "bg-navy/35" },
};

function OverviewRoute() {
	const dateRange = useMemo(() => getStableDateRange(), []);

	return (
		<div className="flex flex-col gap-8 animate-gv-fade">
			<div>
				<h1 className="page-title">Overview</h1>
				<p className="page-description mt-1">
					All enquiries received through the site, tools and forms. Figures
					cover {dateRange.label}.
				</p>
			</div>

			<AsyncBoundary
				errorTitle="Failed to load dashboard overview"
				fallback={<OverviewSkeleton />}
			>
				<OverviewContent dateRange={dateRange} />
			</AsyncBoundary>
		</div>
	);
}

// 2. DATA COMPONENT (Suspends while fetching)
function OverviewContent({
	dateRange,
}: {
	dateRange: ReturnType<typeof getStableDateRange>;
}) {
	const { data } = useSuspenseQuery(
		dashboardOverviewQueryOptions({
			startDate: dateRange.startDate,
			endDate: dateRange.endDate,
		}),
	);

	const { stats, received, sizes, assessments } = data;

	const statCards = useMemo(() => {
		const totalAssessments = assessments.completed + assessments.abandoned;
		const completionRate = totalAssessments
			? Math.round((assessments.completed / totalAssessments) * 100)
			: 0;

		return [
			{
				label: "Total enquiries",
				value: String(stats.totalEnquiries),
				note: "Customers, agents, investors and contact form",
			},
			{
				label: "Completed assessments",
				value: String(assessments.completed),
				note: `${completionRate}% of assessments started`,
			},
			{
				label: "Abandoned assessments",
				value: String(assessments.abandoned),
				note: "Partial data captured",
			},
			{
				label: "Agent applications",
				value: String(stats.typeCounts.agent || 0),
				note: "Awaiting screening call",
			},
			{
				label: "Investor enquiries",
				value: String(stats.typeCounts.investor || 0),
				note: "Materials sent manually",
			},
			{
				label: "Job applications",
				value: String(stats.typeCounts.careers || 0),
				note: "From the Careers page",
			},
		];
	}, [stats, assessments]);

	const typeBars = useMemo(() => {
		const total = stats.totalEnquiries || 1;
		return ["customer", "agent", "investor", "careers", "contact"].map((t) => {
			const count = stats.typeCounts[t] || 0;
			const share = Math.round((count / total) * 100);
			return {
				id: t,
				label: TYPE_STYLES[t]?.label || t,
				count,
				share,
				colorClass: TYPE_STYLES[t]?.colorClass || "bg-navy/30",
			};
		});
	}, [stats]);

	const dayBars = useMemo(() => {
		const max = Math.max(1, ...received.map((r) => r.count));
		return received.map((r) => ({
			label: r.date,
			count: r.count,
			max,
			isMax: r.count === max && max > 0,
		}));
	}, [received]);

	const sizeRows = useMemo(() => {
		const max = Math.max(1, ...sizes.map((s) => s.count));
		return sizes.map((s) => ({
			size: s.tier,
			count: s.count,
			max,
		}));
	}, [sizes]);

	return (
		<div className="flex flex-col gap-8 animate-gv-fade">
			{/* Stat Metric Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{statCards.map((k) => (
					<Card key={k.label} className="border-navy/10 shadow-xs">
						<CardHeader className="pb-2">
							<span className="text-xs font-semibold uppercase tracking-wider text-navy/50">
								{k.label}
							</span>
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-semibold tracking-tight text-navy">
								{k.value}
							</div>
							<p className="mt-1 text-xs text-navy/60">{k.note}</p>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Breakdown Section */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				{/* Enquiries by Type */}
				<Card className="border-navy/10 shadow-xs lg:col-span-7">
					<CardHeader>
						<CardTitle className="text-base font-semibold text-navy">
							Enquiries by type
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{typeBars.map((b) => (
							<div key={b.id} className="space-y-1.5">
								<div className="flex items-center justify-between text-xs">
									<span className="font-medium text-navy">{b.label}</span>
									<span className="tabular-nums text-navy/60">
										{b.count} · {b.share}%
									</span>
								</div>
								<div className="h-2 w-full overflow-hidden rounded-full bg-navy/5">
									<div
										className={cn(
											"h-full rounded-full transition-all",
											b.colorClass,
										)}
										style={{ width: `${b.share}%` }}
									/>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Received Per Day */}
				<Card className="border-navy/10 shadow-xs lg:col-span-5">
					<CardHeader>
						<CardTitle className="text-base font-semibold text-navy">
							Received per day
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex h-36 items-end gap-3 pt-2">
							{dayBars.length > 0 ? (
								dayBars.map((d) => (
									<div
										key={d.label}
										className="flex flex-1 flex-col items-center gap-2"
									>
										<span className="text-xs font-semibold tabular-nums text-navy">
											{d.count}
										</span>
										<div className="flex h-24 w-full items-end">
											<div
												className={cn(
													"w-full rounded-t-md transition-all",
													d.isMax ? "bg-green" : "bg-green/40",
												)}
												style={{
													height: `${Math.max(6, (d.count / d.max) * 100)}%`,
												}}
											/>
										</div>
										<span className="text-xs text-navy/50">{d.label}</span>
									</div>
								))
							) : (
								<div className="flex h-full w-full items-center justify-center text-sm text-navy/40">
									No data for this period
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Sizes Recommended */}
			<Card className="border-navy/10 shadow-xs">
				<CardHeader>
					<CardTitle className="text-base font-semibold text-navy">
						Sizes recommended
					</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-3.5">
					{sizeRows.length > 0 ? (
						sizeRows.map((r) => (
							<div key={r.size} className="flex items-center gap-4">
								<span className="w-20 text-xs font-medium text-navy sm:text-sm">
									{r.size}
								</span>
								<div className="h-2.5 flex-1 overflow-hidden rounded-full bg-navy/5">
									<div
										className="h-full rounded-full bg-green transition-all"
										style={{
											width: `${Math.round((r.count / r.max) * 100)}%`,
										}}
									/>
								</div>
								<span className="w-8 text-right text-xs font-semibold tabular-nums text-navy/70">
									{r.count}
								</span>
							</div>
						))
					) : (
						<div className="py-4 text-center text-sm text-navy/40">
							No assessments completed in this period.
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

// -----------------------------------------------------------------------------
// SKELETON LOADER
// -----------------------------------------------------------------------------

function OverviewSkeleton() {
	return (
		<div className="flex flex-col gap-8 animate-gv-fade">
			{/* Stat Metric Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
					<Card key={i} className="border-navy/10 shadow-xs">
						<CardHeader className="pb-2">
							<Skeleton className="h-3 w-24 bg-navy/10" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-9 w-16 bg-navy/10" />
							<Skeleton className="mt-2 h-3 w-40 bg-navy/5" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Breakdown Section */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				{/* Enquiries by Type */}
				<Card className="border-navy/10 shadow-xs lg:col-span-7">
					<CardHeader>
						<Skeleton className="h-5 w-40 bg-navy/10" />
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{Array.from({ length: 5 }).map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
							<div key={i} className="space-y-2">
								<div className="flex items-center justify-between">
									<Skeleton className="h-3.5 w-32 bg-navy/10" />
									<Skeleton className="h-3.5 w-16 bg-navy/5" />
								</div>
								<Skeleton className="h-2 w-full bg-navy/5" />
							</div>
						))}
					</CardContent>
				</Card>

				{/* Received Per Day */}
				<Card className="border-navy/10 shadow-xs lg:col-span-5">
					<CardHeader>
						<Skeleton className="h-5 w-32 bg-navy/10" />
					</CardHeader>
					<CardContent>
						<div className="flex h-36 items-end gap-3 pt-2">
							{[40, 70, 30, 90, 50].map((height, i) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
									key={i}
									className="flex flex-1 flex-col items-center gap-2"
								>
									<Skeleton className="h-3.5 w-6 bg-navy/10" />
									<div className="flex h-24 w-full items-end">
										<Skeleton
											className="w-full rounded-t-md rounded-b-none bg-navy/5"
											style={{ height: `${height}%` }}
										/>
									</div>
									<Skeleton className="h-3.5 w-10 bg-navy/10" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Sizes Recommended */}
			<Card className="border-navy/10 shadow-xs">
				<CardHeader>
					<Skeleton className="h-5 w-40 bg-navy/10" />
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					{Array.from({ length: 4 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
						<div key={i} className="flex items-center gap-4">
							<Skeleton className="h-4 w-16 sm:w-20 bg-navy/10" />
							<Skeleton className="h-2.5 flex-1 bg-navy/5" />
							<Skeleton className="h-4 w-8 bg-navy/10" />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
