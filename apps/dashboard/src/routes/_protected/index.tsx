import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@workspace/ui/components/chart";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
	Briefcase,
	CheckCircle2,
	FileText,
	Inbox,
	UserPlus,
	XCircle,
} from "lucide-react";
import { useMemo } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Pie,
	PieChart,
	XAxis,
	YAxis,
} from "recharts";
import { AsyncBoundary } from "#/components/async-boundary";
import { getStableDateRange } from "#/lib/get-date-range";
import { dashboardOverviewQueryOptions } from "@/modules/dashboard/query-options";

export const Route = createFileRoute("/_protected/")({
	component: OverviewRoute,
});

const CHART_COLORS = {
	customer: "#2e9e45",
	agent: "#f5a623",
	investor: "#14375e",
	careers: "#7e22ce",
	contact: "#8a9bb0",
	barDefault: "#2e9e45",
};

const typeChartConfig = {
	customer: { label: "Customers", color: CHART_COLORS.customer },
	agent: { label: "Agents", color: CHART_COLORS.agent },
	investor: { label: "Investors", color: CHART_COLORS.investor },
	careers: { label: "Careers", color: CHART_COLORS.careers },
	contact: { label: "Contact Form", color: CHART_COLORS.contact },
};

const trendChartConfig = {
	count: { label: "Enquiries", color: CHART_COLORS.barDefault },
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
		const totalAssessments = assessments?.completed + assessments?.abandoned;
		const completionRate = totalAssessments
			? Math.round((assessments.completed / totalAssessments) * 100)
			: 0;

		return [
			{
				label: "Total enquiries",
				value: String(stats.totalEnquiries),
				note: "All forms and tools",
				icon: Inbox,
				color: "text-navy",
			},
			{
				label: "Completed assessments",
				value: String(assessments.completed),
				note: `${completionRate}% of started`,
				icon: CheckCircle2,
				color: "text-green",
			},
			{
				label: "Abandoned assessments",
				value: String(assessments.abandoned),
				note: "Partial data captured",
				icon: XCircle,
				color: "text-red-500",
			},
			{
				label: "Agent applications",
				value: String(stats.typeCounts.agent || 0),
				note: "Awaiting screening call",
				icon: UserPlus,
				color: "text-amber",
			},
			{
				label: "Investor enquiries",
				value: String(stats.typeCounts.investor || 0),
				note: "Materials sent manually",
				icon: Briefcase,
				color: "text-navy",
			},
			{
				label: "Job applications",
				value: String(stats.typeCounts.careers || 0),
				note: "From the Careers page",
				icon: FileText,
				color: "text-purple-600",
			},
		];
	}, [stats, assessments]);

	const typeData = useMemo(() => {
		return ["customer", "agent", "investor", "careers", "contact"]
			.map((t) => ({
				id: t,
				count: stats.typeCounts[t] || 0,
				fill: CHART_COLORS[t as keyof typeof CHART_COLORS],
			}))
			.filter((d) => d.count > 0);
	}, [stats]);

	const dayData = useMemo(() => {
		return received.map((r) => ({
			date: r.date,
			count: r.count,
		}));
	}, [received]);

	const sizeData = useMemo(() => {
		return sizes
			.sort((a, b) => b.count - a.count)
			.map((s) => ({
				tier: s.tier,
				count: s.count,
			}));
	}, [sizes]);

	return (
		<div className="flex flex-col gap-6">
			{/* Metric Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{statCards.map((k) => {
					const Icon = k.icon;
					return (
						<Card key={k.label} className="border-navy/10 shadow-xs">
							<CardHeader className="flex flex-row items-center justify-between pb-2">
								<CardTitle className="text-xs font-semibold uppercase tracking-wider text-navy/50">
									{k.label}
								</CardTitle>
								<Icon className={`size-4 ${k.color}`} />
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-semibold tracking-tight text-navy">
									{k.value}
								</div>
								<p className="mt-1 text-xs text-navy/60">{k.note}</p>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Middle Row: Trend and Distribution */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				{/* Trend Chart */}
				<Card className="border-navy/10 shadow-xs lg:col-span-8 flex flex-col">
					<CardHeader>
						<CardTitle className="text-base font-semibold text-navy">
							Received Over Time
						</CardTitle>
						<CardDescription className="text-xs">
							Daily volume of all incoming leads and enquiries
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-1 min-h-75">
						{dayData.length > 0 ? (
							<ChartContainer config={trendChartConfig} className="h-70 w-full">
								<BarChart
									data={dayData}
									margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
								>
									<CartesianGrid
										vertical={false}
										strokeDasharray="3 3"
										strokeOpacity={0.4}
									/>
									<XAxis
										dataKey="date"
										tickLine={false}
										axisLine={false}
										tickMargin={10}
										fontSize={12}
										tickFormatter={(value) => value.split(" ")[0]}
									/>
									<YAxis
										tickLine={false}
										axisLine={false}
										tickMargin={10}
										fontSize={12}
										allowDecimals={false}
									/>
									<ChartTooltip content={<ChartTooltipContent />} />
									<Bar
										dataKey="count"
										fill="var(--color-count)"
										radius={[4, 4, 0, 0]}
										maxBarSize={40}
									/>
								</BarChart>
							</ChartContainer>
						) : (
							<div className="flex h-full items-center justify-center text-sm text-navy/40">
								No data for this period
							</div>
						)}
					</CardContent>
				</Card>

				{/* Distribution Donut */}
				<Card className="border-navy/10 shadow-xs lg:col-span-4 flex flex-col">
					<CardHeader>
						<CardTitle className="text-base font-semibold text-navy">
							Distribution
						</CardTitle>
						<CardDescription className="text-xs">
							Enquiries grouped by source type
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-1 flex flex-col items-center justify-center min-h-75">
						{typeData.length > 0 ? (
							<ChartContainer config={typeChartConfig} className="h-60 w-full">
								<PieChart>
									<ChartTooltip
										cursor={false}
										content={<ChartTooltipContent hideLabel />}
									/>
									<Pie
										data={typeData}
										dataKey="count"
										nameKey="id"
										innerRadius={65}
										outerRadius={90}
										strokeWidth={2}
										paddingAngle={2}
									/>
									<ChartLegend
										content={<ChartLegendContent nameKey="id" />}
										className="-translate-y-2 flex-wrap gap-2"
									/>
								</PieChart>
							</ChartContainer>
						) : (
							<div className="text-sm text-navy/40">No distribution data</div>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Bottom Row: Sizes Recommended */}
			<Card className="border-navy/10 shadow-xs">
				<CardHeader>
					<CardTitle className="text-base font-semibold text-navy">
						Sizes Recommended
					</CardTitle>
					<CardDescription className="text-xs">
						Frequency of system tiers matched in completed assessments
					</CardDescription>
				</CardHeader>
				<CardContent>
					{sizeData.length > 0 ? (
						<ChartContainer
							config={{
								count: { label: "Assessments", color: CHART_COLORS.barDefault },
							}}
							className="h-[280px] w-full"
						>
							<BarChart
								data={sizeData}
								layout="vertical"
								margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
							>
								<CartesianGrid
									horizontal={false}
									strokeDasharray="3 3"
									strokeOpacity={0.4}
								/>
								<XAxis
									type="number"
									tickLine={false}
									axisLine={false}
									allowDecimals={false}
								/>
								<YAxis
									dataKey="tier"
									type="category"
									tickLine={false}
									axisLine={false}
									width={100}
									fontSize={12}
								/>
								<ChartTooltip
									cursor={{ fill: "rgba(0,0,0,0.02)" }}
									content={<ChartTooltipContent />}
								/>
								<Bar
									dataKey="count"
									fill="var(--color-count)"
									radius={[0, 4, 4, 0]}
									barSize={24}
								/>
							</BarChart>
						</ChartContainer>
					) : (
						<div className="py-12 text-center text-sm text-navy/40">
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
		<div className="flex flex-col gap-6 animate-gv-fade">
			{/* Metric Cards Skeleton */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
					<Card key={i} className="border-navy/10 shadow-xs">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<Skeleton className="h-3 w-24 bg-navy/10" />
							<Skeleton className="size-4 bg-navy/10" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-9 w-16 bg-navy/10" />
							<Skeleton className="mt-2 h-3 w-32 bg-navy/5" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Middle Row Skeleton */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				<Card className="border-navy/10 shadow-xs lg:col-span-8 flex flex-col">
					<CardHeader>
						<Skeleton className="h-5 w-40 bg-navy/10" />
						<Skeleton className="mt-1 h-3 w-64 bg-navy/5" />
					</CardHeader>
					<CardContent className="flex-1 flex items-end gap-4 min-h-75 pt-10">
						{[40, 70, 30, 90, 50, 80, 60].map((height, i) => (
							<Skeleton
								// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
								key={i}
								className="w-full rounded-t-md rounded-b-none bg-navy/5"
								style={{ height: `${height}%` }}
							/>
						))}
					</CardContent>
				</Card>

				<Card className="border-navy/10 shadow-xs lg:col-span-4 flex flex-col">
					<CardHeader>
						<Skeleton className="h-5 w-24 bg-navy/10" />
						<Skeleton className="mt-1 h-3 w-40 bg-navy/5" />
					</CardHeader>
					<CardContent className="flex-1 flex flex-col items-center justify-center min-h-[300px] gap-6">
						<Skeleton className="size-40 rounded-full bg-navy/5" />
						<div className="flex gap-2">
							<Skeleton className="h-3 w-12 bg-navy/10" />
							<Skeleton className="h-3 w-12 bg-navy/10" />
							<Skeleton className="h-3 w-12 bg-navy/10" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Bottom Row Skeleton */}
			<Card className="border-navy/10 shadow-xs">
				<CardHeader>
					<Skeleton className="h-5 w-40 bg-navy/10" />
					<Skeleton className="mt-1 h-3 w-64 bg-navy/5" />
				</CardHeader>
				<CardContent className="flex flex-col gap-6 min-h-75 justify-center">
					{Array.from({ length: 4 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
						<div key={i} className="flex items-center gap-4">
							<Skeleton className="h-4 w-20 shrink-0 bg-navy/10" />
							<Skeleton
								className="h-6 rounded-r-md rounded-l-none bg-navy/5"
								style={{ width: `${Math.max(20, 100 - i * 20)}%` }}
							/>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
