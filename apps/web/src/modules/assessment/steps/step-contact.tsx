import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";
import type { AssessmentContactValues } from "@workspace/schemas";
import { assessmentContactSchema } from "@workspace/schemas";
import { FormInput } from "@workspace/ui/components/form-fields";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import AssessmentFooter from "../components/assessment-footer";
import { assessmentQueryOptions } from "../query-options";
import { assessmentStore } from "../store";

export default function StepContact() {
	const contactState = useSelector(assessmentStore, (s) => s.contact);
	const sessionId = useSelector(assessmentStore, (s) => s.sessionId);

	const {
		data: assessment,
		isPending,
		isError,
		// biome-ignore lint/style/noNonNullAssertion: <sessionId is guaranteed to exist here>
	} = useQuery(assessmentQueryOptions(sessionId!));

	const form = useForm<AssessmentContactValues>({
		resolver: zodResolver(assessmentContactSchema),
		defaultValues: contactState,
		mode: "onChange",
	});

	const isValid = form.formState.isValid;
	const values = form.watch();

	if (isPending) {
		return (
			<div className="flex h-full flex-col justify-between animate-gv-fade">
				<div className="flex flex-1 flex-col items-center justify-center text-center">
					<Loader2 className="mb-4 size-8 animate-spin text-green" />
					<h3 className="text-xl font-semibold tracking-tight text-navy">
						Preparing your details...
					</h3>
				</div>
			</div>
		);
	}

	const tierName = isError
		? "Custom Size"
		: assessment?.recommendation?.tier || "—";

	return (
		<div className="flex h-full min-w-0 flex-col justify-between animate-gv-fade">
			<form onSubmit={(e) => e.preventDefault()}>
				<h3 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
					Where should we send this?
				</h3>
				<p className="mt-2 text-sm text-navy/70 sm:text-base">
					Your <strong className="font-semibold text-navy">{tierName}</strong>{" "}
					recommendation is ready. Leave your name, phone number and email, and
					an engineer will call to arrange the site inspection.
				</p>
				<div className="mt-6 flex max-w-md flex-col gap-4">
					<FormInput
						control={form.control}
						name="name"
						label="Full name"
						placeholder="Adaeze Okonkwo"
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

			<AssessmentFooter
				canAdvance={isValid}
				apiStepNumber={7}
				apiPayload={values}
			/>
		</div>
	);
}
