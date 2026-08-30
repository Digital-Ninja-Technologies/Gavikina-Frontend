import { Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import logo from "../assets/logo-primary-ondark.svg";
import { FOOTER_COLS } from "../lib/content";
import { openAssess } from "../store/modal";

export default function Footer() {
	return (
		<footer className="bg-ink text-white">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
				<div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-12">
					{/* Brand Column */}
					<div>
						<img
							src={logo}
							alt="Gavikina Energy"
							className="block h-9 w-auto"
						/>
						<p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
							Solar systems sized from a measured load, installed by our own
							engineers, owned outright by you.
						</p>
						<Button className="mt-6" size="sm" onClick={() => openAssess()}>
							Free assessment
						</Button>
					</div>

					{/* Navigation Columns */}
					{FOOTER_COLS.map((col) => (
						<div key={col.label}>
							<span className="text-xs font-semibold uppercase tracking-wider text-white/40">
								{col.label}
							</span>
							<div className="mt-4 flex flex-col items-start gap-3">
								{col.items.map(([path, label]) => (
									<Link
										key={path}
										to={path}
										className="text-sm text-white/70 transition-colors hover:text-white"
									>
										{label}
									</Link>
								))}
							</div>
						</div>
					))}
				</div>

				{/* Bottom Bar */}
				<div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
					<span className="text-xs text-white/50">
						© 2026 Gavikina Energy. Power Your Own.
					</span>
					<span className="text-xs text-white/50">
						Prices on this site are indicative ranges, confirmed after site
						inspection.
					</span>
				</div>
			</div>
		</footer>
	);
}
