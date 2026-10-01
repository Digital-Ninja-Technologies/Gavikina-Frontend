import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import { fmt } from "@workspace/engine";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { closeModal } from "#/store/modal";
import AssessmentFooter from "../components/assessment-footer";
import { assessmentQueryOptions } from "../query-options";
import { assessmentActions, assessmentStore } from "../store";

export default function StepRecommendation() {
	const sessionId = useSelector(assessmentStore, (s) => s.sessionId);

	const {
		data: assessment,
		isPending,
		error,
		// biome-ignore lint/style/noNonNullAssertion: <sessionId is guaranteed to exist here>
	} = useQuery(assessmentQueryOptions(sessionId!));

	const rec = assessment?.recommendation;

	const [aiText, setAiText] = useState("");
	const [typing, setTyping] = useState(false);
	const typeRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (!rec || !assessment) return;

		const reason = assessment.reason;
		const place =
			assessment.propertyType === "business" ? "your business" : "your home";

		let text = `A ${rec.tier} system covers the ${rec.totalLoad.toLocaleString()}W of load you listed for ${place}, with enough battery to carry you through ${assessment.backupHours} hours of no grid supply. `;

		if (rec.paybackMonths) {
			text += `You are spending about ${fmt(rec.annualFuelSpend)} a year on fuel. At that rate the system pays for itself in roughly ${Math.round((rec.paybackMonths / 12) * 10) / 10} years, and over five years you keep about ${fmt(rec.keptOverFiveYears)} that would otherwise go into the generator. `;
		}

		if (reason) {
			text += `Given that ${reason.toLowerCase()}, this size gives you room to grow without over-buying panels. `;
		}

		text +=
			"An engineer will confirm the roof, the wiring and the final figure on site.";

		let i = 0;
		setAiText("");
		setTyping(true);

		typeRef.current = setInterval(() => {
			i += 3;
			if (i >= text.length) {
				if (typeRef.current) clearInterval(typeRef.current);
				setAiText(text);
				setTyping(false);
			} else {
				setAiText(text.slice(0, i));
			}
		}, 16);

		return () => {
			if (typeRef.current) clearInterval(typeRef.current);
		};
	}, [rec, assessment]);

	if (isPending) {
		return (
			<div className="flex h-full animate-gv-fade flex-col justify-between">
				<div className="flex flex-1 flex-col items-center justify-center text-center">
					<Loader2 className="mb-4 size-8 animate-spin text-green" />
					<h3 className="text-xl font-semibold tracking-tight text-navy">
						Generating recommendation...
					</h3>
					<p className="mt-2 text-sm text-navy/60">
						Calculating your load and comparing your fuel spend.
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		const isCustomSize = error.message
			.toLowerCase()
			.includes("exceeds maximum system size");

		const handleContactClick = () => {
			assessmentActions.reset();
			closeModal();
		};

		return (
			<div className="flex h-full min-w-0 animate-gv-fade flex-col justify-between">
				<div>
					<span className="text-xs font-semibold tracking-wider text-amber uppercase">
						{isCustomSize ? "Custom Solution Required" : "Calculation Error"}
					</span>

					<div className="mt-4 overflow-hidden rounded-2xl bg-ink p-6 text-white shadow-xs sm:p-8">
						<h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
							{isCustomSize
								? "Industrial or Custom Scale"
								: "Unable to generate"}
						</h3>
						<p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
							{isCustomSize
								? "The appliances you selected exceed our standard 1.5kVA – 10kVA tiers."
								: error.message}
						</p>
						{isCustomSize && (
							<div className="mt-6 rounded-xl border border-amber/30 bg-amber/10 p-4">
								<p className="text-sm leading-relaxed text-white/90">
									Please reach out to our engineering team directly to discuss
									your load profile and design a bespoke system architecture.
								</p>
							</div>
						)}
					</div>
				</div>

				<div className="mt-8 flex items-center justify-between border-t border-navy/10 pt-6">
					<button
						type="button"
						className="inline-flex items-center gap-1.5 text-xs font-medium text-navy/70 transition-colors hover:text-navy sm:text-sm"
						onClick={assessmentActions.reset}
					>
						<ArrowLeft className="size-4" /> Go back
					</button>

					<Button
						size="sm"
						onClick={handleContactClick}
						nativeButton={false}
						render={<Link to="/contact" />}
					>
						Contact an Engineer
					</Button>
				</div>
			</div>
		);
	}
	// 3. Normal Recommendation State
	if (!rec) return null;

	const compareRows = [
		{ label: "Fuel today", value: `${fmt(rec.fuelSavingsPerMonth)}/mo` },
		{ label: "Fuel over five years", value: `${fmt(rec.fuelOverFiveYears)}` },
		{
			label: "System pays back in",
			value: `${Math.round(rec.paybackMonths)} months`,
		},
		{ label: "Kept over five years", value: `${fmt(rec.keptOverFiveYears)}` },
	];

	return (
		<div className="flex h-full min-w-0 animate-gv-fade flex-col justify-between">
			<div>
				<span className="text-xs font-semibold tracking-wider text-green uppercase">
					Your recommendation
				</span>

				<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="relative overflow-hidden rounded-2xl bg-ink p-6 text-white shadow-xs">
						<div className="pointer-events-none absolute -top-8 -right-8 size-32 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(245,166,35,0.35),rgba(245,166,35,0)_70%)]" />
						<div className="relative">
							<span className="text-xs font-semibold tracking-wider text-white/50 uppercase">
								System size
							</span>
							<div className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
								{rec.tier}
							</div>
							<p className="mt-1 text-xs text-white/60 sm:text-sm">
								{rec.totalLoad.toLocaleString()}W load ·{" "}
								{assessment.backupHours}h backup
							</p>

							<div className="mt-4 border-t border-white/10 pt-4">
								<span className="text-xs font-semibold tracking-wider text-white/50 uppercase">
									Indicative price
								</span>
								<div className="mt-1 text-xl font-semibold text-amber sm:text-2xl">
									{fmt(rec.priceMin)} – {fmt(rec.priceMax)}
								</div>
							</div>
						</div>
					</div>

					<div className="rounded-2xl border border-navy/10 bg-cream p-6">
						<span className="text-xs font-semibold tracking-wider text-navy/50 uppercase">
							Against your fuel spend
						</span>
						<div className="mt-4 flex flex-col gap-3">
							{compareRows.map((r) => (
								<div
									key={r.label}
									className="flex items-baseline justify-between gap-3 border-b border-navy/10 pb-2.5 last:border-b-0 last:pb-0"
								>
									<span className="text-xs text-navy/70 sm:text-sm">
										{r.label}
									</span>
									<span className="shrink-0 text-xs font-semibold text-navy sm:text-sm">
										{r.value}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="mt-5 rounded-2xl border border-green/30 bg-green/5 p-5 sm:p-6">
					<div className="mb-2 flex items-center gap-2">
						<span className="flex size-5 items-center justify-center rounded-md bg-green text-xs font-bold text-white">
							G
						</span>
						<span className="text-xs font-semibold tracking-wider text-green-dark uppercase">
							What this means for you
						</span>
					</div>
					<p className="min-h-16 text-xs leading-loose text-navy sm:text-sm">
						{aiText}
						<span
							className={cn(
								"ml-0.5 text-green",
								typing ? "inline animate-gv-caret" : "hidden",
							)}
						>
							▌
						</span>
					</p>
				</div>
			</div>

			<AssessmentFooter canAdvance={true} nextLabel="Continue to details" />
		</div>
	);
}
