import { Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import logo from "../assets/logo-primary-ondark.svg";
import { FOOTER_COLS } from "../lib/content";
import { openAssess } from "../store/modal";

export default function Footer() {
	return (
		<footer className="bg-ink text-white">
			<div className="mx-auto grid max-w-315 grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] gap-11 px-8 py-16 max-[780px]:grid-cols-2 max-[480px]:grid-cols-1 max-[640px]:px-5">
				<div>
					<img
						src={logo}
						alt="Gavikina Energy"
						className="block h-9.5 w-auto"
					/>
					<p className="mt-4.5 max-w-[34ch] text-[13.5px] leading-relaxed text-white/55">
						Solar systems sized from a measured load, installed by our own
						engineers, owned outright by you.
					</p>
					<Button className="mt-5.5" size="sm" onClick={() => openAssess()}>
						Free assessment
					</Button>
				</div>
				{FOOTER_COLS.map((col) => (
					<div key={col.label}>
						<span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
							{col.label}
						</span>
						<div className="mt-4 flex flex-col items-start gap-2.5">
							{col.items.map(([path, label]) => (
								<Link
									key={path}
									to={path}
									className="text-[13.5px] text-white/66 hover:text-white"
								>
									{label}
								</Link>
							))}
						</div>
					</div>
				))}
			</div>
			<div className="mx-auto max-w-315 px-8 pb-10 max-[640px]:px-5">
				<div className="flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-6.5">
					<span className="text-xs text-white/42">
						© 2026 Gavikina Energy. Power Your Own.
					</span>
					<span className="text-xs text-white/42">
						Prices on this site are indicative ranges, confirmed after site
						inspection.
					</span>
				</div>
			</div>
		</footer>
	);
}
