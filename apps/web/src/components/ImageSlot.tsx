interface ImageSlotProps {
	src: string;
	placeholder: string;
	credit?: string;
	creditHref?: string;
	alt?: string;
}

export default function ImageSlot({
	src,
	placeholder,
	credit,
	creditHref,
	alt,
}: ImageSlotProps) {
	return (
		<div className="absolute inset-0">
			<img
				src={src}
				alt={alt || placeholder}
				loading="lazy"
				className="block h-full w-full object-cover"
			/>
			{credit && (
				<div className="pointer-events-auto absolute bottom-2.5 left-2.5 rounded-full bg-ink/45 px-2 py-1 text-[10.5px] leading-tight text-white/85 backdrop-blur-sm">
					{creditHref ? (
						<a
							href={creditHref}
							target="_blank"
							rel="noopener noreferrer"
							className="text-inherit no-underline hover:underline"
						>
							{credit}
						</a>
					) : (
						credit
					)}
				</div>
			)}
		</div>
	);
}
