/** biome-ignore-all lint/suspicious/noArrayIndexKey: <...> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <...> */
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@workspace/ui/components/dialog";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ArrowRight, MapPin, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { PROJECT_PHOTOS } from "#/lib/content";
import { projectQueryOptions } from "#/modules/projects/query-options";
import { closeModal, openCalc } from "#/store/modal";

interface ProjectDetailModalProps {
	projectId: string;
}

export default function ProjectDetailModal({
	projectId,
}: ProjectDetailModalProps) {
	const [activePhotoIdx, setActivePhotoIdx] = useState(0);

	const { data: project, isLoading } = useQuery({
		...projectQueryOptions(projectId),
		enabled: !!projectId,
	});

	const fallbackPhoto = PROJECT_PHOTOS[projectId]?.src;

	const photos =
		project?.photos && project.photos.length > 0
			? project.photos
			: fallbackPhoto
				? [fallbackPhoto]
				: [];

	useEffect(() => {
		setActivePhotoIdx(0);
	}, [projectId]);

	useEffect(() => {
		if (activePhotoIdx >= photos.length) {
			setActivePhotoIdx(0);
		}
	}, [activePhotoIdx, photos.length]);

	const activePhoto = photos[activePhotoIdx];

	const handleOpenCalculator = () => {
		closeModal();
		openCalc();
	};

	return (
		<div className="flex max-h-[88vh] flex-col overflow-hidden">
			{/* Header */}
			<DialogHeader className="shrink-0 px-5 pb-4 pt-5 pr-14 text-left sm:px-6 sm:pt-6">
				<div className="flex flex-wrap items-center gap-2">
					{project?.category && (
						<Badge variant={project.category === "home" ? "home" : "business"}>
							{project.category === "home" ? "Home" : "Business"}
						</Badge>
					)}

					{project?.isCaseStudy && <Badge variant="case">Case study</Badge>}
				</div>

				<DialogTitle className="mt-2 text-xl font-semibold tracking-tight text-navy sm:text-2xl">
					{isLoading ? (
						<Skeleton className="h-7 w-56" />
					) : (
						project?.title || "Project Details"
					)}
				</DialogTitle>

				<DialogDescription className="mt-1 text-xs text-navy/55 sm:text-sm hidden">
					{isLoading ? (
						<Skeleton className="h-4 w-40" />
					) : (
						"Installed and sized to the project's actual requirements."
					)}
				</DialogDescription>
			</DialogHeader>

			{/* Content */}
			<div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 sm:px-6 sm:pb-6">
				{isLoading ? (
					<ProjectDetailSkeleton />
				) : (
					<div className="space-y-6">
						{/* Project Media */}
						{activePhoto && (
							<section className="space-y-3">
								<div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-navy/10 bg-navy/5">
									<img
										src={activePhoto}
										alt={`${project?.title ?? "Project"} installation`}
										className="size-full object-cover"
									/>

									{photos.length > 1 && (
										<div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
											{activePhotoIdx + 1} / {photos.length}
										</div>
									)}
								</div>

								{photos.length > 1 && (
									<div className="flex gap-2 overflow-x-auto pb-1">
										{photos.map((url, index) => {
											const isActive = index === activePhotoIdx;

											return (
												<button
													key={`${url}-${index}`}
													type="button"
													onClick={() => setActivePhotoIdx(index)}
													aria-label={`View project photo ${index + 1}`}
													aria-pressed={isActive}
													className={[
														"relative size-14 shrink-0 overflow-hidden rounded-lg",
														"border transition-all",
														"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/40",
														isActive
															? "border-green ring-2 ring-green/15"
															: "border-navy/10 opacity-65 hover:opacity-100",
													].join(" ")}
												>
													<img
														src={url}
														alt=""
														className="size-full object-cover"
													/>
												</button>
											);
										})}
									</div>
								)}
							</section>
						)}

						{/* Key Details */}
						<section className="overflow-hidden rounded-2xl border border-navy/10 bg-cream/35">
							<div className="grid grid-cols-1 divide-y divide-navy/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
								<div className="flex items-center gap-3 px-4 py-4 sm:px-5">
									<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green/10 text-green">
										<Zap className="size-4" />
									</div>

									<div className="min-w-0">
										<p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-navy/45">
											System size
										</p>
										<p className="mt-0.5 truncate text-sm font-semibold text-navy">
											{project?.systemSize || "Custom"}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3 px-4 py-4 sm:px-5">
									<div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-navy/6 text-navy/75">
										<MapPin className="size-4" />
									</div>

									<div className="min-w-0">
										<p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-navy/45">
											Location
										</p>
										<p className="mt-0.5 truncate text-sm font-semibold text-navy">
											{project?.location || "Nigeria"}
										</p>
									</div>
								</div>
							</div>
						</section>

						{/* Description */}
						<section>
							<div className="mb-2 flex items-center justify-between">
								<h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-navy/45">
									Installation overview
								</h3>
							</div>

							<p className="max-w-2xl text-sm leading-6 text-navy/75 sm:text-[15px] sm:leading-7">
								{project?.description ||
									"Commissioning details and load analysis were verified on site to determine the appropriate system configuration."}
							</p>
						</section>
					</div>
				)}
			</div>

			{/* Footer */}
			<DialogFooter className="shrink-0 border-t border-navy/10 px-5 py-4 sm:px-6 sm:justify-end">
				<Button
					type="button"
					size="sm"
					onClick={handleOpenCalculator}
					className="w-full gap-2 sm:w-auto"
				>
					Size a similar system
					<ArrowRight className="size-3.5" />
				</Button>
			</DialogFooter>
		</div>
	);
}

function ProjectDetailSkeleton() {
	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<Skeleton className="aspect-16/10 w-full rounded-2xl bg-navy/5" />

				<div className="flex gap-2">
					<Skeleton className="size-14 rounded-lg bg-navy/5" />
					<Skeleton className="size-14 rounded-lg bg-navy/5" />
					<Skeleton className="size-14 rounded-lg bg-navy/5" />
				</div>
			</div>

			<div className="overflow-hidden rounded-2xl border border-navy/10">
				<div className="grid grid-cols-1 sm:grid-cols-2">
					<Skeleton className="h-20 rounded-none bg-navy/5" />
					<Skeleton className="h-20 rounded-none bg-navy/3" />
				</div>
			</div>

			<div className="space-y-3">
				<Skeleton className="h-3 w-32 bg-navy/10" />
				<Skeleton className="h-4 w-full bg-navy/5" />
				<Skeleton className="h-4 w-[92%] bg-navy/5" />
				<Skeleton className="h-4 w-[72%] bg-navy/5" />
			</div>
		</div>
	);
}
