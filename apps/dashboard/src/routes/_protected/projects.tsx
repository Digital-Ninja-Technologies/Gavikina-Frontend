/** biome-ignore-all lint/suspicious/noArrayIndexKey: <static> */
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "@workspace/ui/components/toast";
import { cn } from "@workspace/ui/lib/utils";
import {
	ChevronLeft,
	ChevronRight,
	EyeOff,
	Image as ImageIcon,
	LayoutGrid,
	List,
	MapPin,
	MoreVertical,
	Pencil,
	Plus,
	RotateCcw,
	Search,
	Sparkles,
	Trash2,
	X,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { AsyncBoundary } from "#/components/async-boundary";
import { useConfirm } from "#/components/confirm-provider";
import { deleteProjectApi } from "@/modules/projects/api";
import {
	type ProjectWithPhotos,
	projectsKeys,
	projectsListQueryOptions,
} from "@/modules/projects/query-options";
import { openDialog } from "@/store/dialog-store";

const projectsSearchSchema = z.object({
	layout: z.enum(["list", "grid"]).default("grid").catch("grid"),
	page: z.number().default(1).catch(1),
	limit: z.number().default(12).catch(12),
	category: z.enum(["home", "business"]).optional(),
	search: z.string().optional(),
});

export type ProjectsSearch = z.infer<typeof projectsSearchSchema>;

type FilterCategory = "all" | "home" | "business";

const CATEGORY_FILTERS: [FilterCategory, string][] = [
	["all", "All categories"],
	["home", "Homes"],
	["business", "Businesses"],
];

export const Route = createFileRoute("/_protected/projects")({
	staticData: {
		title: "Past Projects",
	},
	validateSearch: projectsSearchSchema,
	beforeLoad: ({ context, search }) => {
		void context.queryClient.query(
			projectsListQueryOptions({
				page: search.page,
				limit: search.limit,
				category: search.category,
				search: search.search,
			}),
		);
	},
	component: ProjectsRoute,
});

function ProjectsRoute() {
	const searchParams = Route.useSearch();
	const navigate = useNavigate({ from: "/projects" });
	const { layout, category, search, page } = searchParams;

	const [searchInput, setSearchInput] = useState(search || "");

	useEffect(() => {
		setSearchInput(search || "");
	}, [search]);

	useEffect(() => {
		const normalized = searchInput.trim();
		const current = search?.trim() || "";

		if (normalized === current) return;

		const timeout = window.setTimeout(() => {
			navigate({
				search: (prev) => ({
					...prev,
					search: normalized || undefined,
					page: 1,
				}),
				replace: true,
			});
		}, 300);

		return () => window.clearTimeout(timeout);
	}, [navigate, search, searchInput]);

	const setLayout = (nextLayout: "list" | "grid") => {
		navigate({
			search: (prev) => ({ ...prev, layout: nextLayout }),
			replace: true,
		});
	};

	const setCategory = (cat: FilterCategory) => {
		navigate({
			search: (prev) => ({
				...prev,
				category: cat === "all" ? undefined : cat,
				page: 1,
			}),
			replace: true,
		});
	};

	const resetFilters = () => {
		setSearchInput("");
		navigate({
			search: (prev) => ({
				layout: prev.layout,
				page: 1,
				limit: prev.limit,
			}),
			replace: true,
		});
	};

	return (
		<div className="flex flex-col gap-6 animate-gv-fade">
			{/* Page Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="page-title">Past Projects</h1>
					<p className="page-description mt-1">
						Manage commissioned installations and case studies displayed on the
						public site.
					</p>
				</div>

				<Button
					onClick={() => openDialog("PROJECT_FORM")}
					className="gap-1.5 self-start sm:self-auto"
				>
					<Plus className="size-4" /> Add Project
				</Button>
			</div>

			{/* Filters and Layout Controls */}
			<div className="flex flex-col gap-3 rounded-2xl border border-navy/10 bg-white p-3.5 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
					{/* Search Input */}
					<div className="relative w-full sm:max-w-xs">
						<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy/40" />
						<Input
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							placeholder="Search by title, location..."
							className="h-9 rounded-xl border-navy/15 bg-white pl-9 pr-8 text-xs focus-visible:ring-1 focus-visible:ring-navy/30"
						/>
						{searchInput && (
							<button
								type="button"
								onClick={() => setSearchInput("")}
								aria-label="Clear search"
								className="absolute right-2.5 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy"
							>
								<X className="size-3.5" />
							</button>
						)}
					</div>

					{/* Category Tabs */}
					<div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
						{CATEGORY_FILTERS.map(([id, label]) => {
							const active = (category || "all") === id;
							return (
								<button
									key={id}
									type="button"
									onClick={() => setCategory(id)}
									className={cn(
										"h-8 shrink-0 rounded-lg px-3 text-xs font-medium transition-colors cursor-pointer",
										active
											? "bg-navy text-white shadow-2xs"
											: "border border-navy/10 bg-white text-navy/70 hover:border-navy/20 hover:text-navy",
									)}
								>
									{label}
								</button>
							);
						})}
					</div>
				</div>

				{/* Layout Toggles */}
				<div className="flex items-center justify-between border-t border-navy/5 pt-2 sm:border-t-0 sm:pt-0">
					{(search || category) && (
						<button
							type="button"
							onClick={resetFilters}
							className="inline-flex items-center gap-1 text-xs font-medium text-navy/60 hover:text-navy sm:hidden"
						>
							<RotateCcw className="size-3" /> Reset
						</button>
					)}

					<div className="flex items-center rounded-lg border border-navy/10 bg-muted/40 p-0.5 ml-auto">
						<button
							type="button"
							aria-label="Grid layout"
							onClick={() => setLayout("grid")}
							className={cn(
								"flex size-7.5 items-center justify-center rounded-md text-xs transition-colors cursor-pointer",
								layout === "grid"
									? "bg-white text-navy shadow-2xs font-semibold"
									: "text-navy/50 hover:text-navy",
							)}
						>
							<LayoutGrid className="size-3.5" />
						</button>
						<button
							type="button"
							aria-label="List layout"
							onClick={() => setLayout("list")}
							className={cn(
								"flex size-7.5 items-center justify-center rounded-md text-xs transition-colors cursor-pointer",
								layout === "list"
									? "bg-white text-navy shadow-2xs font-semibold"
									: "text-navy/50 hover:text-navy",
							)}
						>
							<List className="size-3.5" />
						</button>
					</div>
				</div>
			</div>

			{/* Project List / Grid */}
			<AsyncBoundary
				errorTitle="Failed to load projects"
				fallback={<ProjectsSkeleton layout={layout} />}
			>
				<ProjectsContent
					searchParams={searchParams}
					onResetFilters={resetFilters}
				/>
			</AsyncBoundary>
		</div>
	);
}

function ProjectsContent({
	searchParams,
	onResetFilters,
}: {
	searchParams: ProjectsSearch;
	onResetFilters: () => void;
}) {
	const navigate = useNavigate({ from: "/projects" });

	const { data: response } = useSuspenseQuery(
		projectsListQueryOptions({
			page: searchParams.page,
			limit: searchParams.limit,
			category: searchParams.category,
			search: searchParams.search,
		}),
	);

	const projects = response.data;
	const meta = response.meta || {
		total: projects.length,
		page: searchParams.page,
		limit: searchParams.limit,
	};
	const totalPages = Math.ceil(meta.total / meta.limit);
	const { layout, page } = searchParams;

	const isFiltered = Boolean(searchParams.category || searchParams.search);

	const setPage = (newPage: number) => {
		navigate({
			search: (prev) => ({ ...prev, page: newPage }),
			replace: true,
		});
	};

	if (projects.length === 0) {
		return (
			<EmptyProjectsState isFiltered={isFiltered} onReset={onResetFilters} />
		);
	}

	return (
		<div className="flex flex-col gap-6 min-w-0 w-full">
			{layout === "grid" ? (
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{projects.map((p) => (
						<ProjectGridCard key={p.id} project={p} />
					))}
				</div>
			) : (
				<div className="flex flex-col gap-2.5 min-w-0 w-full">
					{projects.map((p) => (
						<ProjectListRow key={p.id} project={p} />
					))}
				</div>
			)}

			{/* Pagination Footer */}
			<div className="flex flex-col items-center justify-between gap-3 border-t border-navy/10 pt-4 sm:flex-row">
				<p className="text-xs text-navy/60">
					Showing{" "}
					<span className="font-semibold text-navy">
						{(page - 1) * meta.limit + 1}
					</span>{" "}
					to{" "}
					<span className="font-semibold text-navy">
						{Math.min(page * meta.limit, meta.total)}
					</span>{" "}
					of <span className="font-semibold text-navy">{meta.total}</span>{" "}
					projects
				</p>

				{totalPages > 1 && (
					<div className="flex items-center gap-1.5">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage(page - 1)}
							disabled={page <= 1}
							className="h-8 gap-1 px-2.5 text-xs"
						>
							<ChevronLeft className="size-3.5" /> Previous
						</Button>
						<span className="px-2 text-xs text-navy/50">
							{page} / {totalPages}
						</span>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage(page + 1)}
							disabled={page >= totalPages}
							className="h-8 gap-1 px-2.5 text-xs"
						>
							Next <ChevronRight className="size-3.5" />
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

function useDeleteProject() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteProjectApi(id),
		onSuccess: () => {
			toast.add({
				title: "Project Deleted",
				description: "The project has been permanently removed.",
				type: "success",
			});
			queryClient.invalidateQueries({ queryKey: projectsKeys.all });
		},
		onError: (error) => {
			toast.add({
				title: "Failed to Delete Project",
				description:
					error instanceof Error
						? error.message
						: "There was a problem deleting the project.",
				type: "error",
			});
		},
	});
}

function ProjectGridCard({ project }: { project: ProjectWithPhotos }) {
	const confirm = useConfirm();
	const deleteMutation = useDeleteProject();

	const coverPhoto = project.photos?.[0] || null;
	const photoCount = project.photos?.length || 0;

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		openDialog("PROJECT_FORM", { projectId: project.id });
	};

	const handleDelete = async (e: React.MouseEvent) => {
		e.stopPropagation();

		const isConfirmed = await confirm({
			title: `Delete "${project.title}"?`,
			description:
				"This action cannot be undone. The project will be permanently removed.",
			confirmText: "Delete Project",
			variant: "destructive",
		});

		if (isConfirmed) {
			deleteMutation.mutate(project.id);
		}
	};

	return (
		<Card
			className="group flex flex-col overflow-hidden border-navy/10 bg-white p-0 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-navy/25 hover:shadow-md cursor-pointer"
			onClick={() => openDialog("PROJECT_FORM", { projectId: project.id })}
		>
			{/* Top Image Banner */}
			<div className="relative aspect-16/10 w-full overflow-hidden bg-cream">
				{coverPhoto ? (
					<img
						src={coverPhoto}
						alt={project.title}
						className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
					/>
				) : (
					<div className="flex size-full flex-col items-center justify-center gap-1.5 bg-cream/70 text-navy/35">
						<ImageIcon className="size-8" />
						<span className="text-[11px] font-medium">No photo uploaded</span>
					</div>
				)}

				{/* Floating Badges */}
				<div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
					<Badge
						variant="secondary"
						className="border border-navy/10 bg-white/90 text-navy/80 font-medium text-[10px] backdrop-blur-xs capitalize shadow-2xs"
					>
						{project.category}
					</Badge>
					{project.isCaseStudy && (
						<Badge className="border border-amber-500/15 bg-amber-50/95 text-amber-900 font-medium text-[10px] gap-1 shadow-2xs">
							Case Study
						</Badge>
					)}
				</div>

				<div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
					{project.isActive === false && (
						<span className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-xs">
							<EyeOff className="size-2.5" /> Hidden
						</span>
					)}

					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="ghost"
									size="icon"
									className="size-6.5 rounded-md bg-black/40 text-white hover:bg-black/60 hover:text-white backdrop-blur-xs"
									onClick={(e) => e.stopPropagation()}
								/>
							}
						>
							<MoreVertical className="size-3.5" />
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-36">
							<DropdownMenuItem
								onClick={handleEdit}
								className="cursor-pointer text-xs"
							>
								<Pencil className="mr-2 size-3.5" />
								Edit Details
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={handleDelete}
								className="cursor-pointer text-xs text-destructive focus:text-destructive"
							>
								<Trash2 className="mr-2 size-3.5" />
								Delete Project
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Card Body */}
			<CardContent className="flex flex-1 flex-col gap-2 justify-between p-4.5 pt-0">
				<div>
					<div className="flex items-start justify-between gap-2">
						<h3 className="line-clamp-1 text-sm font-semibold tracking-tight text-navy group-hover:text-green transition-colors">
							{project.title}
						</h3>
						<span className="shrink-0 text-xs font-semibold text-green">
							{project.systemSize}
						</span>
					</div>

					<div className="mt-1.5 flex items-center gap-1 text-xs text-navy/60">
						<MapPin className="size-3 shrink-0 text-navy/40" />
						<span className="truncate">{project.location}</span>
					</div>

					<p className="mt-2 line-clamp-2 text-xs leading-relaxed text-navy/70">
						{project.description || "No project description provided."}
					</p>
				</div>

				<div className="mt-3.5 flex items-center justify-between border-t border-navy/5 pt-2.5 text-xs text-navy/50">
					<span className="flex items-center gap-1 text-[11px]">
						<ImageIcon className="size-3 text-navy/40" />
						{photoCount} {photoCount === 1 ? "photo" : "photos"}
					</span>
					<span className="text-[11px] font-medium text-navy/40">
						Click to edit
					</span>
				</div>
			</CardContent>
		</Card>
	);
}

function ProjectListRow({ project }: { project: ProjectWithPhotos }) {
	const confirm = useConfirm();
	const deleteMutation = useDeleteProject();

	const coverPhoto = project.photos?.[0] || null;
	const photoCount = project.photos?.length || 0;

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		openDialog("PROJECT_FORM", { projectId: project.id });
	};

	const handleDelete = async (e: React.MouseEvent) => {
		e.stopPropagation();

		const isConfirmed = await confirm({
			title: `Delete "${project.title}"?`,
			description:
				"This action cannot be undone. The project will be permanently removed.",
			confirmText: "Delete Project",
			variant: "destructive",
		});

		if (isConfirmed) {
			deleteMutation.mutate(project.id);
		}
	};

	return (
		<Card
			className="group relative flex w-full min-w-0 cursor-pointer overflow-hidden border-navy/10 bg-white p-3 shadow-2xs transition-all hover:border-navy/25 hover:bg-cream/20"
			onClick={() => openDialog("PROJECT_FORM", { projectId: project.id })}
		>
			<CardContent className="flex w-full min-w-0 flex-col gap-3 p-0 sm:flex-row sm:items-center sm:justify-between">
				{/* Left side info */}
				<div className="flex min-w-0 flex-1 items-center gap-3.5 overflow-hidden">
					<div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-navy/10 bg-navy/5">
						{coverPhoto ? (
							<img
								src={coverPhoto}
								alt={project.title}
								className="size-full object-cover"
							/>
						) : (
							<div className="flex size-full items-center justify-center bg-cream/70 text-navy/35">
								<Zap className="size-4.5" />
							</div>
						)}
					</div>

					<div className="flex min-w-0 flex-1 flex-col gap-1 overflow-hidden">
						<div className="flex items-center gap-2 min-w-0">
							<span className="truncate text-sm font-semibold tracking-tight text-navy group-hover:text-green transition-colors">
								{project.title}
							</span>
							{project.isCaseStudy && (
								<span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
									<Sparkles className="size-2.5 fill-current" /> Case Study
								</span>
							)}
							{project.isActive === false && (
								<span className="inline-flex shrink-0 items-center rounded-md border border-navy/15 bg-navy/5 px-1.5 py-0.5 text-[10px] font-medium text-navy/50">
									Hidden
								</span>
							)}
						</div>
						<p className="truncate text-xs text-navy/60">
							<span className="font-medium text-navy/70">
								{project.location}
							</span>
							{project.description && (
								<>
									<span className="mx-1.5 text-navy/30">·</span>
									<span>{project.description}</span>
								</>
							)}
						</p>
					</div>
				</div>

				{/* Right side controls */}
				<div className="flex shrink-0 items-center justify-between gap-4 border-t border-navy/5 pt-2 sm:border-t-0 sm:pt-0">
					<div className="flex items-center gap-2">
						<span className="rounded-md border border-navy/10 bg-navy/5 px-2 py-0.5 text-[11px] font-medium text-navy/70 capitalize">
							{project.category}
						</span>
						<span className="text-xs font-semibold text-green">
							{project.systemSize}
						</span>
					</div>

					<div className="flex items-center gap-2.5">
						<span className="flex items-center gap-1 text-xs text-navy/40 min-w-8 justify-end">
							<ImageIcon className="size-3.5 text-navy/35" />
							{photoCount}
						</span>

						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<Button
										variant="ghost"
										size="icon"
										className="size-7 text-navy/40 hover:text-navy"
										onClick={(e) => e.stopPropagation()}
									/>
								}
							>
								<MoreVertical className="size-4" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-36">
								<DropdownMenuItem
									onClick={handleEdit}
									className="cursor-pointer text-xs"
								>
									<Pencil className="mr-2 size-3.5" />
									Edit Details
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={handleDelete}
									className="cursor-pointer text-xs text-destructive focus:text-destructive"
								>
									<Trash2 className="mr-2 size-3.5" />
									Delete Project
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function EmptyProjectsState({
	isFiltered,
	onReset,
}: {
	isFiltered: boolean;
	onReset: () => void;
}) {
	return (
		<div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-navy/15 bg-white p-8 text-center shadow-2xs">
			<div className="flex size-11 items-center justify-center rounded-xl bg-navy/5 text-navy/50 mb-3">
				{isFiltered ? (
					<Search className="size-5" />
				) : (
					<Zap className="size-5" />
				)}
			</div>
			<h3 className="text-sm font-semibold text-navy">
				{isFiltered ? "No matching projects" : "No projects published"}
			</h3>
			<p className="mt-1 text-xs text-navy/60 max-w-sm">
				{isFiltered
					? "No projects match your current search or category filter. Try clearing filters."
					: "Add your first commissioned solar installation to display it on the public site."}
			</p>
			{isFiltered ? (
				<Button
					variant="outline"
					size="sm"
					className="mt-4 gap-1.5 text-xs"
					onClick={onReset}
				>
					<RotateCcw className="size-3" /> Clear filters
				</Button>
			) : (
				<Button
					size="sm"
					className="mt-4"
					onClick={() => openDialog("PROJECT_FORM")}
				>
					Add First Project
				</Button>
			)}
		</div>
	);
}

function ProjectsSkeleton({ layout }: { layout: "grid" | "list" }) {
	if (layout === "grid") {
		return (
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<Card
						key={i}
						className="border-navy/10 p-0 shadow-2xs overflow-hidden"
					>
						<Skeleton className="aspect-16/10 w-full rounded-none bg-navy/5" />
						<div className="space-y-2 p-4">
							<Skeleton className="h-4.5 w-3/4 bg-navy/10" />
							<Skeleton className="h-3 w-1/2 bg-navy/5" />
							<Skeleton className="h-3 w-full bg-navy/5" />
						</div>
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2.5 min-w-0 w-full">
			{Array.from({ length: 5 }).map((_, i) => (
				<Card key={i} className="border-navy/10 p-3 shadow-2xs">
					<div className="flex items-center gap-3.5">
						<Skeleton className="size-12 rounded-xl bg-navy/5 shrink-0" />
						<div className="flex flex-1 flex-col gap-1.5 min-w-0">
							<Skeleton className="h-4 w-44 bg-navy/10" />
							<Skeleton className="h-3 w-64 bg-navy/5" />
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}
