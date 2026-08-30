import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { InvestorRequestValues } from "@workspace/schemas";
import { investorRequestSchema } from "@workspace/schemas";
import { Button } from "@workspace/ui/components/button";
import { FormInput, FormTextarea } from "@workspace/ui/components/form-fields";
import { Check } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { submitInvestorRequest } from "#/modules/enquiries/api";

export const Route = createFileRoute("/investors")({ component: Investors });

const INVESTOR_STATS = [
	{
		value: "₦60k+",
		label: "Typical monthly generator fuel spend per household we assess",
	},
	{
		value: "5 tiers",
		label: "Standardised systems, so installation stays repeatable",
	},
	{ value: "3–5 yrs", label: "Typical payback against current fuel spend" },
];

const INVESTOR_SECTIONS = [
	{
		title: "The opportunity",
		body: "Grid supply is unreliable and fuel is the default fallback. Households and small businesses already treat power as a monthly cost. Solar converts that recurring cost into a one-off asset, which makes the sale a comparison rather than a conversion.",
	},
	{
		title: "How we operate",
		body: "Standardised system tiers keep procurement and installation repeatable, and every job is sized by the same engine before an engineer confirms it on site. Growth comes from installation capacity and the agent network, not from bespoke engineering per customer.",
	},
	{
		title: "Where we are now",
		body: "Residential and small-business installations across Lagos, Abuja and Benin City, with an agent network in development. Current numbers, pipeline and projections are in the investor pack.",
	},
];

function Investors() {
	const form = useForm<InvestorRequestValues>({
		resolver: zodResolver(investorRequestSchema),
		defaultValues: { name: "", email: "", phone: "", message: "" },
	});
	const [sent, setSent] = useState(false);
	const mutation = useMutation({ mutationFn: submitInvestorRequest });

	const onSubmit = form.handleSubmit(async (values) => {
		await mutation.mutateAsync({ data: values });
		setSent(true);
	});

	return (
		<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
			<span className="text-xs font-semibold uppercase tracking-widest text-green">
				Investors guide
			</span>
			<h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-navy sm:text-4xl lg:text-5xl leading-[1.2]">
				A grid that cannot keep up is a market.
			</h1>

			<div className="mt-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
				{/* Left Column: Thesis & Stats */}
				<div className="flex flex-col gap-8">
					<p className="max-w-2xl text-base leading-loose text-navy/70">
						Gavikina Energy sells complete solar systems to households and small
						businesses that already spend heavily on generator fuel every month.
						The customer is not being persuaded to change habits; they are being
						offered a cheaper version of what they already buy.
					</p>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
						{INVESTOR_STATS.map((s) => (
							<div
								key={s.label}
								className="rounded-2xl bg-ink p-5 text-white shadow-xs sm:p-6"
							>
								<div className="text-2xl font-semibold tracking-tight text-amber sm:text-3xl">
									{s.value}
								</div>
								<div className="mt-2 text-xs leading-relaxed text-white/60">
									{s.label}
								</div>
							</div>
						))}
					</div>

					<div className="flex flex-col gap-6">
						{INVESTOR_SECTIONS.map((s) => (
							<div key={s.title}>
								<h3 className="text-lg font-semibold tracking-tight text-navy sm:text-xl">
									{s.title}
								</h3>
								<p className="mt-2 max-w-xl text-sm leading-loose text-navy/70">
									{s.body}
								</p>
							</div>
						))}
					</div>

					<div className="rounded-2xl border border-amber/40 bg-amber/10 p-5 sm:p-6">
						<p className="text-xs leading-relaxed text-navy/80 sm:text-sm">
							<strong className="font-semibold text-navy">
								Financials are not published here.
							</strong>{" "}
							Detailed accounts, projections, and the business plan are sent
							directly after a request is reviewed.
						</p>
					</div>
				</div>

				{/* Right Column: Request Form */}
				<div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-xl sm:p-8 lg:p-10">
					{!sent ? (
						<form
							onSubmit={onSubmit}
							noValidate
							className="flex flex-col gap-6"
						>
							<div>
								<h3 className="text-xl font-semibold tracking-tight text-navy sm:text-2xl">
									Request the full materials
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-navy/60">
									Tell us who you are and what you are looking for. We reply to
									serious enquiries with the full pack.
								</p>
							</div>

							<div className="flex flex-col gap-4">
								<FormInput
									control={form.control}
									name="name"
									label="Name"
									placeholder="Full name"
								/>

								<FormInput
									control={form.control}
									name="email"
									type="email"
									label="Email address"
									placeholder="you@email.com"
								/>

								<FormInput
									control={form.control}
									name="phone"
									type="tel"
									label="Phone number"
									placeholder="0803 000 0000"
								/>

								<FormTextarea
									control={form.control}
									name="message"
									label="What are you looking for?"
									rows={4}
									placeholder="Ticket size, horizon, questions"
								/>

								<Button
									type="submit"
									variant="ink"
									size="lg"
									className="mt-2 w-full"
									disabled={mutation.isPending}
								>
									{mutation.isPending ? "Submitting..." : "Request materials"}
								</Button>
							</div>
						</form>
					) : (
						<div className="animate-gv-in py-6 text-center sm:py-8">
							<span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-ink text-amber shadow-md">
								<Check className="size-6" />
							</span>
							<h3 className="mt-5 text-2xl font-semibold tracking-tight text-navy">
								Request logged
							</h3>
							<p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-navy/70">
								We review each request before sending financials. Expect a reply
								within a few working days.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
