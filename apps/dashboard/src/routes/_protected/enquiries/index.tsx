import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { Download, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { AsyncBoundary } from "#/components/async-boundary";
import type { Lead } from "#/lib/data";
import { viewInfo } from "#/lib/data";
import { csvFor, download } from "#/lib/utils";
import {
	EnquiriesTableSkeleton,
	EnquiryTableContent,
} from "#/modules/enquiries/components/enquiries-table";
import { enquiriesListQueryOptions } from "@/modules/enquiries/query-options";

export const enquiriesSearchSchema = z.object({
	view: z.string().default("all").catch("all"),
	typeFilter: z.string().default("All types").catch("All types"),
	page: z.number().default(1).catch(1),
	limit: z.number().default(15).catch(15),
	search: z.string().default("").catch(""),
	date: z.string().default("All dates").catch("All dates"),
});

export type EnquiriesSearch = z.infer<typeof enquiriesSearchSchema>;

export const Route = createFileRoute("/_protected/enquiries/")({
	staticData: {
		title: "Enquiries",
	},
	validateSearch: (search) => enquiriesSearchSchema.parse(search),
	beforeLoad: ({ context, search }) => {
		void context.queryClient.query(enquiriesListQueryOptions(search));
	},
	component: EnquiriesRoute,
});

const TYPE_FILTERS = [
	"All types",
	"Customer",
	"Agent",
	"Investor",
	"Career",
	"Contact",
] as const;

const DATE_OPTIONS = [
	"All dates",
	"Today",
	"Yesterday",
	"Last 3 days",
	"Last 7 days",
];

function EnquiriesRoute() {
	const searchParams = Route.useSearch();
	const navigate = useNavigate({ from: "/enquiries/" });
	const queryClient = useQueryClient();

	const [localSearch, setLocalSearch] = useState(searchParams.search);

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (localSearch !== searchParams.search) {
				navigate({
					search: (prev) => ({ ...prev, search: localSearch, page: 1 }),
				});
			}
		}, 400);
		return () => clearTimeout(timeout);
	}, [localSearch, searchParams.search, navigate]);

	const filtersActive =
		Boolean(searchParams.search.trim()) ||
		searchParams.typeFilter !== "All types" ||
		searchParams.date !== "All dates";

	const [title, note] = viewInfo(searchParams.view);

	const clearFilters = () => {
		setLocalSearch("");
		navigate({
			search: (prev) => ({
				...prev,
				search: "",
				typeFilter: "All types",
				date: "All dates",
				page: 1,
			}),
		});
	};

	const handleDownload = () => {
		// Fetch directly from cache so the download button doesn't need to be suspended
		const queryKey = enquiriesListQueryOptions(searchParams).queryKey;
		const cached = queryClient.getQueryData<{ data: Lead[] }>(queryKey);
		if (cached?.data) {
			download(`gavikina-${searchParams.view}.csv`, csvFor(cached.data));
		}
	};

	return (
		<div className="flex animate-gv-fade flex-col gap-6">
			{/* Static Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="page-title">{title}</h1>
					<p className="page-description mt-1">{note}</p>
				</div>
				<Button variant="outline" size="sm" onClick={handleDownload}>
					<Download className="size-4" />
					Download CSV
				</Button>
			</div>

			{/* Static Filters */}
			<div className="flex flex-wrap items-center gap-3">
				<div className="relative min-w-64 flex-1">
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-navy/40" />
					<Input
						type="search"
						value={localSearch}
						onChange={(e) => setLocalSearch(e.target.value)}
						placeholder="Search name, phone, email, area or size..."
						className="pl-9 bg-background"
					/>
				</div>

				{searchParams.view === "all" && (
					<div className="flex flex-wrap gap-1.5">
						{TYPE_FILTERS.map((type) => {
							const active = searchParams.typeFilter === type;
							return (
								<button
									key={type}
									type="button"
									className={cn(
										"rounded-full border px-3.5 py-2 text-xs font-medium transition-colors",
										active
											? "border-green bg-green/10 font-semibold text-green"
											: "border-navy/15 bg-white text-navy/70 hover:bg-cream hover:text-navy",
									)}
									onClick={() =>
										navigate({
											search: (prev) => ({
												...prev,
												typeFilter: type,
												page: 1,
											}),
										})
									}
								>
									{type === "All types"
										? "All"
										: type === "Career"
											? "Careers"
											: `${type}s`}
								</button>
							);
						})}
					</div>
				)}

				<Select
					value={searchParams.date}
					onValueChange={(val) =>
						val &&
						navigate({ search: (prev) => ({ ...prev, date: val, page: 1 }) })
					}
				>
					<SelectTrigger className="w-40 bg-white">
						<SelectValue placeholder="Select date" />
					</SelectTrigger>
					<SelectContent>
						{DATE_OPTIONS.map((date) => (
							<SelectItem key={date} value={date}>
								{date}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{filtersActive && (
					<Button variant="ghost" size="sm" onClick={clearFilters}>
						Clear filters
					</Button>
				)}
			</div>

			{/* Suspended Table Area */}
			<AsyncBoundary
				errorTitle="Failed to load enquiries"
				fallback={<EnquiriesTableSkeleton />}
			>
				<EnquiryTableContent searchParams={searchParams} />
			</AsyncBoundary>
		</div>
	);
}
