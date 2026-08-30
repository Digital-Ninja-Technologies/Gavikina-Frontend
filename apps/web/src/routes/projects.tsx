import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { z } from "zod";
import { projectsQueryOptions } from "#/modules/projects/query-options";
import { AsyncBoundary } from "../components/async-boundary";
import ImageSlot from "../components/ImageSlot";
import { CASE_STUDY_PHOTO, PROJECT_PHOTOS } from "../lib/content";

const projectsSearchSchema = z.object({
	category: z.enum(["home", "business"]).optional(),
	page: z.number().catch(1).optional(),
});

type Filter = "all" | "home" | "business";

const ITEMS_PER_PAGE = 9;

export const Route = createFileRoute("/projects")({
	validateSearch: projectsSearchSchema,
	loaderDeps: ({ search }) => ({
		category: search.category,
		page: search.page || 1,
	}),
	loader: async ({ context, deps }) => {
		await context.queryClient.query(
			projectsQueryOptions({
				category: deps.category,
				page: deps.page,
				limit: ITEMS_PER_PAGE,
			}),
		);
	},
	component: ProjectsPage,
});

const FILTERS: [Filter, string][] = [
	["all", "All projects"],
	["home", "Homes"],
	["business", "Businesses"],
];

const CASE_STATS = [
	{ value: "10kVA", label: "System installed" },
	{ value: "24h", label: "Autonomy on critical circuit" },
	{ value: "0", label: "Cold chain losses since commissioning" },
];

function ProjectsPage() {
	const { category, page: searchPage } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });

	const filter: Filter = category || "all";
	const page = searchPage || 1;

	const setFilter = (id: Filter) => {
		navigate({
			search: {
				category: id === "all" ? undefined : id,
				page: 1,
			},
			resetScroll: false,
		});
	};

	return (
		<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
			<span className="text-xs font-semibold uppercase tracking-widest text-green">
				Past projects
			</span>
			<h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-navy sm:text-4xl lg:text-5xl leading-[1.2]">
				Systems we have commissioned.
			</h1>
			<p className="mt-3 max-w-xl text-base leading-loose text-navy/70 sm:text-lg">
				Every installation below was sized, installed and commissioned by our
				own engineers. Sizes shown are as-built.
			</p>

			{/* Filter Tabs */}
			<div className="my-8 flex flex-wrap gap-2">
				{FILTERS.map(([id, label]) => (
					<Button
						key={id}
						type="button"
						size={"lg"}
						variant={"outline"}
						className={cn(
							"rounded-full border px-4 py-2 text-xs transition-colors sm:text-sm",
							filter === id
								? "border-green bg-green/10 text-green"
								: "border-navy/15 bg-white text-navy/70 hover:bg-cream/16 hover:text-navy",
						)}
						onClick={() => setFilter(id)}
					>
						{label}
					</Button>
				))}
			</div>

			<AsyncBoundary
				errorTitle="Failed to load projects"
				fallback={<ProjectsGridSkeleton />}
			>
				<ProjectsGrid category={category} page={page} />
			</AsyncBoundary>

			{/* Featured Case Study */}
			<div className="mt-24 grid grid-cols-1 overflow-hidden rounded-3xl bg-ink text-white lg:grid-cols-[0.9fr_1.1fr]">
				<div className="relative min-h-72 w-full bg-slate-900 lg:min-h-full">
					<ImageSlot
						src={CASE_STUDY_PHOTO.src}
						placeholder="Case study photo — Ikeja clinic"
						credit={CASE_STUDY_PHOTO.credit}
						creditHref={CASE_STUDY_PHOTO.creditHref}
					/>
				</div>
				<div className="p-6 sm:p-8 lg:p-12">
					<span className="text-xs font-semibold uppercase tracking-wider text-amber">
						Case study
					</span>
					<h2 className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
						A 20-bed clinic that has not lost a cold chain since March.
					</h2>
					<p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
						The clinic was running two generators in shifts and still losing
						vaccine stock during changeovers. We measured a 6.2kW peak load
						across the ward, theatre lights and the vaccine fridges, and
						installed a 10kVA hybrid system with 24 hours of autonomy on the
						critical circuit.
					</p>

					<div className="mt-8 grid grid-cols-1 gap-6 border-t border-white/10 pt-6 sm:grid-cols-3">
						{CASE_STATS.map((s) => (
							<div key={s.label}>
								<div className="text-2xl font-semibold tracking-tight text-amber sm:text-3xl">
									{s.value}
								</div>
								<div className="mt-1 text-xs leading-snug text-white/60">
									{s.label}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function ProjectsGrid({
	category,
	page,
}: {
	category?: "home" | "business";
	page: number;
}) {
	const navigate = useNavigate({ from: Route.fullPath });
	const { data: response } = useSuspenseQuery(
		projectsQueryOptions({ category, page, limit: ITEMS_PER_PAGE }),
	);

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
			<div className="flex min-h-60 items-center justify-center rounded-2xl border border-dashed border-navy/20 bg-cream/40 text-sm text-navy/60">
				No projects found for this category yet.
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-10">
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{projects.map((p) => {
					const photo = PROJECT_PHOTOS[p.id] || PROJECT_PHOTOS.p1;

					return (
						<div
							key={p.id}
							className="flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-xs"
						>
							<div className="relative aspect-4/3 w-full overflow-hidden bg-cream">
								{p.photos && p.photos.length > 0 ? (
									<img
										src={p.photos[0]}
										alt={`${p.title} — install`}
										className="h-full w-full object-cover"
									/>
								) : (
									<ImageSlot
										src={photo.src}
										placeholder={`${p.title} — install photo`}
										credit={photo.credit}
										creditHref={photo.creditHref}
									/>
								)}
							</div>
							<div className="flex flex-1 flex-col p-4 sm:p-6">
								<div className="mb-3 flex items-center gap-2">
									<Badge variant={p.category === "home" ? "home" : "business"}>
										{p.category === "home" ? "Home" : "Business"}
									</Badge>
									{p.isCaseStudy && <Badge variant="case">Case study</Badge>}
								</div>
								<h3 className="text-base font-semibold tracking-tight text-navy sm:text-lg">
									{p.title}
								</h3>
								<p className="mt-1 text-xs text-navy/60 sm:text-sm">
									{p.location} · {p.systemSize}
								</p>
								<p className="mt-3 text-xs leading-relaxed text-navy/70 sm:text-sm">
									{p.description}
								</p>
							</div>
						</div>
					);
				})}
			</div>

			{/* pagination controls */}
			{totalPages > 1 && (
				<div className="flex flex-col items-center justify-between gap-4 border-t border-navy/10 pt-6 sm:flex-row">
					<p className="text-sm text-navy/60">
						Showing{" "}
						<span className="font-medium text-navy">
							{(page - 1) * meta.limit + 1}
						</span>{" "}
						to{" "}
						<span className="font-medium text-navy">
							{Math.min(page * meta.limit, meta.total)}
						</span>{" "}
						of <span className="font-medium text-navy">{meta.total}</span>{" "}
						results
					</p>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage(page - 1)}
							disabled={page <= 1}
							className="gap-1"
						>
							<ChevronLeft className="size-4" />
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage(page + 1)}
							disabled={page >= totalPages}
							className="gap-1"
						>
							Next
							<ChevronRight className="size-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

function ProjectsGridSkeleton() {
	return (
		<div className="flex flex-col gap-10">
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{[...Array(ITEMS_PER_PAGE)].map((_, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static
						key={i}
						className="flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-xs"
					>
						<Skeleton className="aspect-4/3 w-full rounded-none" />
						<div className="flex flex-1 flex-col p-4 sm:p-6">
							<Skeleton className="mb-4 h-5 w-16 rounded-full" />
							<Skeleton className="h-6 w-3/4" />
							<Skeleton className="mt-2 h-4 w-1/2" />
							<div className="mt-4 flex flex-col gap-2">
								<Skeleton className="h-3 w-full" />
								<Skeleton className="h-3 w-full" />
								<Skeleton className="h-3 w-2/3" />
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="flex items-center justify-between border-t border-navy/10 pt-6">
				<Skeleton className="h-4 w-48" />
				<div className="flex gap-2">
					<Skeleton className="h-9 w-24" />
					<Skeleton className="h-9 w-24" />
				</div>
			</div>
		</div>
	);
}
