import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { Selection } from "@workspace/engine";
import {
	BACKUP_OPTIONS,
	effectiveSize,
	fmt,
	fuelCompare,
	PAYMENT_METHODS,
	REASONS,
	useCalculatorAppliances,
} from "@workspace/engine";
import type { AssessmentContactValues } from "@workspace/schemas";
import { assessmentContactSchema } from "@workspace/schemas";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { FormInput } from "@workspace/ui/components/form-fields";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowLeft, Check, Minus, Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { submitAssessment } from "#/modules/assessment/api";

const STEPS = [
	"Property type",
	"Your reason",
	"Appliances",
	"Backup duration",
	"Fuel spend",
	"Recommendation",
	"Your details",
	"Payment & inspection",
];

const DRAFT_KEY = "gv_assessment_draft_v1";

interface FullAssessmentProps {
	initialSelection?: Selection;
}

interface Draft {
	step: number;
	property: string | null;
	reason: string | null;
	sel: Selection;
	backup: string | null;
	fuel: number;
	name: string;
	phone: string;
	email: string;
	payment: string | null;
	inspection: boolean;
	done: boolean;
}

export default function FullAssessment({
	initialSelection,
}: FullAssessmentProps) {
	const [step, setStep] = useState(0);
	const [property, setProperty] = useState<string | null>(null);
	const [reason, setReason] = useState<string | null>(null);
	const [sel, setSel] = useState<Selection>(initialSelection || {});
	const [backup, setBackup] = useState<string | null>(null);
	const [fuel, setFuel] = useState(60000);
	const [payment, setPayment] = useState<string | null>(null);
	const [inspection, setInspection] = useState(true);
	const [aiText, setAiText] = useState("");
	const [typing, setTyping] = useState(false);
	const [done, setDone] = useState(false);
	const [ref, setRef] = useState("");
	const appliances = useCalculatorAppliances();
	const typeRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const contactForm = useForm<AssessmentContactValues>({
		resolver: zodResolver(assessmentContactSchema),
		mode: "onChange",
		defaultValues: { name: "", phone: "", email: "" },
	});
	const contactValues = contactForm.watch();

	const submitMutation = useMutation({ mutationFn: submitAssessment });

	useEffect(() => {
		try {
			const raw = localStorage.getItem(DRAFT_KEY);
			if (raw) {
				const d: Draft = JSON.parse(raw);
				if (d.step > 0 && !d.done) {
					setStep(d.step);
					setProperty(d.property);
					setReason(d.reason);
					setSel(d.sel);
					setBackup(d.backup);
					setFuel(d.fuel);
					contactForm.reset({
						name: d.name || "",
						phone: d.phone || "",
						email: d.email || "",
					});
					setPayment(d.payment);
					setInspection(d.inspection);
				}
			}
		} catch {
			/* ignore corrupt draft */
		}
		return () => {
			if (typeRef.current) clearInterval(typeRef.current);
		};
	}, [contactForm.reset]);

	useEffect(() => {
		try {
			localStorage.setItem(
				DRAFT_KEY,
				JSON.stringify({
					step,
					property,
					reason,
					sel,
					backup,
					fuel,
					name: contactValues.name,
					phone: contactValues.phone,
					email: contactValues.email,
					payment,
					inspection,
					done,
					updated: Date.now(),
				}),
			);
		} catch {
			/* storage unavailable */
		}
	}, [
		step,
		property,
		reason,
		sel,
		backup,
		fuel,
		contactValues.name,
		contactValues.phone,
		contactValues.email,
		payment,
		inspection,
		done,
	]);

	const bump = (id: string, d: number, dflt: number) => {
		setSel((cur) => {
			const curQty = cur[id] || 0;
			const next = curQty === 0 && d > 0 ? dflt || 1 : Math.max(0, curQty + d);
			const nextSel = { ...cur };
			if (next === 0) delete nextSel[id];
			else nextSel[id] = next;
			return nextSel;
		});
	};

	const backupHours = () =>
		BACKUP_OPTIONS.find((b) => b.id === backup)?.hours ?? 8;
	const backupLabel = () =>
		BACKUP_OPTIONS.find((b) => b.id === backup)?.label ?? "8 hours";

	const aiNote = () => {
		const r = effectiveSize(sel, backupHours());
		if (!r.tier)
			return "Add a few appliances and we will explain what your system does for you.";
		const c = fuelCompare(fuel, r.tier);
		const reasonLabel = REASONS.find((x) => x.id === reason)?.label || "";
		const place = property === "business" ? "your business" : "your home";
		let t =
			"A " +
			r.tier.name +
			" system covers the " +
			r.watts.toLocaleString() +
			"W of load you listed for " +
			place +
			", with enough battery to carry you through " +
			backupLabel().toLowerCase() +
			" of no grid supply. ";
		if (c && fuel > 0) {
			t +=
				"You are spending about " +
				fmt(c.annualSpend) +
				" a year on fuel. At that rate the system pays for itself in roughly " +
				Math.round((c.paybackMonths / 12) * 10) / 10 +
				" years, and over five years you keep about " +
				fmt(c.fiveYearSaving) +
				" that would otherwise go into the generator. ";
		}
		if (reasonLabel)
			t +=
				"Given that " +
				reasonLabel.toLowerCase() +
				", this size gives you room to grow without over-buying panels. ";
		t +=
			"An engineer will confirm the roof, the wiring and the final figure on site.";
		return t;
	};

	const startTyping = () => {
		if (typeRef.current) clearInterval(typeRef.current);
		const full = aiNote();
		let i = 0;
		setAiText("");
		setTyping(true);
		typeRef.current = setInterval(() => {
			i += 3;
			if (i >= full.length) {
				if (typeRef.current) clearInterval(typeRef.current);
				setAiText(full);
				setTyping(false);
			} else {
				setAiText(full.slice(0, i));
			}
		}, 16);
	};

	const go = (n: number) => {
		const next = Math.max(0, Math.min(7, n));
		setStep(next);
		if (next === 5) setTimeout(() => startTyping(), 260);
	};

	const canAdvance = () => {
		if (step === 0) return !!property;
		if (step === 1) return !!reason;
		if (step === 2) return Object.keys(sel).length > 0;
		if (step === 3) return !!backup;
		if (step === 6) return contactForm.formState.isValid;
		if (step === 7) return !!payment;
		return true;
	};

	const hours = backupHours();
	const result = useMemo(() => effectiveSize(sel, hours), [sel, hours]);
	const compare = useMemo(
		() => fuelCompare(fuel, result.tier),
		[fuel, result.tier],
	);
	const effectiveStep = done ? 8 : step;
	const nextEnabled = canAdvance();
	const lastStep = step === 7;

	const groups = useMemo(() => {
		const cats = [...new Set(appliances.map((a) => a.category))].filter(
			(cat) => property === "business" || cat !== "Business",
		);
		return cats.map((cat) => ({
			name: cat,
			items: appliances.filter((a) => a.category === cat),
		}));
	}, [property, appliances]);

	const compareRows = compare
		? [
				{ label: "Fuel today", value: `${fmt(compare.monthlySpend)}/mo` },
				{ label: "Fuel over five years", value: fmt(compare.fiveYearSpend) },
				{
					label: "System pays back in",
					value: `${Math.round(compare.paybackMonths)} months`,
				},
				{ label: "Kept over five years", value: fmt(compare.fiveYearSaving) },
			]
		: [{ label: "Enter a fuel spend to compare", value: "—" }];

	const restart = () => {
		try {
			localStorage.removeItem(DRAFT_KEY);
		} catch {
			/* ignore */
		}
		setStep(0);
		setDone(false);
		setProperty(null);
		setReason(null);
		setSel({});
		setBackup(null);
		contactForm.reset({ name: "", phone: "", email: "" });
		setPayment(null);
		setAiText("");
	};

	const finish = async () => {
		const values = contactForm.getValues();
		const res = await submitMutation.mutateAsync({
			...values,
			property: property || "",
			reason: reason || "",
			selection: sel,
			backup: backup || "",
			fuel,
			payment: payment || "",
			inspection,
		});
		setRef(res.ref);
		setDone(true);
	};

	const nameOrYou = contactValues.name.trim().split(" ")[0] || "there";
	const phoneOrSoon = contactValues.phone.trim()
		? `on ${contactValues.phone.trim()}`
		: "shortly";

	return (
		<div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-xl lg:grid-cols-[260px_1fr]">
			{/* Steps Sidebar */}
			<div className="flex flex-col justify-between bg-ink p-6 text-white sm:p-8">
				<div className="flex flex-col gap-6">
					<div>
						<span className="text-xs font-semibold uppercase tracking-wider text-amber">
							Full assessment
						</span>
						<p className="mt-1 text-xs text-white/60 sm:text-sm">
							Five questions, then your recommendation.
						</p>
					</div>

					<div className="hidden flex-col gap-1 lg:flex">
						{STEPS.map((label, i) => {
							const active = i === effectiveStep;
							const past = i < effectiveStep;
							return (
								<div
									key={label}
									className={cn(
										"flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
										active ? "bg-white/10" : "bg-transparent",
									)}
								>
									<span
										className={cn(
											"flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
											active
												? "bg-green text-white"
												: past
													? "bg-green/20 text-green-light"
													: "bg-white/10 text-white/40",
										)}
									>
										{past ? <Check className="size-3.5" /> : String(i + 1)}
									</span>
									<span
										className={cn(
											"text-xs font-medium leading-tight sm:text-sm",
											active
												? "text-white font-semibold"
												: past
													? "text-white/70"
													: "text-white/40",
										)}
									>
										{label}
									</span>
								</div>
							);
						})}
					</div>
				</div>

				<div className="mt-4 flex items-center gap-2 text-xs text-white/50 lg:mt-8">
					<span className="size-1.5 rounded-full bg-green" />
					{effectiveStep > 0 && effectiveStep < 8
						? "Progress saved"
						: "Nothing saved yet"}
				</div>
			</div>

			{/* Step Body */}
			<div className="flex min-h-128 flex-col justify-between p-6 sm:p-8 lg:p-10">
				{step === 0 && !done && (
					<div className="animate-gv-fade">
						<h3 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
							Is this for a home or a business?
						</h3>
						<p className="mt-2 text-sm text-navy/70 sm:text-base">
							It changes which appliances we show you and how we size for peak
							demand.
						</p>
						<div className="mt-6 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
							{[
								{
									id: "home",
									label: "My home",
									note: "Flat, duplex or family house",
								},
								{
									id: "business",
									label: "My business",
									note: "Shop, office, clinic or workshop",
								},
							].map((o) => (
								<button
									key={o.id}
									type="button"
									className={cn(
										"flex flex-col items-start gap-1 rounded-2xl border p-5 text-left transition-all",
										property === o.id
											? "border-green bg-green/5 shadow-xs"
											: "border-navy/10 bg-white hover:border-navy/20",
									)}
									onClick={() => {
										setProperty(o.id);
										setTimeout(() => go(1), 160);
									}}
								>
									<span className="text-base font-semibold text-navy sm:text-lg">
										{o.label}
									</span>
									<span className="text-xs text-navy/60 sm:text-sm">
										{o.note}
									</span>
								</button>
							))}
						</div>
					</div>
				)}

				{step === 1 && !done && (
					<div className="animate-gv-fade">
						<h3 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
							Why are you considering solar?
						</h3>
						<p className="mt-2 text-sm text-navy/70 sm:text-base">
							Pick the closest reason. It shapes the recommendation you get at
							the end.
						</p>
						<div className="mt-6 flex max-w-xl flex-col gap-3">
							{REASONS.map((o) => (
								<button
									key={o.id}
									type="button"
									className={cn(
										"flex items-center rounded-xl border px-5 py-3.5 text-left text-sm font-medium transition-all",
										reason === o.id
											? "border-green bg-green/5 text-navy font-semibold"
											: "border-navy/10 bg-white text-navy/80 hover:border-navy/20",
									)}
									onClick={() => {
										setReason(o.id);
										setTimeout(() => go(2), 160);
									}}
								>
									{o.label}
								</button>
							))}
						</div>
					</div>
				)}

				{step === 2 && !done && (
					<div className="min-w-0 animate-gv-fade">
						<h3 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
							What should the system power?
						</h3>
						<p className="mt-2 text-sm text-navy/70 sm:text-base">
							Tap to add, then set quantities. Running total:{" "}
							<strong className="font-semibold text-navy">
								{result.watts.toLocaleString()}W
							</strong>
						</p>

						<div className="mt-6 flex max-h-80 flex-col gap-5 overflow-y-auto pr-2">
							{groups.map((group) => (
								<div key={group.name}>
									<div className="mb-2.5 flex items-center gap-3">
										<span className="text-xs font-semibold uppercase tracking-wider text-navy/50">
											{group.name}
										</span>
										<span className="h-px flex-1 bg-navy/10" />
									</div>

									<div className="flex flex-wrap gap-2">
										{group.items.map((item) => {
											const qty = sel[item.id] || 0;
											const on = qty > 0;
											return (
												<div
													key={item.id}
													className={cn(
														"flex items-center gap-2 rounded-xl border px-3 py-2 transition-colors",
														on
															? "border-green/40 bg-green/5"
															: "border-navy/10 bg-white",
													)}
												>
													<button
														type="button"
														className="text-xs font-medium text-navy sm:text-sm"
														onClick={() =>
															bump(
																item.id,
																qty > 0 ? -qty : 1,
																item.default_quantity,
															)
														}
													>
														{item.name}
													</button>
													{on && (
														<span className="flex items-center gap-1 border-l border-navy/15 pl-2">
															<button
																type="button"
																aria-label="Fewer"
																className="flex size-5 items-center justify-center rounded-md bg-green/10 text-green transition-colors hover:bg-green/20"
																onClick={() =>
																	bump(item.id, -1, item.default_quantity)
																}
															>
																<Minus className="size-3" />
															</button>
															<span className="w-4 text-center text-xs font-semibold tabular-nums text-navy">
																{qty}
															</span>
															<button
																type="button"
																aria-label="More"
																className="flex size-5 items-center justify-center rounded-md bg-green/10 text-green transition-colors hover:bg-green/20"
																onClick={() =>
																	bump(item.id, 1, item.default_quantity)
																}
															>
																<Plus className="size-3" />
															</button>
														</span>
													)}
												</div>
											);
										})}
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{step === 3 && !done && (
					<div className="animate-gv-fade">
						<h3 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
							How long should it run with no grid supply?
						</h3>
						<p className="mt-2 text-sm text-navy/70 sm:text-base">
							This sets the battery bank capacity, not the panel array.
						</p>
						<div className="mt-6 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-2">
							{BACKUP_OPTIONS.map((o) => (
								<button
									key={o.id}
									type="button"
									className={cn(
										"flex flex-col items-start gap-1 rounded-2xl border p-5 text-left transition-all",
										backup === o.id
											? "border-green bg-green/5 shadow-xs"
											: "border-navy/10 bg-white hover:border-navy/20",
									)}
									onClick={() => {
										setBackup(o.id);
										setTimeout(() => go(4), 160);
									}}
								>
									<span className="text-base font-semibold text-navy sm:text-lg">
										{o.label}
									</span>
									<span className="text-xs text-navy/60 sm:text-sm">
										{o.note}
									</span>
								</button>
							))}
						</div>
					</div>
				)}

				{step === 4 && !done && (
					<div className="animate-gv-fade">
						<h3 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
							What do you spend on generator fuel each month?
						</h3>
						<p className="mt-2 text-sm text-navy/70 sm:text-base">
							Petrol or diesel, your rough average. We compare it against the
							system cost.
						</p>

						<div className="mt-6 max-w-xl">
							<div className="flex items-baseline gap-2">
								<span className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
									{fmt(fuel)}
								</span>
								<span className="text-xs text-navy/50 sm:text-sm">
									per month
								</span>
							</div>

							<input
								type="range"
								min={0}
								max={500000}
								step={5000}
								value={fuel}
								onChange={(e) => setFuel(Number(e.target.value))}
								className="my-6 h-2 w-full cursor-pointer accent-green"
							/>

							<div className="flex justify-between text-xs text-navy/50">
								<span>₦0</span>
								<span>₦500,000+</span>
							</div>

							<div className="mt-6 flex flex-wrap gap-2">
								{[20000, 60000, 120000, 250000].map((v) => (
									<button
										key={v}
										type="button"
										className={cn(
											"rounded-full border px-4 py-1.5 text-xs font-medium transition-colors sm:text-sm",
											fuel === v
												? "border-green bg-green/10 text-green font-semibold"
												: "border-navy/15 bg-white text-navy/70 hover:bg-cream hover:text-navy",
										)}
										onClick={() => setFuel(v)}
									>
										{fmt(v)}
									</button>
								))}
							</div>
						</div>
					</div>
				)}

				{step === 5 && !done && (
					<div className="min-w-0 animate-gv-fade">
						<span className="text-xs font-semibold uppercase tracking-wider text-green">
							Your recommendation
						</span>

						<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="relative overflow-hidden rounded-2xl bg-ink p-6 text-white shadow-xs">
								<div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(245,166,35,0.35),rgba(245,166,35,0)_70%)]" />
								<div className="relative">
									<span className="text-xs font-semibold uppercase tracking-wider text-white/50">
										System size
									</span>
									<div className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
										{result.tier ? result.tier.name : "—"}
									</div>
									<p className="mt-1 text-xs text-white/60 sm:text-sm">
										{result.watts.toLocaleString()}W load · {backupLabel()}{" "}
										backup
									</p>

									<div className="mt-4 border-t border-white/10 pt-4">
										<span className="text-xs font-semibold uppercase tracking-wider text-white/50">
											Indicative price
										</span>
										<div className="mt-1 text-xl font-semibold text-amber sm:text-2xl">
											{result.tier
												? `${fmt(result.tier.price_range_min)} – ${fmt(result.tier.price_range_max)}`
												: "—"}
										</div>
									</div>
								</div>
							</div>

							<div className="rounded-2xl border border-navy/10 bg-cream p-6">
								<span className="text-xs font-semibold uppercase tracking-wider text-navy/50">
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
								<span className="text-xs font-semibold uppercase tracking-wider text-green-dark">
									What this means for you
								</span>
							</div>
							<p className="min-h-16 text-xs leading-relaxed text-navy sm:text-sm">
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
				)}

				{step === 6 && !done && (
					<form
						className="animate-gv-fade"
						onSubmit={(e) => e.preventDefault()}
					>
						<h3 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
							Where should we send this?
						</h3>
						<p className="mt-2 text-sm text-navy/70 sm:text-base">
							Your {result.tier ? result.tier.name : "—"} recommendation is
							ready. Leave your name, phone number and email, and an engineer
							will call to arrange the site inspection.
						</p>
						<div className="mt-6 flex max-w-md flex-col gap-4">
							<FormInput
								control={contactForm.control}
								name="name"
								label="Full name"
								placeholder="Adaeze Okonkwo"
							/>
							<FormInput
								control={contactForm.control}
								name="phone"
								type="tel"
								label="Phone number"
								placeholder="0803 000 0000"
							/>
							<FormInput
								control={contactForm.control}
								name="email"
								type="email"
								label="Email address"
								placeholder="you@email.com"
							/>
							<p className="text-xs text-navy/50">
								We call once to arrange the inspection, and send the written
								recommendation to your email. No marketing lists.
							</p>
						</div>
					</form>
				)}

				{step === 7 && !done && (
					<div className="animate-gv-fade">
						<h3 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
							How would you prefer to pay?
						</h3>
						<p className="mt-2 text-sm text-navy/70 sm:text-base">
							Nothing is charged here. It tells the engineer what to prepare.
						</p>

						<div className="mt-6 flex max-w-md flex-col gap-3">
							{PAYMENT_METHODS.map((o) => (
								<button
									key={o.id}
									type="button"
									className={cn(
										"flex items-center rounded-xl border px-5 py-3.5 text-left text-sm font-medium transition-all",
										payment === o.id
											? "border-green bg-green/5 text-navy font-semibold"
											: "border-navy/10 bg-white text-navy/80 hover:border-navy/20",
									)}
									onClick={() => setPayment(o.id)}
								>
									{o.label}
								</button>
							))}
						</div>

						<label
							htmlFor="inspection"
							className="mt-6 flex max-w-md cursor-pointer items-start gap-3"
						>
							<Checkbox
								id="inspection"
								checked={inspection}
								onCheckedChange={(checked) => setInspection(!!checked)}
								className="mt-0.5"
							/>
							<span className="text-xs leading-relaxed text-navy/75 sm:text-sm">
								Request a free site inspection. An engineer visits, confirms the
								roof and load, and issues the final quote.
							</span>
						</label>
					</div>
				)}

				{done && (
					<div className="flex max-w-md flex-1 animate-gv-fade flex-col items-start justify-center py-6">
						<span className="flex size-12 items-center justify-center rounded-2xl bg-green text-white shadow-md">
							<Check className="size-6" />
						</span>
						<h3 className="mt-5 text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
							Assessment complete
						</h3>
						<p className="mt-3 text-sm leading-relaxed text-navy/70 sm:text-base">
							Thank you, {nameOrYou}. Your{" "}
							{result.tier ? result.tier.name : "—"} recommendation and
							everything you entered has gone to our team. An engineer will call{" "}
							{phoneOrSoon} to arrange the inspection.
						</p>
						<div className="mt-6 rounded-2xl bg-cream p-4 text-xs text-navy/80 sm:text-sm">
							Reference{" "}
							<strong className="font-semibold text-navy">{ref}</strong> — quote
							it when you call us on 0800 GAVIKINA.
						</div>
						<Button variant="outline" className="mt-6" onClick={restart}>
							Run another assessment
						</Button>
					</div>
				)}

				{/* Footer Navigation */}
				{!done && (
					<div className="mt-8 flex items-center justify-between border-t border-navy/10 pt-6">
						<button
							type="button"
							className={cn(
								"inline-flex items-center gap-1.5 text-xs font-medium text-navy/70 transition-colors hover:text-navy sm:text-sm",
								step === 0 && "invisible pointer-events-none",
							)}
							onClick={() => go(step - 1)}
						>
							<ArrowLeft className="size-4" /> Back
						</button>

						<div className="flex items-center gap-4">
							<span className="text-xs text-navy/50">Step {step + 1} of 8</span>
							<Button
								disabled={!nextEnabled || submitMutation.isPending}
								variant={nextEnabled ? "default" : "outline"}
								size="sm"
								onClick={() => {
									if (!nextEnabled) return;
									if (lastStep) finish();
									else go(step + 1);
								}}
							>
								{submitMutation.isPending
									? "Submitting..."
									: lastStep
										? "Submit assessment"
										: step === 5
											? "Continue"
											: "Next"}
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
