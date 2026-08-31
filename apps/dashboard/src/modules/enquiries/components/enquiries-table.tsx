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
import { Skeleton } from "@workspace/ui/components/skeleton";
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
} from "lucide-react";
import type { Lead } from "#/lib/data";
import { summaryOf } from "#/lib/utils";
import type { EnquiriesSearch } from "#/routes/_protected/enquiries";
import { enquiriesListQueryOptions } from "@/modules/enquiries/query-options";

// -----------------------------------------------------------------------------
// TABLE CONFIG
// -----------------------------------------------------------------------------

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

export function EnquiryTableContent({
	searchParams,
}: {
	searchParams: EnquiriesSearch;
}) {
	const navigate = useNavigate({ from: "/enquiries/" });
	const { data: response } = useSuspenseQuery(
		enquiriesListQueryOptions(searchParams),
	);

	const rows = response.data;
	const meta = response.meta;

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
				pageIndex: meta.page - 1,
				pageSize: meta.limit,
			},
		},
	});

	return (
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
					{table.getRowModel().rows.length > 0 ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								className="cursor-pointer transition-colors hover:bg-cream/50"
								onClick={() =>
									navigate({
										to: "/enquiries/$id",
										params: { id: row.original.id },
										search: { view: searchParams.view },
									})
								}
							>
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

			{/* Pagination */}
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
	);
}

// -----------------------------------------------------------------------------
// SKELETON LOADER
// -----------------------------------------------------------------------------

export function EnquiriesTableSkeleton() {
	return (
		<Card className="overflow-hidden border-navy/10 shadow-xs py-0">
			<Table>
				<TableHeader className="bg-muted/40">
					<TableRow>
						{["Type", "Name", "Contact", "Summary", "Received"].map(
							(header) => (
								<TableHead key={header} className="py-3">
									<Skeleton className="h-4 w-20 bg-navy/10" />
								</TableHead>
							),
						)}
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 10 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton
						<TableRow key={i}>
							<TableCell className="py-3.5">
								<Skeleton className="h-6 w-20 rounded-full bg-navy/10" />
							</TableCell>
							<TableCell className="py-3.5">
								<div className="flex flex-col gap-1.5">
									<Skeleton className="h-4 w-32 bg-navy/10" />
									<Skeleton className="h-3 w-48 bg-navy/5" />
								</div>
							</TableCell>
							<TableCell className="py-3.5">
								<Skeleton className="h-4 w-32 bg-navy/5" />
							</TableCell>
							<TableCell className="py-3.5">
								<Skeleton className="h-4 w-40 bg-navy/5" />
							</TableCell>
							<TableCell className="py-3.5">
								<Skeleton className="h-4 w-24 bg-navy/5" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="flex items-center justify-between border-t border-navy/10 bg-white/50 px-4 py-3">
				<Skeleton className="h-4 w-48 bg-navy/5" />
				<div className="flex items-center space-x-2">
					<Skeleton className="h-8 w-20 bg-navy/10" />
					<Skeleton className="h-8 w-20 bg-navy/10" />
				</div>
			</div>
		</Card>
	);
}
