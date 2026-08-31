import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
	columnFilteringFeature,
	columnVisibilityFeature,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	globalFilteringFeature,
	rowPaginationFeature,
	rowSortingFeature,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@workspace/ui/components/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@workspace/ui/components/table";
import { cn } from "@workspace/ui/lib/utils";
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	Download,
	Search,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { Lead } from "#/lib/data";
import { viewInfo } from "#/lib/data";
import { csvFor, download, summaryOf } from "#/lib/utils";
import type { EnquiriesSearch } from "@/routes/_protected/enquiries/index";
import { enquiriesListQueryOptions } from "../query-options";

const features = tableFeatures({
	columnFilteringFeature,
	globalFilteringFeature,
	rowSortingFeature,
	columnVisibilityFeature,
	rowPaginationFeature,
	filteredRowModel: createFilteredRowModel(),
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
});

type EnquiryTableFeatures = typeof features;

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

const getTypeBadgeClass = (type: string) => {
	switch (type) {
		case "Customer":
			return "bg-green/10 text-green border-green/20";
		case "Agent":
			return "bg-amber/15 text-amber-700 border-amber/30";
		case "Investor":
			return "bg-navy/10 text-navy border-navy/20";
		case "Career":
			return "bg-purple-100 text-purple-700 border-purple-200";
		default:
			return "bg-navy/5 text-navy/70 border-navy/15";
	}
};

const columns: ColumnDef<EnquiryTableFeatures, Lead>[] = [
	{
		accessorKey: "type",
		header: "Type",
		cell: ({ getValue }) => {
			const type = getValue<string>();
			return (
				<Badge
					variant="outline"
					className={cn("text-xs font-semibold", getTypeBadgeClass(type))}
				>
					{type}
				</Badge>
			);
		},
	},
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => {
			const lead = row.original;
			const subtext =
				lead.type === "Customer"
					? `${lead.property || ""} · ${lead.area || "Area not given"}`
					: lead.area || lead.email || "";

			return (
				<div className="flex min-w-0 flex-col gap-0.5">
					<span className="truncate text-sm font-medium text-navy">
						{lead.name}
					</span>
					{subtext && (
						<span className="truncate text-xs text-navy/50">{subtext}</span>
					)}
				</div>
			);
		},
	},
	{
		id: "contact",
		header: "Contact",
		cell: ({ row }) => {
			const lead = row.original;
			const contact =
				lead.phone || lead.email || lead.contact || "Not captured";
			return (
				<span className="truncate text-xs text-navy/70 sm:text-sm">
					{contact}
				</span>
			);
		},
	},
	{
		id: "summary",
		header: "Summary",
		cell: ({ row }) => (
			<span className="truncate text-xs text-navy/70 sm:text-sm">
				{summaryOf(row.original)}
			</span>
		),
	},
	{
		accessorKey: "when",
		header: ({ column }) => {
			const sorted = column.getIsSorted();
			return (
				<button
					type="button"
					className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-navy/60 uppercase hover:text-navy"
					onClick={() => column.toggleSorting(sorted === "asc")}
				>
					Received
					{sorted === "asc" ? (
						<ArrowUp className="size-3.5" />
					) : sorted === "desc" ? (
						<ArrowDown className="size-3.5" />
					) : (
						<ArrowUpDown className="size-3.5 opacity-50" />
					)}
				</button>
			);
		},
		cell: ({ getValue }) => (
			<span className="text-xs whitespace-nowrap text-navy/60 tabular-nums">
				{new Date(getValue<string>()).toLocaleString("en-GB", {
					day: "numeric",
					month: "short",
					hour: "2-digit",
					minute: "2-digit",
				})}
			</span>
		),
	},
];

interface EnquiryTableProps {
	searchParams: EnquiriesSearch;
}

export default function EnquiryTable({ searchParams }: EnquiryTableProps) {
	const navigate = useNavigate({ from: "/enquiries/" });

	const { data: response } = useSuspenseQuery(
		enquiriesListQueryOptions(searchParams),
	);

	const rows = response.data;
	const meta = response.meta;

	// Debounce global search to avoid hitting the API on every keystroke
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

	// Configured strictly for Server-Side Processing
	const table = useTable({
		features,
		data: rows,
		columns,
		manualPagination: true,
		manualFiltering: true,
		manualSorting: true,
		pageCount: meta.totalPages,
		state: {
			pagination: {
				pageIndex: meta.page - 1, // TanStack table is 0-indexed
				pageSize: meta.limit,
			},
		},
	});

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
		// Downloads the currently visible page of data
		download(`gavikina-${searchParams.view}.csv`, csvFor(rows));
	};

	return (
		<div className="flex animate-gv-fade flex-col gap-6">
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

			<Card className="overflow-hidden border-navy/10 shadow-xs py-0">
				<Table>
					<TableHeader className="bg-muted/40">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										className="text-xs font-semibold tracking-wider text-navy/60 uppercase"
									>
										{header.isPlaceholder ? null : (
											<table.FlexRender header={header} />
										)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{/* FIX: Map over table.getRowModel().rows instead of raw rows */}
						{table.getRowModel().rows.length > 0 ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									className="cursor-pointer transition-colors hover:bg-cream/50"
									onClick={() =>
										navigate({
											to: "/enquiries/$id",
											params: { id: row.original.id }, // row.original accesses your Lead type safely
											search: { view: searchParams.view },
										})
									}
								>
									{/* FIX: Now safely use getVisibleCells since the feature is enabled */}
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="py-3.5">
											<table.FlexRender cell={cell} />
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={table.getVisibleLeafColumns().length}
									className="h-28 text-center text-sm text-navy/50"
								>
									No records match these filters.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				{/* Server-Side Pagination Footer */}
				<div className="flex items-center justify-between border-t border-navy/10 bg-white/50 px-4 py-3">
					<p className="text-xs text-navy/50">
						Showing{" "}
						<span className="font-semibold text-navy">
							{meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1}
						</span>{" "}
						to{" "}
						<span className="font-semibold text-navy">
							{Math.min(meta.page * meta.limit, meta.total)}
						</span>{" "}
						of <span className="font-semibold text-navy">{meta.total}</span>{" "}
						records
					</p>

					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								navigate({ search: (p) => ({ ...p, page: p.page - 1 }) })
							}
							disabled={meta.page <= 1}
							className="h-8"
						>
							<ChevronLeft className="mr-1 size-3.5" /> Prev
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								navigate({ search: (p) => ({ ...p, page: p.page + 1 }) })
							}
							disabled={meta.page >= meta.totalPages}
							className="h-8"
						>
							Next <ChevronRight className="ml-1 size-3.5" />
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}
