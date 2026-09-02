/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { Project } from "@workspace/engine";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "@workspace/ui/components/toast";
import { cn } from "@workspace/ui/lib/utils";
import {
	Image as ImageIcon,
	LayoutGrid,
	List,
	MapPin,
	MoreVertical,
	Pencil,
	Plus,
	Sparkles,
	Trash2,
	Zap,
} from "lucide-react";
import { z } from "zod";
import { AsyncBoundary } from "#/components/async-boundary";
import { useConfirm } from "#/components/confirm-provider";
import { deleteProjectApi } from "@/modules/projects/api";
import {
	projectsKeys,
	projectsListQueryOptions,
} from "@/modules/projects/query-options";
import { openDialog } from "@/store/dialog-store";

const projectsSearchSchema = z.object({
	layout: z.enum(["list", "grid"]).default("grid").catch("grid"),
	page: z.number().default(1).catch(1),
	limit: z.number().default(20).catch(20),
	category: z.string().optional(),
	search: z.string().optional(),
});

export type ProjectsSearch = z.infer<typeof projectsSearchSchema>;

export const Route = createFileRoute("/_protected/projects")({
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
	const { layout } = searchParams;

	const setLayout = (nextLayout: "list" | "grid") => {
		navigate({
			search: (prev) => ({ ...prev, layout: nextLayout }),
			replace: true,
		});
	};

	return (
		<div className="flex flex-col gap-6 animate-gv-fade">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="page-title">Past Projects</h1>
					<p className="page-description mt-1">
						Manage installations and case studies displayed on the public site.
					</p>
				</div>

				<div className="flex items-center gap-3">
					<div className="flex items-center rounded-lg border border-navy/10 bg-muted/40 p-0.5">
						<button
							type="button"
							aria-label="Grid layout"
							onClick={() => setLayout("grid")}
							className={cn(
								"flex size-8 items-center justify-center rounded-md text-xs transition-colors",
								layout === "grid"
									? "bg-white text-navy shadow-xs font-semibold"
									: "text-navy/50 hover:text-navy",
							)}
						>
							<LayoutGrid className="size-4" />
						</button>
						<button
							type="button"
							aria-label="List layout"
							onClick={() => setLayout("list")}
							className={cn(
								"flex size-8 items-center justify-center rounded-md text-xs transition-colors",
								layout === "list"
									? "bg-white text-navy shadow-xs font-semibold"
									: "text-navy/50 hover:text-navy",
							)}
						>
							<List className="size-4" />
						</button>
					</div>

					<Button onClick={() => openDialog("PROJECT_FORM")}>
						<Plus /> Add Project
					</Button>
				</div>
			</div>

			<AsyncBoundary
				errorTitle="Failed to load projects"
				fallback={<ProjectsSkeleton layout={layout} />}
			>
				<ProjectsContent searchParams={searchParams} />
			</AsyncBoundary>
		</div>
	);
}

function ProjectsContent({ searchParams }: { searchParams: ProjectsSearch }) {
	const { data: response } = useSuspenseQuery(
		projectsListQueryOptions({
			page: searchParams.page,
			limit: searchParams.limit,
			category: searchParams.category,
			search: searchParams.search,
		}),
	);

	const projects = response.data;
	const { layout } = searchParams;

	if (projects.length === 0) {
		return <EmptyProjectsState />;
	}

	return layout === "grid" ? (
		<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{projects.map((p) => (
				<ProjectGridCard key={p.id} project={p} />
			))}
		</div>
	) : (
		<div className="flex flex-col gap-3">
			{projects.map((p) => (
				<ProjectListRow key={p.id} project={p} />
			))}
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

function ProjectGridCard({ project }: { project: Project }) {
	const confirm = useConfirm();
	const deleteMutation = useDeleteProject();

	const coverPhoto =
		(project as unknown as { photos?: string[] }).photos?.[0] || null;

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
			className="group flex flex-col overflow-hidden border-navy/10 bg-white p-0 shadow-xs transition-all hover:border-navy/25 hover:shadow-md cursor-pointer"
			onClick={() => openDialog("PROJECT_FORM", { projectId: project.id })}
		>
			{/* Top Image Banner with Tint & Overlays */}
			<div className="relative aspect-video w-full overflow-hidden bg-navy/5">
				{coverPhoto ? (
					<img
						src={coverPhoto}
						alt={project.title}
						className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				) : (
					<div className="flex size-full flex-col items-center justify-center gap-1.5 bg-cream/70 text-navy/35">
						<ImageIcon className="size-8" />
						<span className="text-[11px] font-medium">No photo uploaded</span>
					</div>
				)}

				<div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-black/35" />

				<div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
					<div className="flex items-center gap-1.5">
						<Badge
							variant="secondary"
							className="bg-white/95 text-navy font-semibold text-[11px] backdrop-blur-xs capitalize shadow-xs"
						>
							{project.category}
						</Badge>
						{project.caseStudy && (
							<Badge className="bg-amber text-ink font-semibold text-[11px] gap-1 shadow-xs border-amber-light/40">
								<Sparkles className="size-3 fill-current" /> Case Study
							</Badge>
						)}
					</div>

					<div className="flex items-center gap-1.5">
						<span className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
							<ImageIcon className="size-3" />
							{project.images}
						</span>

						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<Button
										variant="ghost"
										size="icon"
										className="size-7 rounded-full bg-black/40 text-white hover:bg-black/60 hover:text-white backdrop-blur-xs"
										onClick={(e) => e.stopPropagation()}
									/>
								}
							>
								<MoreVertical className="size-3.5" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-40">
								<DropdownMenuItem
									onClick={handleEdit}
									className="cursor-pointer"
								>
									<Pencil className="mr-2 size-3.5" />
									Edit Project
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={handleDelete}
									className="cursor-pointer text-destructive focus:text-destructive"
								>
									<Trash2 className="mr-2 size-3.5" />
									Delete Project
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 text-white">
					<span className="flex items-center gap-1 text-xs font-medium drop-shadow-xs">
						<MapPin className="size-3.5 text-amber" />
						{project.location}
					</span>
					<span className="flex items-center gap-1 text-xs font-bold text-green-light drop-shadow-xs">
						<Zap className="size-3.5 fill-current" />
						{project.size}
					</span>
				</div>
			</div>

			{/* Card Body */}
			<CardContent className="flex flex-1 flex-col justify-between p-4 pt-0">
				<div className="space-y-1.5">
					<CardTitle className="line-clamp-1 text-base font-semibold tracking-tight text-navy group-hover:text-green transition-colors">
						{project.title}
					</CardTitle>
					<p className="line-clamp-2 text-xs leading-relaxed text-navy/70">
						{project.body || "No project description provided."}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}

function ProjectListRow({ project }: { project: Project }) {
	const confirm = useConfirm();
	const deleteMutation = useDeleteProject();

	const coverPhoto =
		(project as unknown as { photos?: string[] }).photos?.[0] || null;

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
			className="group cursor-pointer border-navy/10 bg-white p-3 shadow-xs transition-all hover:border-navy/25 hover:bg-cream/20"
			onClick={() => openDialog("PROJECT_FORM", { projectId: project.id })}
		>
			<CardContent className="flex flex-col gap-3 p-0 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex min-w-0 flex-1 items-center gap-3.5">
					{/* Thumbnail Image */}
					<div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-navy/5 border border-navy/10">
						{coverPhoto ? (
							<img
								src={coverPhoto}
								alt={project.title}
								className="size-full object-cover"
							/>
						) : (
							<div className="flex size-full items-center justify-center bg-cream/70 text-navy/35">
								<Zap className="size-5" />
							</div>
						)}
					</div>

					<div className="flex min-w-0 flex-1 flex-col gap-0.5">
						<div className="flex items-center gap-2">
							<span className="truncate text-sm font-semibold tracking-tight text-navy sm:text-base">
								{project.title}
							</span>
							{project.caseStudy && (
								<Badge className="bg-green/10 text-green border-green/20 text-[10px] font-semibold">
									Case Study
								</Badge>
							)}
						</div>
						<span className="truncate text-xs text-navy/60">
							{project.location} · {project.body}
						</span>
					</div>
				</div>

				<div className="flex items-center justify-between gap-4 border-t border-navy/5 pt-2 sm:border-t-0 sm:pt-0 shrink-0">
					<div className="flex items-center gap-2">
						<Badge
							variant="outline"
							className="capitalize text-xs text-navy/70"
						>
							{project.category}
						</Badge>
						<span className="text-xs font-semibold text-green">
							{project.size}
						</span>
					</div>

					<div className="flex items-center gap-2">
						<span className="flex items-center gap-1 text-xs text-navy/50 font-medium min-w-12 justify-end">
							<ImageIcon className="size-3.5" />
							{project.images}
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
							<DropdownMenuContent align="end" className="w-40">
								<DropdownMenuItem
									onClick={handleEdit}
									className="cursor-pointer"
								>
									<Pencil className="mr-2 size-3.5" />
									Edit Project
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={handleDelete}
									className="cursor-pointer text-destructive focus:text-destructive"
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

function EmptyProjectsState() {
	return (
		<div className="flex h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-navy/15 bg-muted/10 p-6 text-center">
			<div className="flex size-12 items-center justify-center rounded-2xl bg-navy/5 text-navy/50 mb-3">
				<Zap className="size-6" />
			</div>
			<h3 className="text-sm font-semibold text-navy">No projects listed</h3>
			<p className="mt-1 text-xs text-navy/60 max-w-sm">
				Commissioned installations added here will immediately appear in the
				public showcase.
			</p>
			<Button
				variant="outline"
				className="mt-4"
				onClick={() => openDialog("PROJECT_FORM")}
			>
				Create first project
			</Button>
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
						className="border-navy/10 p-0 shadow-xs overflow-hidden"
					>
						<Skeleton className="aspect-video w-full rounded-none bg-navy/10" />
						<div className="space-y-2 p-4">
							<Skeleton className="h-5 w-3/4 bg-navy/10" />
							<Skeleton className="h-3.5 w-full bg-navy/5" />
						</div>
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{Array.from({ length: 5 }).map((_, i) => (
				<Card key={i} className="border-navy/10 p-3 shadow-xs">
					<div className="flex items-center gap-3.5">
						<Skeleton className="size-16 rounded-xl bg-navy/10 shrink-0" />
						<div className="flex flex-1 flex-col gap-1.5">
							<Skeleton className="h-5 w-48 bg-navy/10" />
							<Skeleton className="h-3.5 w-64 bg-navy/5" />
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}
