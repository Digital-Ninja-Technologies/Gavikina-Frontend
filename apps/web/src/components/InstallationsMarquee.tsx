import { PROJECT_PHOTOS } from "../lib/content";

const PHOTOS = Object.values(PROJECT_PHOTOS);
const LOOP = [...PHOTOS, ...PHOTOS];

export default function InstallationsMarquee() {
	return (
		<div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
			<div className="animate-gv-marquee flex w-max gap-4 hover:[animation-play-state:paused]">
				{LOOP.map((photo, i) => (
					<div
						key={`${photo.src}-${i}`}
						className="h-[230px] w-[346px] shrink-0 overflow-hidden rounded-2xl border border-navy/10 sm:h-[269px] sm:w-96"
					>
						<img
							src={photo.src}
							alt="Completed Gavikina Energy installation"
							loading="lazy"
							className="h-full w-full object-cover"
						/>
					</div>
				))}
			</div>
		</div>
	);
}
