// import { Badge } from "@workspace/ui/components/badge";
import { ArrowUpRight, MapPin } from "lucide-react";
import { PROJECT_PHOTOS } from "#/lib/content";
import { openProject } from "#/store/modal";

interface ProjectCardProps {
	project: {
		id: string;
		title: string;
		category?: "home" | "business" | null;
		systemSize?: string | null;
		location?: string | null;
		description?: string | null;
		photos?: string[] | null;
	};
}

export default function ProjectCard({ project }: ProjectCardProps) {
	const fallbackPhoto = PROJECT_PHOTOS[project.id] || PROJECT_PHOTOS.p1;

	const imageSrc =
		project.photos && project.photos.length > 0
			? project.photos[0]
			: fallbackPhoto.src;

	const categoryLabel =
		project.category === "home"
			? "Home"
			: project.category === "business"
				? "Business"
				: null;

	return (
		<button
			type="button"
			onClick={() => openProject(project.id)}
			aria-label={`View ${project.title} project`}
			className="group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white text-left shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-navy/25 hover:shadow-md"
		>
			<div className="relative aspect-4/3 w-full overflow-hidden bg-cream">
				<img
					src={imageSrc}
					alt={`${project.title} installation`}
					className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
				/>

				<div className="absolute top-3 left-3 flex items-center gap-1.5">
					{project.systemSize && (
						<span className="rounded-lg bg-navy/85 px-2.5 py-1 text-xs font-semibold text-white shadow-xs backdrop-blur-xs">
							{project.systemSize}
						</span>
					)}

					{categoryLabel && (
						<span className="rounded-lg border border-white/20 bg-white/90 px-2 py-1 text-[11px] font-semibold tracking-wide text-navy uppercase shadow-xs backdrop-blur-xs">
							{categoryLabel}
						</span>
					)}
				</div>
			</div>

			<div className="flex flex-1 flex-col p-5">
				<div>
					<div className="flex items-start justify-between gap-3">
						<h3 className="text-base font-semibold tracking-tight text-navy transition-colors group-hover:text-green">
							{project.title}
						</h3>

						<ArrowUpRight className="size-4 shrink-0 text-navy/40 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy" />
					</div>

					{project.location && (
						<div className="mt-2 flex items-center gap-1.5 text-xs text-navy/60">
							<MapPin className="size-3.5 shrink-0 text-navy/40" />
							<span className="truncate">{project.location}</span>
						</div>
					)}

					{project.description && (
						<p className="mt-3 line-clamp-2 text-xs leading-relaxed text-navy/70">
							{project.description}
						</p>
					)}
				</div>

				<div className="mt-auto pt-4">
					<div className="border-t border-navy/5 pt-3">
						<span className="text-xs font-semibold text-green transition-colors group-hover:underline">
							View project details →
						</span>
					</div>
				</div>
			</div>
		</button>
	);
}
