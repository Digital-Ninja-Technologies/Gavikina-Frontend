import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import {
	ArrowRight,
	ChevronLeft,
	ChevronRight,
	RotateCcw,
	Search,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import ProjectCard from "#/modules/projects/components/project-card";
import {
	featuredCaseStudyQueryOptions,
	projectsQueryOptions,
} from "#/modules/projects/query-options";
import { openProject } from "#/store/modal";
import { AsyncBoundary } from "../components/async-boundary";

const projectsSearchSchema = z.object({
	category: z.enum(["home", "business"]).optional(),
	search: z.string().optional(),
	page: z.number().catch(1).optional(),
});

type Filter = "all" | "home" | "business";

const ITEMS_PER_PAGE = 9;

export const Route = createFileRoute("/projects")({
	validateSearch: projectsSearchSchema,

	loaderDeps: ({ search }) => ({
		category: search.category,
		search: search.search,
		page: search.page || 1,
	}),

	loader: async ({ context, deps }) => {
		await Promise.all([
			context.queryClient.query(
				projectsQueryOptions({
					category: deps.category,
					search: deps.search,
					page: deps.page,
					limit: ITEMS_PER_PAGE,
				}),
			),
			context.queryClient.query(featuredCaseStudyQueryOptions()),
		]);
	},

	component: ProjectsPage,
});

const FILTERS: [Filter, string][] = [
	["all", "All projects"],
	["home", "Homes"],
	["business", "Businesses"],
];

function ProjectsPage() {
	const { category, search, page: searchPage } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const filter: Filter = category || "all";
	const page = searchPage || 1;

	const [searchInput, setSearchInput] = useState(search || "");

	useEffect(() => {
		setSearchInput(search || "");
	}, [search]);

	useEffect(() => {
		const normalizedSearch = searchInput.trim();
		const currentSearch = search?.trim() || "";

		if (normalizedSearch === currentSearch) return;

		const timeout = window.setTimeout(() => {
			navigate({
				search: (prev) => ({
					...prev,
					search: normalizedSearch || undefined,
					page: 1,
				}),
				resetScroll: false,
			});
		}, 300);

		return () => window.clearTimeout(timeout);
	}, [navigate, search, searchInput]);

	const setFilter = (id: Filter) => {
		navigate({
			search: (prev) => ({
				...prev,
				category: id === "all" ? undefined : id,
				page: 1,
			}),
			resetScroll: false,
		});
	};

	const resetAllFilters = () => {
		setSearchInput("");
		navigate({
			search: () => ({ page: 1 }),
			resetScroll: false,
		});
	};

	return (
		<div className="section-wrapper py-10 sm:py-14">
			{/* Page Header */}
			<div className="flex flex-col gap-2">
				<span className="text-xs font-semibold tracking-widest text-green uppercase">
					Past installations
				</span>
				<h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-navy sm:text-4xl lg:text-5xl">
					Systems we have commissioned.
				</h1>
				<p className="mt-1 max-w-xl text-sm leading-relaxed text-navy/70 sm:text-base">
					Every installation below was sized, installed and tested by our own
					team. System sizes and battery autonomies are verified as-built.
				</p>
			</div>

			{/* Featured Case Study Hero */}
			<AsyncBoundary
				errorTitle="Failed to load featured project"
				fallback={<FeaturedProjectSkeleton />}
			>
				<FeaturedCaseStudy />
			</AsyncBoundary>

			{/* Search and Filters Toolbar */}
			<div className="mt-14 flex flex-col gap-4 border-b border-navy/10 pb-6">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="relative w-full sm:max-w-xs">
						<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy/40" />
						<Input
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							placeholder="Search by location, size, client..."
							className="h-9.5 rounded-xl border-navy/15 bg-white pl-9 pr-8 text-xs sm:text-sm focus-visible:ring-1 focus-visible:ring-navy/30"
						/>
						{searchInput && (
							<button
								type="button"
								onClick={() => setSearchInput("")}
								aria-label="Clear search input"
								className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-navy/40 hover:text-navy"
							>
								<X className="size-3.5" />
							</button>
						)}
					</div>

					<div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
						{FILTERS.map(([id, label]) => {
							const isActive = filter === id;
							return (
								<button
									key={id}
									type="button"
									onClick={() => setFilter(id)}
									className={cn(
										"h-9 shrink-0 rounded-xl px-3.5 text-xs font-medium transition-all cursor-pointer",
										isActive
											? "bg-navy text-white shadow-xs"
											: "border border-navy/10 bg-white text-navy/70 hover:border-navy/20 hover:text-navy",
									)}
								>
									{label}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Project Grid */}
			<div className="mt-8">
				<AsyncBoundary
					errorTitle="Failed to load projects"
					fallback={<ProjectsGridSkeleton />}
				>
					<ProjectsGrid
						category={category}
						search={search}
						page={page}
						onResetFilters={resetAllFilters}
					/>
				</AsyncBoundary>
			</div>
		</div>
	);
}

function FeaturedCaseStudy() {
	const { data: project } = useSuspenseQuery(featuredCaseStudyQueryOptions());

	if (!project) {
		return null;
	}

	const photo =
		project.photos && project.photos.length > 0 ? project.photos[0] : undefined;

	return (
		<section className="mt-8 overflow-hidden rounded-3xl border border-navy/15 bg-ink text-white shadow-sm">
			<div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
				<div className="relative aspect-16/10 min-h-64 overflow-hidden bg-navy/40 lg:aspect-auto lg:min-h-full">
					{photo ? (
						<img
							src={photo}
							alt={`${project.title} installation`}
							className="size-full object-cover"
						/>
					) : (
						<div className="flex size-full items-center justify-center bg-navy/20 p-6 text-xs text-white/40">
							Project installation image
						</div>
					)}
					<div className="absolute top-4 left-4 flex gap-2">
						<span className="rounded-lg bg-amber px-2.5 py-1 text-[11px] font-semibold text-ink uppercase">
							Latest Case Study
						</span>
					</div>
				</div>

				<div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10">
					<div>
						<div className="flex items-center gap-2">
							<span className="text-xs font-medium text-amber">Featured</span>
							<span className="size-1 rounded-full bg-white/20" />
							<span className="text-xs text-white/60">
								{project.systemSize}
							</span>
						</div>

						<h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
							{project.title}
						</h2>

						{project.description && (
							<p className="mt-3 line-clamp-4 text-xs leading-relaxed text-white/70 sm:text-sm">
								{project.description}
							</p>
						)}

						<div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
							<div>
								<span className="text-[10px] font-semibold tracking-wider text-white/40 uppercase">
									Location
								</span>
								<p className="mt-0.5 text-xs font-medium text-white sm:text-sm">
									{project.location}
								</p>
							</div>
							<div>
								<span className="text-[10px] font-semibold tracking-wider text-white/40 uppercase">
									Application
								</span>
								<p className="mt-0.5 text-xs font-medium capitalize text-white sm:text-sm">
									{project.category} Solar
								</p>
							</div>
						</div>
					</div>

					<div className="mt-6 pt-2">
						<Button
							variant="amber"
							size="sm"
							onClick={() => openProject(project.id)}
							className="gap-1.5"
						>
							View project breakdown
							<ArrowRight className="size-3.5" />
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}

function ProjectsGrid({
	category,
	search,
	page,
	onResetFilters,
}: {
	category?: "home" | "business";
	search?: string;
	page: number;
	onResetFilters: () => void;
}) {
	const navigate = useNavigate({ from: Route.fullPath });

	const { data: response } = useSuspenseQuery(
		projectsQueryOptions({
			category,
			search,
			page,
			limit: ITEMS_PER_PAGE,
		}),
	);

	console.log(response);
	const projects = response.data;
	const meta = response.meta;
	const totalPages = Math.ceil(meta.total / meta.limit);

	const setPage = (newPage: number) => {
		navigate({
			search: (prev) => ({ ...prev, page: newPage }),
			resetScroll: true,
		});
	};

	if (projects.length === 0) {
		return (
			<div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-navy/20 bg-cream/30 p-8 text-center">
				<p className="text-sm font-semibold text-navy">No projects found</p>
				<p className="mt-1 max-w-sm text-xs text-navy/60">
					There are no commissioned projects matching your current filters.
				</p>
				<Button
					variant="outline"
					size="sm"
					onClick={onResetFilters}
					className="mt-4 gap-1.5 text-xs"
				>
					<RotateCcw className="size-3.5" /> Clear all filters
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-10">
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{projects.map((project) => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>

			{/* Always Visible Summary & Pagination Footer */}
			<div className="flex flex-col items-center justify-between gap-4 border-t border-navy/10 pt-6 sm:flex-row">
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

				{totalPages > 1 ? (
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage(page - 1)}
							disabled={page <= 1}
							className="h-8 gap-1 px-2.5 text-xs"
						>
							<ChevronLeft className="size-3.5" /> Previous
						</Button>
						<span className="text-xs text-navy/50 px-2">
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
				) : (
					<span className="text-[11px] font-medium text-navy/40">
						All results loaded
					</span>
				)}
			</div>
		</div>
	);
}

function FeaturedProjectSkeleton() {
	return (
		<div className="mt-8 overflow-hidden rounded-3xl border border-navy/10 bg-ink">
			<div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">
				<Skeleton className="aspect-16/10 w-full rounded-none bg-white/5 lg:aspect-auto lg:min-h-72" />
				<div className="flex flex-col justify-between p-6 sm:p-8">
					<div className="space-y-3">
						<Skeleton className="h-4 w-20 bg-white/10" />
						<Skeleton className="h-7 w-3/4 bg-white/10" />
						<Skeleton className="h-4 w-full bg-white/5" />
						<Skeleton className="h-4 w-5/6 bg-white/5" />
					</div>
					<Skeleton className="mt-6 h-8 w-36 bg-white/10" />
				</div>
			</div>
		</div>
	);
}

function ProjectsGridSkeleton() {
	return (
		<div className="flex flex-col gap-10">
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: Static layout
						key={index}
						className="flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white"
					>
						<Skeleton className="aspect-4/3 w-full rounded-none bg-navy/5" />
						<div className="flex flex-1 flex-col gap-3 p-5">
							<Skeleton className="h-5 w-24 rounded-lg bg-navy/5" />
							<Skeleton className="h-5 w-3/4 bg-navy/5" />
							<Skeleton className="h-3 w-1/2 bg-navy/5" />
							<Skeleton className="mt-2 h-10 w-full bg-navy/5" />
						</div>
					</div>
				))}
			</div>
			<div className="flex items-center justify-between border-t border-navy/10 pt-6">
				<Skeleton className="h-4 w-36 bg-navy/5" />
				<Skeleton className="h-8 w-24 bg-navy/5" />
			</div>
		</div>
	);
}
