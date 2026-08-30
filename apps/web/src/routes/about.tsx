import { createFileRoute } from "@tanstack/react-router";
import ImageSlot from "../components/ImageSlot";
import { ABOUT_PHOTO } from "../lib/content";

export const Route = createFileRoute("/about")({ component: About });

const PRINCIPLES = [
	{
		title: "Measured, not guessed",
		body: "Every quote starts from a load audit at your distribution board.",
	},
	{
		title: "One price, all in",
		body: "Mounting, protection and commissioning are never separate line items.",
	},
	{
		title: "Lithium only",
		body: "We stopped installing lead-acid banks. They do not survive the duty cycle here.",
	},
	{
		title: "You own it",
		body: "No lease, no subscription, no lock-in to us for spares.",
	},
];

function About() {
	return (
		<div className="section-wrapper">
			<span className="text-xs font-semibold uppercase tracking-widest text-green">
				About us
			</span>
			<h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-navy sm:text-4xl lg:text-5xl leading-[1.2]">
				We build power you own outright.
			</h1>

			<div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
				{/* Content & Principles */}
				<div className="flex flex-col gap-6 text-sm leading-loose text-navy/70 sm:text-[15.5px] font-light">
					<p>
						Gavikina Energy installs solar systems for homes and businesses that
						are tired of budgeting for fuel. We are engineers first: every
						system is sized from a measured load, not a sales target, and every
						quote is confirmed on site before a panel is ordered.
					</p>
					<p>
						The work is deliberately narrow. We size, supply, install and
						commission complete systems — panels, inverter, batteries, mounting,
						protection and cabling — and we stay reachable afterwards. No cart,
						no bundles, no upsell on hardware you will not use.
					</p>
					<p>
						What you own at the end is an asset on your roof, not a
						subscription.
					</p>

					<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
						{PRINCIPLES.map((p) => (
							<div key={p.title} className="rounded-xl bg-cream p-6">
								<h3 className="text-sm font-semibold text-navy sm:text-base">
									{p.title}
								</h3>
								<p className="mt-1.5 text-xs leading-relaxed text-navy/70 sm:text-sm">
									{p.body}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Image Column */}
				<div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-cream sm:aspect-video lg:aspect-3/4">
					<ImageSlot
						src={ABOUT_PHOTO.src}
						placeholder="Team or install photo"
						credit={ABOUT_PHOTO.credit}
						creditHref={ABOUT_PHOTO.creditHref}
					/>
				</div>
			</div>
		</div>
	);
}
