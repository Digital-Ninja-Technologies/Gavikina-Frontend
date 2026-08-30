import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { CareerApplicationValues } from "@workspace/schemas";
import { careerApplicationSchema } from "@workspace/schemas";
import { Button } from "@workspace/ui/components/button";
import { Field, FieldLabel } from "@workspace/ui/components/field";
import { FormInput, FormTextarea } from "@workspace/ui/components/form-fields";
import { toast } from "@workspace/ui/components/toast";
import { Check, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { submitCareerApplication } from "#/modules/enquiries/api";

export const Route = createFileRoute("/careers")({ component: Careers });

const CAREER_NOTES = [
	"Installers, electrical engineers, assessors and office roles all use this form",
	"Applications stay on file and are reviewed when a role opens",
	"We call shortlisted applicants on the number you leave here",
];

function Careers() {
	const form = useForm<CareerApplicationValues>({
		resolver: zodResolver(careerApplicationSchema),
		defaultValues: {
			role: "",
			name: "",
			email: "",
			phone: "",
			location: "",
			about: "",
		},
	});
	const [cvName, setCvName] = useState("");
	const [sent, setSent] = useState(false);

	const mutation = useMutation({
		mutationFn: (data: CareerApplicationValues & { cvName?: string }) =>
			submitCareerApplication({ data }),

		onSuccess(data) {
			if (data.success) {
				setSent(true);
			}
		},
		onError(error) {
			toast.add({
				title: "Error",
				description:
					error?.message ||
					"Failed to send application. Please try again later.",
				type: "error",
			});
			console.error("Error submitting career application:", error);
		},
	});

	const onSubmit = form.handleSubmit(async (values) => {
		mutation.mutate({ ...values, cvName });
	});

	const pickCv = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) setCvName(file.name);
	};

	return (
		<div className="section-wrapper">
			<span className="text-xs font-semibold uppercase tracking-widest text-green">
				Careers
			</span>
			<h1 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight text-navy sm:text-4xl lg:text-5xl">
				Work on systems that stay up.
			</h1>
			<p className="mt-3 max-w-xl text-base leading-loose text-navy/70">
				We hire engineers and technicians who would rather do a job once,
				properly.
			</p>

			<div className="mt-10 grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
				{/* Left Column: Information & Notes */}
				<div>
					<h2 className="text-xl font-semibold tracking-tight text-navy sm:text-2xl">
						Open application
					</h2>
					<p className="mt-2 text-sm leading-relaxed text-navy/70 sm:text-base">
						We keep every application on file and go through them when a role
						opens. Tell us the role you are after, even if it is not advertised.
					</p>

					<div className="mt-6 flex flex-col gap-3.5">
						{CAREER_NOTES.map((n) => (
							<div
								key={n}
								className="flex items-start gap-3 text-xs leading-relaxed text-navy/75 sm:text-sm"
							>
								<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-green" />
								{n}
							</div>
						))}
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
									Apply to join the team
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-navy/60">
									One form for every role. We reply to the ones we can place.
								</p>
							</div>

							<div className="flex flex-col gap-4">
								<FormInput
									control={form.control}
									name="role"
									label="Role you are applying for"
									placeholder="e.g. Installation technician"
								/>

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

								<FormTextarea
									control={form.control}
									name="about"
									label="Relevant experience"
									rows={5}
									className="min-h-30"
									placeholder="Where you have worked and what you have installed or maintained"
								/>

								<Field>
									<FieldLabel>Upload your CV</FieldLabel>
									<div className="relative flex items-center gap-3.5 rounded-xl border border-dashed border-navy/25 bg-cream/30 p-3.5 transition-colors hover:border-green hover:bg-cream/60">
										<span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-navy/10 bg-white text-green shadow-2xs">
											<Upload className="size-4" />
										</span>
										<div className="flex min-w-0 flex-col">
											<span className="truncate text-xs font-medium text-navy sm:text-sm">
												{cvName || "Choose a file"}
											</span>
											<span className="text-xs text-navy/50">
												PDF or Word document, up to 5MB
											</span>
										</div>
										<input
											type="file"
											accept=".pdf,.doc,.docx"
											onChange={pickCv}
											className="absolute inset-0 size-full cursor-pointer opacity-0"
										/>
									</div>
								</Field>

								<Button
									type="submit"
									size="lg"
									className="mt-2 w-full"
									disabled={mutation.isPending}
								>
									{mutation.isPending ? "Submitting..." : "Submit application"}
								</Button>

								<p className="text-xs leading-relaxed text-navy/50">
									Your CV is attached to the application in the dashboard. No
									email needed.
								</p>
							</div>
						</form>
					) : (
						<div className="animate-gv-in py-6 text-center sm:py-8">
							<span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-green text-white shadow-md">
								<Check className="size-6" />
							</span>
							<h3 className="mt-5 text-2xl font-semibold tracking-tight text-navy">
								Application received
							</h3>
							<p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-navy/70">
								Thank you. We keep it on file and will call the number you left
								when a matching role opens.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
