import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowLeft, Download, FileText, Mail, Phone } from "lucide-react";

import type { Lead } from "#/lib/data";
import { naira, viewInfo } from "#/lib/data";
import { csvFor, download } from "#/lib/utils";
import { enquiryDetailQueryOptions } from "../query-options";

interface EnquiryDetailViewProps {
	id: string;
	view: string;
}

function fieldsFor(open: Lead): [string, string][] {
	const fields: [string, string][] = [];
	if (open.type === "Customer") {
		fields.push(["Property type", open.property || ""]);
		fields.push(["Reason for solar", open.reason || "Not given"]);
		fields.push([
			"What should the system power?",
			open.appliances?.length
				? open.appliances.map((a) => a[0]).join(", ")
				: "Not reached",
		]);
		fields.push(["Backup duration", open.backup || "Not reached"]);
		fields.push([
			"Monthly fuel spend",
			open.fuel ? naira(open.fuel) : "Not reached",
		]);
		fields.push(["Preferred payment", open.payment || "Not reached"]);
		fields.push([
			"Site inspection",
			open.completed
				? open.inspection
					? "Requested"
					: "Not requested"
				: "Not reached",
		]);
		fields.push([
			"Phone",
			open.phone || "Not captured (dropped before contact step)",
		]);
		fields.push(["Email", open.email || "Not captured"]);
	} else if (open.type === "Agent") {
		fields.push(["Location", open.area || ""]);
		fields.push(["Occupation", open.occupation || ""]);
		fields.push(["Phone", open.phone || ""]);
		fields.push(["Email", open.email || ""]);
		fields.push(["Why they applied", open.reason || ""]);
	} else if (open.type === "Career") {
		fields.push(["Applying for", open.role || ""]);
		fields.push(["Location", open.area || ""]);
		fields.push(["Phone", open.phone || ""]);
		fields.push(["Email", open.email || ""]);
		fields.push([
			"CV",
			open.cv ? `${open.cv} (download available below)` : "Not attached",
		]);
		fields.push(["Relevant experience", open.about || ""]);
	} else if (open.type === "Investor") {
		fields.push(["Phone", open.phone || "Not given"]);
		fields.push(["Email", open.email || "Not given"]);
		fields.push(["What they are looking for", open.message || ""]);
	} else {
		fields.push(["Email or phone", open.contact || "Not given"]);
		fields.push(["Message", open.message || ""]);
	}
	fields.push(["Received", open.when]);
	return fields;
}

export default function EnquiryDetailView({
	id,
	view,
}: EnquiryDetailViewProps) {
	const navigate = useNavigate();

	const { data: open } = useSuspenseQuery(enquiryDetailQueryOptions(id, view));

	const [title] = viewInfo(view);
	const detailFields = fieldsFor(open);

	const totalWatts = open.appliances
		? open.appliances.reduce((n, a) => n + a[2], 0)
		: 0;

	const downloadCv = () => {
		const body = `CV placeholder for ${open.name}\n\nRole applied for: ${open.role}\nLocation: ${open.area}\nPhone: ${open.phone}\nEmail: ${open.email}\nSubmitted: ${open.when}\n\n${open.about}`;
		download(`${(open.cv || "cv").replace(/\.pdf$/, "")}.txt`, body);
	};

	const detailMeta =
		open.type === "Customer"
			? open.completed
				? `Completed assessment · ${new Date(open.when).toLocaleString("en-GB")}`
				: `Abandoned assessment · last activity ${new Date(open.when).toLocaleString("en-GB")}`
			: `${open.type} enquiry · ${new Date(open.when).toLocaleString("en-GB")}`;

	const phoneHref = open.phone ? `tel:${open.phone.replace(/\s/g, "")}` : "#";
	const mailTarget =
		open.email || (open.contact?.includes("@") ? open.contact : "");
	const mailHref = mailTarget ? `mailto:${mailTarget}` : "#";

	const statusNote =
		open.phone || open.email || open.contact
			? "Contact details captured. Reach out using the details below."
			: "No contact details were captured before drop-off. Only the entered assessment data is available.";

	const handleBack = () => {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			navigate({
				to: "/enquiries",
				search: { view } as any,
			});
		}
	};

	return (
		<div className="flex flex-col gap-6 animate-gv-fade">
			<button
				type="button"
				className="inline-flex items-center gap-1.5 text-xs font-medium text-navy/60 hover:text-navy"
				onClick={handleBack}
			>
				<ArrowLeft className="size-3.5" /> Back to {title}
			</button>

			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<Badge variant="outline" className="text-xs font-semibold">
						{open.type}
					</Badge>
					<h1 className="page-title mt-2">{open.name}</h1>
					<p className="text-xs text-navy/60 sm:text-sm mt-1">{detailMeta}</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => download(`gavikina-${open.id}.csv`, csvFor([open]))}
				>
					<Download className="size-4" /> Download CSV
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
				<div className="flex flex-col gap-6">
					{open.type === "Customer" && (
						<div className="grid grid-cols-1 gap-4 rounded-2xl border border-navy/10 bg-white p-6 sm:grid-cols-3">
							<div>
								<span className="text-xs font-semibold uppercase tracking-wider text-navy/50">
									Calculated size
								</span>
								<div className="mt-1 text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
									{open.size}
								</div>
							</div>
							<div>
								<span className="text-xs font-semibold uppercase tracking-wider text-navy/50">
									Price range
								</span>
								<div className="mt-1 text-lg font-semibold tracking-tight text-amber">
									{open.price}
								</div>
							</div>
							<div>
								<span className="text-xs font-semibold uppercase tracking-wider text-navy/50">
									Fuel spend
								</span>
								<div className="mt-1 text-lg font-semibold tracking-tight text-navy">
									{open.fuel ? `${naira(open.fuel)} / mo` : "Not reached"}
								</div>
							</div>
						</div>
					)}

					<Card className="border-navy/10 shadow-xs">
						<CardContent className="p-0">
							{detailFields.map(([label, value], i) => (
								<div
									key={label}
									className={cn(
										"flex flex-wrap items-baseline justify-between gap-3 px-6 py-3.5",
										i > 0 && "border-t border-navy/10",
									)}
								>
									<span className="text-xs text-navy/60">{label}</span>
									<span className="max-w-md text-right text-sm font-medium text-navy">
										{value}
									</span>
								</div>
							))}
						</CardContent>
					</Card>

					{open.cv && (
						<div className="flex items-center gap-4 rounded-2xl border border-navy/10 bg-white p-5">
							<span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cream text-navy">
								<FileText className="size-5" />
							</span>
							<div className="flex min-w-0 flex-1 flex-col">
								<span className="truncate text-sm font-medium text-navy">
									{open.cv}
								</span>
								<span className="text-xs text-navy/50">
									CV attachment · {open.cvSize}
								</span>
							</div>
							<Button size="sm" onClick={downloadCv}>
								Download CV
							</Button>
						</div>
					)}

					{open.appliances && open.appliances.length > 0 && (
						<Card className="border-navy/10 shadow-xs">
							<CardHeader className="pb-3">
								<CardTitle className="text-base font-semibold text-navy">
									Appliances selected
								</CardTitle>
							</CardHeader>
							<CardContent className="flex flex-col gap-2">
								{open.appliances.map((a) => (
									<div
										key={a[0]}
										className="flex items-center justify-between border-b border-navy/5 pb-2 text-sm last:border-b-0"
									>
										<span className="text-navy">{a[0]}</span>
										<div className="flex items-center gap-4">
											<span className="text-xs text-navy/50">× {a[1]}</span>
											<span className="w-20 text-right tabular-nums font-medium text-navy">
												{a[2].toLocaleString()}W
											</span>
										</div>
									</div>
								))}
								<div className="mt-2 flex justify-between border-t border-navy/10 pt-3 text-sm font-semibold text-navy">
									<span>Total load</span>
									<span className="tabular-nums">
										{totalWatts.toLocaleString()}W
									</span>
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				<div className="flex flex-col gap-6">
					{open.ai && (
						<div className="rounded-2xl border border-green/30 bg-green/5 p-6">
							<span className="text-xs font-semibold uppercase tracking-wider text-green-dark">
								{open.type === "Agent"
									? "AI first read shown to applicant"
									: "AI note shown to customer"}
							</span>
							<p className="mt-2 text-sm leading-relaxed text-navy">
								{open.ai}
							</p>
						</div>
					)}

					<Card className="border-navy/10 shadow-xs">
						<CardHeader className="pb-2">
							<CardTitle className="text-base font-semibold text-navy">
								Status
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-4">
							<p className="text-xs leading-relaxed text-navy/70">
								{statusNote}
							</p>
							<div className="flex flex-col gap-2">
								<Button
									nativeButton={false}
									size="sm"
									className="w-full"
									render={<a href={phoneHref} />}
								>
									<Phone className="size-4" /> Call{" "}
									{open.phone || "unavailable"}
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="w-full"
									nativeButton={false}
									render={<a href={mailHref} />}
								>
									<Mail className="size-4" /> Send an email
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
