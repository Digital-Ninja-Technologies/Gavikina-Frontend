import { createFileRoute } from "@tanstack/react-router";
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
import { z } from "zod";
import { AsyncBoundary } from "#/components/async-boundary";
import EnquiryTable from "#/modules/enquiries/components/enquiries-table";
import { enquiriesListQueryOptions } from "#/modules/enquiries/query-options";

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
	validateSearch: (search) => enquiriesSearchSchema.parse(search),
	beforeLoad: ({ context, search }) => {
		void context.queryClient.query(enquiriesListQueryOptions(search));
	},
	component: EnquiriesRoute,
});

function EnquiriesRoute() {
	const searchParams = Route.useSearch();
	return (
		<AsyncBoundary
			errorTitle="Failed to load enquiries"
			fallback={<EnquiriesSkeleton />}
		>
			<EnquiryTable searchParams={searchParams} />
		</AsyncBoundary>
	);
}

// -----------------------------------------------------------------------------
// SKELETON LOADER
// -----------------------------------------------------------------------------

function EnquiriesSkeleton() {
	return (
		<div className="flex animate-gv-fade flex-col gap-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<Skeleton className="h-9 w-48 bg-navy/10" />
					<Skeleton className="mt-2 h-5 w-96 max-w-full bg-navy/5" />
				</div>
				<Skeleton className="h-9 w-32 bg-navy/10" />
			</div>

			{/* Filters */}
			<div className="flex flex-wrap items-center gap-3">
				{/* Search Bar */}
				<Skeleton className="h-9 min-w-64 flex-1 bg-navy/5" />

				{/* Type Pills */}
				<div className="flex flex-wrap gap-1.5">
					{Array.from({ length: 6 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
						<Skeleton key={i} className="h-9 w-20 rounded-full bg-navy/5" />
					))}
				</div>

				{/* Date Select */}
				<Skeleton className="h-9 w-40 bg-navy/5" />
			</div>

			{/* Table Card */}
			<Card className="overflow-hidden border-navy/10 shadow-xs">
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
							// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton array
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

				{/* Pagination Footer */}
				<div className="flex items-center justify-between border-t border-navy/10 bg-white/50 px-4 py-3">
					<Skeleton className="h-4 w-48 bg-navy/5" />
					<div className="flex items-center space-x-2">
						<Skeleton className="h-8 w-20 bg-navy/10" />
						<Skeleton className="h-8 w-20 bg-navy/10" />
					</div>
				</div>
			</Card>
		</div>
	);
}
