/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <...> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <...> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <...> */
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
	createColumnHelper,
	createSortedRowModel,
	rowPaginationFeature,
	rowSelectionFeature,
	rowSortingFeature,
	tableFeatures,
	useTable,
} from "@tanstack/react-table";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@workspace/ui/components/table";
import { toast } from "@workspace/ui/components/toast";
import { cn } from "@workspace/ui/lib/utils";
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	Loader2,
	MoreHorizontal,
	Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import type { Lead } from "#/lib/data";
import { dashboardStatsQueryOptions } from "#/modules/dashboard/query-options";
import { deleteEnquiry } from "#/modules/enquiries/api";
import {
	enquiriesKeys,
	enquiriesListQueryOptions,
} from "#/modules/enquiries/query-options";
import type { EnquiriesSearch } from "#/routes/_protected/enquiries/index";

function ts(dateStr?: string): number {
	if (!dateStr) return 0;
	const timestamp = new Date(dateStr).getTime();
	return Number.isNaN(timestamp) ? 0 : timestamp;
}

function summaryOf(lead: Lead): string {
	return (
		(lead as Record<string, any>).summary ||
		(lead as Record<string, any>).message ||
		(lead as Record<string, any>).notes ||
		lead.property ||
		lead.area ||
		"No summary provided"
	);
}

interface IndeterminateCheckboxProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	indeterminate?: boolean;
}

function IndeterminateCheckbox({
	indeterminate,
	className,
	...props
}: IndeterminateCheckboxProps) {
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (ref.current) {
			ref.current.indeterminate = Boolean(indeterminate);
		}
	}, [indeterminate]);

	return (
		<input
			ref={ref}
			type="checkbox"
			className={cn(
				"size-4 cursor-pointer rounded border border-navy/20 accent-green",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/30",
				"disabled:cursor-not-allowed disabled:opacity-40",
				className,
			)}
			{...props}
		/>
	);
}

const features = tableFeatures({
	rowSelectionFeature,
	rowSortingFeature,
	rowPaginationFeature,
	sortedRowModel: createSortedRowModel(),
});

const columnHelper = createColumnHelper<typeof features, Lead>();

function createColumns(
	onDelete: (id: string) => void,
	canDelete: boolean,
	deletingIds: Set<string>,
) {
	return columnHelper.columns([
		columnHelper.display({
			id: "select",
			header: ({ table }) => (
				<IndeterminateCheckbox
					checked={table.getIsAllRowsSelected()}
					indeterminate={
						table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
					}
					onChange={table.getToggleAllRowsSelectedHandler()}
					disabled={!canDelete || deletingIds.size > 0}
					aria-label="Select all enquiries"
				/>
			),
			cell: ({ row }) => {
				const isDeleting = deletingIds.has(row.original.id);
				return (
					<div onClick={(event) => event.stopPropagation()}>
						<IndeterminateCheckbox
							checked={row.getIsSelected()}
							indeterminate={row.getIsSomeSelected()}
							disabled={!row.getCanSelect() || isDeleting}
							onChange={row.getToggleSelectedHandler()}
							aria-label={`Select ${row.original.name}`}
						/>
					</div>
				);
			},
		}),

		columnHelper.accessor("type", {
			header: "Type",
			cell: ({ getValue }) => {
				const type = getValue();

				const badgeClass = (() => {
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
				})();

				return (
					<Badge
						variant="outline"
						className={cn("text-xs font-semibold", badgeClass)}
					>
						{type}
					</Badge>
				);
			},
		}),

		columnHelper.accessor("name", {
			header: "Name",
			cell: ({ row }) => {
				const lead = row.original;

				const subtext =
					lead.type === "Customer"
						? [lead.property, lead.area].filter(Boolean).join(" · ") ||
							"Area not given"
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
		}),

		columnHelper.display({
			id: "contact",
			header: "Contact",
			cell: ({ row }) => {
				const lead = row.original;

				return (
					<span className="truncate text-xs text-navy/70 sm:text-sm">
						{lead.phone ||
							lead.email ||
							(lead as Record<string, any>).contact ||
							"Not captured"}
					</span>
				);
			},
		}),

		columnHelper.display({
			id: "summary",
			header: "Summary",
			cell: ({ row }) => (
				<span className="block max-w-64 truncate text-xs text-navy/70 sm:text-sm">
					{summaryOf(row.original)}
				</span>
			),
		}),

		columnHelper.accessor("when", {
			id: "when",
			header: ({ column }) => (
				<button
					type="button"
					className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy/60 hover:text-navy"
					onClick={column.getToggleSortingHandler()}
				>
					Received
					{column.getIsSorted() === "asc" ? (
						<ArrowUp className="size-3.5" />
					) : column.getIsSorted() === "desc" ? (
						<ArrowDown className="size-3.5" />
					) : (
						<ArrowUpDown className="size-3.5 opacity-50" />
					)}
				</button>
			),
			cell: ({ getValue }) => {
				const raw = getValue();
				if (!raw) return <span className="text-navy/40">-</span>;

				const date = new Date(raw);
				const formatted = Number.isNaN(date.getTime())
					? raw
					: new Intl.DateTimeFormat("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric",
						}).format(date);

				return (
					<span className="whitespace-nowrap text-xs tabular-nums text-navy/60">
						{formatted}
					</span>
				);
			},
			sortFn: (rowA, rowB) => ts(rowA.original.when) - ts(rowB.original.when),
		}),

		columnHelper.display({
			id: "actions",
			header: () => null,
			cell: ({ row }) => {
				const isDeleting = deletingIds.has(row.original.id);

				if (isDeleting) {
					return (
						<div className="flex size-8 items-center justify-center">
							<Loader2 className="size-4 animate-spin text-navy/40" />
						</div>
					);
				}

				return (
					<div onClick={(event) => event.stopPropagation()}>
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										className="size-8 text-navy/45 hover:bg-navy/5 hover:text-navy"
										aria-label={`Actions for ${row.original.name}`}
										disabled={!canDelete || deletingIds.size > 0}
									/>
								}
							>
								<MoreHorizontal className="size-4" />
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end" className="w-36">
								<DropdownMenuItem
									className="text-destructive focus:text-destructive hover:text-background!"
									onClick={() => onDelete(row.original.id)}
								>
									<Trash2 className="size-4" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				);
			},
		}),
	]);
}

interface EnquiriesTableContentProps {
	searchParams: EnquiriesSearch;
}

export function EnquiryTableContent({
	searchParams,
}: EnquiriesTableContentProps) {
	const navigate = useNavigate({ from: "/enquiries/" });
	const queryClient = useQueryClient();

	const { data: response } = useSuspenseQuery(
		enquiriesListQueryOptions(searchParams),
	);

	const rows = (response.data as Lead[]) ?? [];

	const meta = response.meta ?? {
		page: searchParams.page,
		limit: searchParams.limit,
		total: rows.length,
		totalPages: 1,
	};

  const canDelete = searchParams.view !== "abandoned"; // FIXME
	
	const deleteMutation = useMutation({
		mutationFn: async (ids: string[]) => {
			const results = await Promise.allSettled(
				ids.map(async (id) => {
					await deleteEnquiry(id);
					return id;
				}),
			);

			const deletedIds: string[] = [];
			const failedIds: string[] = [];

			for (const result of results) {
				if (result.status === "fulfilled") {
					deletedIds.push(result.value);
				} else {
					failedIds.push("failed");
				}
			}

			if (deletedIds.length === 0 && failedIds.length > 0) {
				throw new Error("Failed to delete selected enquiry.");
			}

			return {
				deletedCount: deletedIds.length,
				failedCount: failedIds.length,
			};
		},

		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: enquiriesKeys.lists(),
				}),
				queryClient.invalidateQueries({
					queryKey: dashboardStatsQueryOptions().queryKey,
				}),
			]);
		},
	});

	const deletingIds = useMemo(() => {
		return new Set(
			deleteMutation.isPending ? (deleteMutation.variables ?? []) : [],
		);
	}, [deleteMutation.isPending, deleteMutation.variables]);

	const executeDelete = (ids: string[]) => {
		if (!canDelete || deleteMutation.isPending) return;

		const isSingle = ids.length === 1;

		toast.promise(deleteMutation.mutateAsync(ids), {
			loading: isSingle
				? "Deleting enquiry..."
				: `Deleting ${ids.length} enquiries...`,
			success: ({ deletedCount, failedCount }) => {
				if (failedCount === 0) {
					return deletedCount === 1
						? "Enquiry removed."
						: `${deletedCount} enquiries removed.`;
				}
				return `${deletedCount} deleted, ${failedCount} failed.`;
			},
			error: (error) =>
				error instanceof Error
					? error.message
					: "Something went wrong while deleting.",
		});
	};

	const deleteOne = (id: string) => {
		executeDelete([id]);
	};

	const columns = useMemo(
		() => createColumns(deleteOne, canDelete, deletingIds),
		[canDelete, deletingIds],
	);

	const table = useTable({
		key: `enquiries-${searchParams.view}`,
		features,
		columns,
		data: rows,
		getRowId: (row) => row.id,
		manualPagination: true,
		enableRowSelection: canDelete,
		enableMultiRowSelection: true,
		enableRowRangeSelection: true,
		pageCount: meta.totalPages,
		state: {
			pagination: {
				pageIndex: meta.page - 1,
				pageSize: meta.limit,
			},
		},
		initialState: {
			sorting: [{ id: "when", desc: true }],
		},
	});

	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		table.setRowSelection({});
	}, [searchParams.view, searchParams.page]);

	const deleteSelected = () => {
		if (!canDelete || deleteMutation.isPending) return;

		const selection = table.atoms.rowSelection.get();

		const selectedIds = Object.entries(selection)
			.filter(([, selected]) => selected)
			.map(([id]) => id);

		if (selectedIds.length === 0) return;

		table.setRowSelection({});
		executeDelete(selectedIds);
	};

	return (
		<div className="flex flex-col gap-3">
			{canDelete && (
				<table.Subscribe selector={(state) => state.rowSelection}>
					{(rowSelection) => {
						const selectedCount =
							Object.values(rowSelection).filter(Boolean).length;

						if (selectedCount === 0) return null;

						return (
							<div className="flex flex-col gap-3 rounded-xl border border-green/15 bg-green/[0.04] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex items-center gap-2">
									<div className="flex size-6 items-center justify-center rounded-full bg-green/10 text-xs font-semibold text-green">
										{selectedCount}
									</div>

									<span className="text-sm font-medium text-navy">
										{selectedCount === 1
											? "1 enquiry selected"
											: `${selectedCount} enquiries selected`}
									</span>
								</div>

								<div className="flex items-center gap-2">
									<Button
										type="button"
										variant="ghost"
										size="sm"
										disabled={deleteMutation.isPending}
										onClick={() => table.setRowSelection({})}
									>
										Clear
									</Button>

									<Button
										type="button"
										variant="destructive"
										size="sm"
										className="gap-1.5"
										disabled={deleteMutation.isPending}
										onClick={deleteSelected}
									>
										{deleteMutation.isPending ? (
											<Loader2 className="size-3.5 animate-spin" />
										) : (
											<Trash2 className="size-3.5" />
										)}
										{deleteMutation.isPending
											? "Deleting..."
											: "Delete selected"}
									</Button>
								</div>
							</div>
						);
					}}
				</table.Subscribe>
			)}

			<Card className="overflow-hidden border-navy/10 py-0 shadow-xs">
				<div className="overflow-x-auto">
					<Table className="min-w-[900px]">
						<TableHeader className="bg-muted/40">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<TableHead
											key={header.id}
											className={cn(
												"text-xs font-semibold tracking-wider text-navy/60 uppercase",
												header.column.id === "select" && "w-12 px-3",
												header.column.id === "actions" &&
													"w-12 px-3 text-right",
											)}
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
								table.getRowModel().rows.map((row) => {
									const isRowDeleting = deletingIds.has(row.original.id);

									return (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() ? "selected" : undefined}
											className={cn(
												"cursor-pointer transition-colors",
												row.getIsSelected()
													? "bg-green/[0.04]"
													: "hover:bg-cream/40",
												isRowDeleting &&
													"pointer-events-none opacity-50 bg-navy/[0.03]",
											)}
											onClick={() => {
												if (isRowDeleting) return;
												navigate({
													to: "/enquiries/$id",
													params: { id: row.original.id },
													search: { view: searchParams.view },
												});
											}}
										>
											{row.getAllCells().map((cell) => (
												<TableCell
													key={cell.id}
													className={cn(
														"py-3.5",
														cell.column.id === "select" && "px-3",
														cell.column.id === "actions" && "px-3 text-right",
													)}
												>
													<table.FlexRender cell={cell} />
												</TableCell>
											))}
										</TableRow>
									);
								})
							) : (
								<TableRow>
									<TableCell
										colSpan={table.getAllLeafColumns().length}
										className="h-28 text-center text-sm text-navy/50"
									>
										No records match these filters.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

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
							type="button"
							variant="outline"
							size="sm"
							onClick={() =>
								navigate({
									search: (prev) => ({
										...prev,
										page: prev.page - 1,
									}),
								})
							}
							disabled={meta.page <= 1}
							className="h-8"
						>
							<ChevronLeft className="mr-1 size-3.5" />
							Prev
						</Button>

						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() =>
								navigate({
									search: (prev) => ({
										...prev,
										page: prev.page + 1,
									}),
								})
							}
							disabled={meta.page >= meta.totalPages}
							className="h-8"
						>
							Next
							<ChevronRight className="ml-1 size-3.5" />
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
}

export function EnquiriesTableSkeleton() {
	return (
		<Card className="overflow-hidden border-navy/10 py-0 shadow-xs">
			<Table>
				<TableHeader className="bg-muted/40">
					<TableRow>
						{["", "Type", "Name", "Contact", "Summary", "Received", ""].map(
							(header, idx) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton
								<TableHead key={idx} className="py-3">
									<Skeleton className="h-4 w-16 bg-navy/10" />
								</TableHead>
							),
						)}
					</TableRow>
				</TableHeader>

				<TableBody>
					{Array.from({ length: 10 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: Static skeleton
						<TableRow key={i}>
							<TableCell className="w-12 px-3 py-3.5">
								<Skeleton className="size-4 rounded bg-navy/10" />
							</TableCell>

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

							<TableCell className="w-12 px-3 py-3.5 text-right">
								<Skeleton className="size-8 rounded-md bg-navy/5" />
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
