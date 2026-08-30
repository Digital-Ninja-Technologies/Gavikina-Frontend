import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { AgentApplicationValues } from "@workspace/schemas";
import { agentApplicationSchema } from "@workspace/schemas";
import { Button } from "@workspace/ui/components/button";
import { FormInput, FormTextarea } from "@workspace/ui/components/form-fields";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { submitAgentApplication } from "#/modules/enquiries/api";

export const Route = createFileRoute("/agent")({
	component: Agent,
});

const AGENT_FACTS = [
	{
		label: "What you do",
		body: "Introduce customers, help them complete the assessment, attend the inspection.",
	},
	{
		label: "What you earn",
		body: "A commission on each commissioned system, tiered by system size.",
	},
	{
		label: "When it is paid",
		body: "After commissioning and final payment, in the following payment run.",
	},
	{
		label: "What we provide",
		body: "Training, the assessment tool, and an engineer on every site visit.",
	},
];

const AGENT_REQS = [
	"A defined area you know well and can cover on the ground",
	"A phone number you answer and a willingness to attend inspections",
	"Any sales, electrical or construction background is an advantage, not a requirement",
	"Completion of our two-day product and assessment training before your first introduction",
];

function buildNote(values: AgentApplicationValues) {
	const where = values.location.trim();
	const job = values.occupation.trim();
	let t =
		"Thanks" +
		(values.name ? `, ${values.name.trim().split(/\s+/)[0]}` : "") +
		". ";
	t += where
		? "You are the first applicant we have from " +
			where +
			", so an introduction there would open ground we do not cover yet. "
		: "Tell us your area when we call; coverage is how we prioritise agents. ";
	if (job) {
		t +=
			"Coming from " +
			job.toLowerCase() +
			", the part of the training that will matter most for you is load assessment: getting the appliance list right is what makes a quote hold. ";
	}
	t +=
		"Next step is a 15-minute call to confirm your area and book you onto the two-day training. Agents who complete it usually place their first introduction within three weeks.";
	return t;
}

function Agent() {
	const form = useForm<AgentApplicationValues>({
		resolver: zodResolver(agentApplicationSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			location: "",
			occupation: "",
			reason: "",
		},
	});
	const [sent, setSent] = useState(false);
	const [aiText, setAiText] = useState("");
	const [typing, setTyping] = useState(false);
	const typeRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const mutation = useMutation({
		mutationFn: (data: AgentApplicationValues) =>
			submitAgentApplication({ data }),
	});

	useEffect(() => {
		return () => {
			if (typeRef.current) clearInterval(typeRef.current);
		};
	}, []);

	const onSubmit = form.handleSubmit(async (values) => {
		await mutation.mutateAsync(values);
		setSent(true);
		const full = buildNote(values);
		let i = 0;
		setAiText("");
		setTyping(true);

		if (typeRef.current) clearInterval(typeRef.current);

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
	});

	return (
		<div className="section-wrapper">
			<span className="text-xs font-semibold uppercase tracking-widest text-green">
				Become an agent
			</span>
			<h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-navy sm:text-4xl lg:text-5xl leading-[1.2]">
				Sell power in your own neighbourhood.
			</h1>

			<div className="mt-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
				{/* Left Column: Context & Requirements */}
				<div>
					<p className="max-w-2xl text-base text-navy/70 leading-loose">
						Agents introduce customers, walk them through the assessment, and
						hand the site over to our engineers. You do not carry stock, quote
						prices or handle installation; you find the homes and businesses
						that are ready and stay with them until commissioning.
					</p>

					<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
						{AGENT_FACTS.map((a) => (
							<div
								key={a.label}
								className="rounded-2xl border border-navy/10 bg-white p-5 shadow-xs sm:p-6"
							>
								<span className="text-xs font-medium uppercase tracking-wider text-navy/50">
									{a.label}
								</span>
								<p className="mt-2 text-sm leading-relaxed font-medium text-navy">
									{a.body}
								</p>
							</div>
						))}
					</div>

					<div className="mt-6 rounded-2xl bg-cream p-6 sm:p-8">
						<h3 className="text-base font-semibold tracking-tight text-navy sm:text-lg">
							What we ask of you
						</h3>
						<div className="mt-4 flex flex-col gap-3">
							{AGENT_REQS.map((r) => (
								<div
									key={r}
									className="flex items-start gap-3 text-xs leading-relaxed text-navy/75 sm:text-sm"
								>
									<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-green" />
									{r}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Right Column: Application Form */}
				<div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-xl sm:p-8 lg:p-10">
					{!sent ? (
						<form
							onSubmit={onSubmit}
							noValidate
							className="flex flex-col gap-6"
						>
							<div>
								<h3 className="text-xl font-semibold tracking-tight text-navy sm:text-2xl">
									Apply to become an agent
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-navy/60">
									We review applications weekly and call the ones that fit.
								</p>
							</div>

							<div className="flex flex-col gap-4">
								<FormInput
									control={form.control}
									name="name"
									label="Full name"
									placeholder="Your name"
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

								<FormInput
									control={form.control}
									name="location"
									label="Where are you based?"
									placeholder="Area and state"
								/>

								<FormInput
									control={form.control}
									name="occupation"
									label="Current occupation"
									placeholder="What you do now"
								/>

								<FormTextarea
									control={form.control}
									name="reason"
									label="Why do you want to join?"
									rows={5}
									placeholder="Tell us about your network and why this fits"
									className="min-h-36"
								/>

								<Button
									type="submit"
									size="lg"
									className="mt-2 w-full"
									disabled={mutation.isPending}
								>
									{mutation.isPending ? "Submitting..." : "Submit application"}
								</Button>
							</div>
						</form>
					) : (
						<div className="animate-gv-in py-6">
							<span className="flex size-12 items-center justify-center rounded-2xl bg-green text-white shadow-md">
								<Check className="size-6" />
							</span>
							<h3 className="mt-5 text-2xl font-semibold tracking-tight text-navy">
								Application received
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-navy/70">
								Thank you. We review weekly and will call the number you left if
								there is a fit in your area.
							</p>

							<div className="mt-6 rounded-2xl border border-green/30 bg-green/5 p-6">
								<div className="mb-3 flex items-center gap-2.5">
									<span className="flex size-5 items-center justify-center rounded-md bg-green text-xs font-bold text-white">
										G
									</span>
									<span className="text-xs font-semibold uppercase tracking-wider text-green-dark">
										First read on your application
									</span>
								</div>
								<p className="min-h-16 text-sm leading-relaxed text-navy">
									{aiText}
									<span
										className={
											typing
												? "ml-0.5 inline animate-gv-caret text-green"
												: "hidden"
										}
									>
										▌
									</span>
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
