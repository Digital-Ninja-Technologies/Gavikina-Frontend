import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { fmt } from "@workspace/engine";
import { Badge } from "@workspace/ui/components/badge";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import {
	ArrowRight,
	Gauge,
	type LucideIcon,
	PiggyBank,
	ShieldCheck,
} from "lucide-react";
import {
	catalogueAppliancesQueryOptions,
	catalogueFormulaQueryOptions,
	catalogueTiersQueryOptions,
} from "#/modules/catalogue/query-options";
import ProjectCard from "#/modules/projects/components/project-card";
import { projectsQueryOptions } from "#/modules/projects/query-options";
import { AsyncBoundary } from "../components/async-boundary";
import ImageSlot from "../components/ImageSlot";
import Reveal from "../components/Reveal";
import { HERO_SLOTS } from "../lib/content";
import SolarCalculator from "../modules/calculator/components/SolarCalculator";
import { openAssess, openCalc } from "../store/modal";

export const Route = createFileRoute("/")({
	component: Home,
	loader: async ({ context }) => {
		await Promise.all([
			context.queryClient.query(catalogueTiersQueryOptions()),
			context.queryClient.query(projectsQueryOptions({ limit: 3 })),
			context.queryClient.query(catalogueAppliancesQueryOptions()),
			context.queryClient.query(catalogueFormulaQueryOptions()),
		]);
	},
});

const VALUE_PROPS: {
	icon: LucideIcon;
	title: string;
	body: string;
}[] = [
	{
		icon: Gauge,
		title: "Sized from a measured load",
		body: "We add up what you actually run, add engineering headroom, then pick the tier. No guessing from your house size.",
	},
	{
		icon: PiggyBank,
		title: "Cheaper than the generator",
		body: "Most customers are already spending a system every few years on fuel. The assessment shows you that comparison in your own numbers.",
	},
	{
		icon: ShieldCheck,
		title: "One team, start to finish",
		body: "The engineer who sizes your system is the one who commissions it, and the one you call afterwards.",
	},
];

const HERO_FACTS = [
	{ value: "1.5–10kVA", label: "Five system tiers, sized from your real load" },
	{ value: "Free", label: "Site inspection before any quote is fixed" },
	{
		value: "One price",
		label: "Panels, inverter, batteries, install, commissioning",
	},
];

const STEPS_SHORT = [
	{
		num: "01",
		title: "Size it",
		body: "Use the calculator, or go straight to the full assessment.",
	},
	{
		num: "02",
		title: "Inspect",
		body: "An engineer visits, measures the load and checks the roof.",
	},
	{
		num: "03",
		title: "Install",
		body: "Mounting, wiring, protection and commissioning by our team.",
	},
	{
		num: "04",
		title: "Aftercare",
		body: "Warranty registered in your name, and we stay reachable.",
	},
];

const KEN_ANIM = [
	"animate-[gvKenA_32s_ease-in-out_infinite]",
	"animate-[gvKenB_32s_ease-in-out_infinite]",
	"animate-[gvKenA_32s_ease-in-out_infinite]",
	"animate-[gvKenB_32s_ease-in-out_infinite]",
];
const KEN_DELAY = ["0s", "-24s", "-16s", "-8s"];

function Home() {
	return (
		<div className="flex flex-col">
			{/* HERO */}
			<section className="relative overflow-hidden bg-ink text-white">
				<div
					className="absolute inset-0 mask-[radial-gradient(ellipse_70%_80%_at_15%_30%,#000,transparent)] bg-size-[56px_56px] opacity-50"
					style={{
						backgroundImage:
							"linear-gradient(rgba(46,158,69,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(46,158,69,0.16) 1px, transparent 1px)",
					}}
				/>
				<div className="pointer-events-none absolute -top-36 -right-16 size-128 rounded-full bg-[radial-gradient(circle_at_38%_32%,rgba(245,166,35,0.3),rgba(245,166,35,0)_66%)]" />

				<div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-8 lg:py-24">
					<div>
						<span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-amber uppercase">
							<span className="h-px w-6 bg-amber" />
							Homes &amp; businesses across Nigeria
						</span>
						<h1 className={"section-title mt-4 max-w-[16ch] leading-[1.01]"}>
							Stop renting your power from a generator.
						</h1>
						<p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
							We design, install and maintain solar systems sized to what you
							actually run. Size yours in ninety seconds — no contact details
							required.
						</p>

						<div className="mt-8 flex flex-wrap gap-3 sm:flex-row sm:items-center">
							<Button size="xl" onClick={openCalc} className="w-full sm:w-auto">
								Size my system
							</Button>
							<Button
								variant="outline-dark"
								size="xl"
								onClick={() => openAssess()}
								className="w-full sm:w-auto"
							>
								Take the full assessment
							</Button>
						</div>

						<div className="mt-12 flex flex-wrap gap-6">
							{HERO_FACTS.map((f) => (
								<div className="flex flex-col gap-1" key={f.label}>
									<span className="text-xl font-semibold tracking-tight text-white">
										{f.value}
									</span>
									<span className="max-w-[22ch] text-xs leading-snug text-white/60">
										{f.label}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className="relative">
						<div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl border border-white/10">
							{HERO_SLOTS.map((slot, i) => (
								<div
									key={slot.id}
									className={cn(
										"absolute inset-0 will-change-[transform,opacity]",
										KEN_ANIM[i],
									)}
									style={{ animationDelay: KEN_DELAY[i] }}
								>
									<ImageSlot {...slot} />
								</div>
							))}
						</div>
						<div className="absolute -bottom-6 -left-6 z-10 max-w-64 rounded-2xl bg-white p-5 text-navy shadow-2xl">
							<span className="text-[11px] font-semibold tracking-widest text-navy/20 uppercase">
								Typical outcome
							</span>
							<p className="mt-1 text-sm leading-snug font-medium text-navy">
								A 3.5kVA system replaces the generator for most two-bedroom
								homes.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* VALUE PROPS */}
			<section className="section-wrapper">
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{VALUE_PROPS.map((v, i) => {
						const Icon = v.icon;
						return (
							<Reveal key={v.title} delay={i * 60}>
								<div className="flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-6 sm:p-8">
									<span className="flex size-10 items-center justify-center rounded-xl bg-green/10 text-green">
										<Icon className="size-5" />
									</span>
									<h3 className="mt-4 text-lg font-semibold text-navy">
										{v.title}
									</h3>
									<p className="mt-2 text-sm leading-relaxed text-navy/70">
										{v.body}
									</p>
								</div>
							</Reveal>
						);
					})}
				</div>
			</section>

			{/* CALCULATOR TEASER */}
			<section className="bg-cream py-16 sm:py-20">
				<div className="section-wrapper py-0">
					<div className="mb-8 flex flex-wrap items-end justify-between gap-6">
						<div>
							<span className="text-xs font-semibold tracking-widest text-green uppercase">
								Solar calculator
							</span>
							<h2 className="mt-2 max-w-lg text-2xl leading-[1.2] font-semibold tracking-tight text-navy sm:text-3xl lg:text-4xl">
								Size your system without leaving this page.
							</h2>
						</div>
					</div>
					<SolarCalculator onAssessment={openAssess} />
				</div>
			</section>

			{/* TIERS */}
			<section className="section-wrapper">
				<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<span className="text-xs font-semibold tracking-widest text-green uppercase">
							System tiers
						</span>
						<h2 className="mt-2 text-2xl font-semibold tracking-tight text-navy sm:text-3xl lg:text-4xl">
							Five sizes. One honest price range each.
						</h2>
					</div>
					<Button
						variant="outline"
						className="w-fit"
						nativeButton={false}
						render={<Link to="/catalogue" />}
					>
						See the full catalogue <ArrowRight />
					</Button>
				</div>
				<AsyncBoundary
					errorTitle="Failed to load system tiers"
					fallback={<HomeTiersSkeleton />}
				>
					<HomeTiers />
				</AsyncBoundary>
			</section>

			{/* RECENT PROJECTS */}
			<section className="section-wrapper">
				<div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<h2 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl lg:text-4xl">
						Recently commissioned
					</h2>
					<Button
						variant="outline"
						className="w-fit"
						nativeButton={false}
						render={<Link to="/projects" />}
					>
						All past projects <ArrowRight />
					</Button>
				</div>
				<AsyncBoundary
					errorTitle="Failed to load recent projects"
					fallback={<HomeProjectsSkeleton />}
				>
					<HomeProjects />
				</AsyncBoundary>
			</section>

			{/* PROCESS */}
			<section className="section-wrapper">
				<h2 className="mb-8 text-2xl font-semibold tracking-tight text-navy sm:text-3xl lg:text-4xl">
					From first call to power on
				</h2>
				<div className="grid grid-cols-1 border-t border-navy/10 sm:grid-cols-2 lg:grid-cols-4">
					{STEPS_SHORT.map((s, index) => (
						<div
							key={s.num}
							className={cn(
								"border-b border-navy/10 py-6 sm:pr-6 sm:pl-4 lg:border-b-0",
								index % 2 === 0 && "sm:border-r sm:border-navy/10",
								index < 3 && "lg:border-r lg:border-navy/10",
							)}
						>
							<span className="text-xs font-semibold tracking-widest text-amber">
								{s.num}
							</span>
							<h3 className="mt-2 text-base font-semibold text-navy">
								{s.title}
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-navy/70">
								{s.body}
							</p>
						</div>
					))}
				</div>
				<Link
					to="/how-it-works"
					className={cn(
						buttonVariants({ variant: "link" }),
						"mt-6 inline-flex items-center text-sm font-semibold text-green transition-colors hover:text-green-dark hover:no-underline",
					)}
				>
					The full process, step by step <ArrowRight />
				</Link>
			</section>

			{/* CTA */}
			<section className="relative overflow-hidden bg-navy text-white">
				<div className="pointer-events-none absolute -bottom-40 left-1/3 size-112 rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(46,158,69,0.4),rgba(46,158,69,0)_68%)]" />
				<div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:px-8">
					<div>
						<h2 className="max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
							Ready for the number that comes with a plan?
						</h2>
						<p className="mt-3 max-w-xl text-base leading-relaxed text-white/70">
							The full assessment adds your backup hours and fuel spend, then
							gives you a personalised recommendation and a free site
							inspection.
						</p>
					</div>
					<Button
						variant="amber"
						size="lg"
						className="w-full shrink-0 sm:w-auto"
						onClick={() => openAssess()}
					>
						Start the full assessment
					</Button>
				</div>
			</section>
		</div>
	);
}

// Tiers Component
function HomeTiers() {
	const { data: tiers } = useSuspenseQuery(catalogueTiersQueryOptions());

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{tiers.map((t, i) => (
				<Reveal key={t.id} delay={i * 50}>
					<Card
						key={t.id}
						className="group relative flex flex-col justify-between gap-4 border-navy/10 bg-white py-4 shadow-xs transition-all hover:border-navy/25 hover:shadow-md"
					>
						<CardHeader>
							<div className="flex items-start justify-between gap-2">
								<div>
									<CardTitle className="text-base font-semibold text-navy">
										{t.name}
									</CardTitle>
									<span className="text-xs font-semibold text-green">
										{t.size_kva} kVA continuous
									</span>
								</div>
							</div>
						</CardHeader>

						<CardContent className="flex-1 gap-3">
							<div>
								<span className="text-[11px] font-semibold tracking-wider text-navy/40 uppercase">
									Indicative Price
								</span>
								<div className="text-lg font-semibold text-navy">
									{fmt(t.price_range_min)} – {fmt(t.price_range_max)}
								</div>
							</div>

							<div>
								<span className="text-[11px] font-semibold tracking-wider text-navy/40 uppercase">
									Powers
								</span>
								<div className="mt-1 flex flex-wrap gap-1">
									{t.typically_powers.map((item) =>
										item.split(",").map((power, idx) => {
											const trimmedPower = power.trim();
											return (
												<Badge
													key={`${trimmedPower}-${
														// biome-ignore lint/suspicious/noArrayIndexKey: <...>
														idx
													}`}
													variant="outline"
													className="border-navy/10 bg-cream/60 text-[11px] text-navy/80"
												>
													{trimmedPower}
												</Badge>
											);
										}),
									)}
								</div>
							</div>

							{t.notes && (
								<p className="line-clamp-2 text-xs leading-relaxed text-navy/60 italic">
									{t.notes}
								</p>
							)}
						</CardContent>
					</Card>
				</Reveal>
			))}
		</div>
	);
}

function HomeTiersSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
			{[...Array(5)].map((_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: <skeleton is static>
					key={i}
					className="flex h-50 flex-col gap-3 rounded-2xl border border-navy/10 bg-white p-6"
				>
					<Skeleton className="h-8 w-20" />
					<Skeleton className="h-5 w-32" />
					<div className="mt-2 flex flex-1 flex-col gap-2">
						<Skeleton className="h-3 w-full" />
						<Skeleton className="h-3 w-4/5" />
					</div>
					<Skeleton className="mt-4 h-4 w-24 border-t border-navy/10 pt-3" />
				</div>
			))}
		</div>
	);
}

function HomeProjects() {
	const { data: projectsResponse } = useSuspenseQuery(
		projectsQueryOptions({ limit: 3 }),
	);

	const projects = projectsResponse.data;

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{projects.map((project, index) => (
				<Reveal key={project.id} delay={index * 60}>
					<ProjectCard project={project} />
				</Reveal>
			))}
		</div>
	);
}

function HomeProjectsSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{[...Array(3)].map((_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: <static>
					key={i}
					className="flex flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white"
				>
					<Skeleton className="aspect-4/3 w-full rounded-none" />
					<div className="flex flex-col gap-3 p-5">
						<div className="flex items-center justify-between">
							<Skeleton className="h-5 w-3/5" />
							<Skeleton className="size-4" />
						</div>
						<Skeleton className="h-3 w-1/3" />
						<Skeleton className="mt-1 h-8 w-full" />
						<Skeleton className="mt-2 h-4 w-1/4 border-t border-navy/5 pt-3" />
					</div>
				</div>
			))}
		</div>
	);
}
