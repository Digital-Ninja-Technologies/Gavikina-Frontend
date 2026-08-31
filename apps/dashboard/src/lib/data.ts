export type LeadType = "Customer" | "Agent" | "Investor" | "Career" | "Contact";

export interface Lead {
	id: string;
	type: LeadType;
	name: string;
	phone?: string;
	email?: string;
	contact?: string;
	area?: string;
	when: string;
	// Customer
	property?: string;
	reason?: string;
	appliances?: [string, number, number][];
	backup?: string;
	fuel?: number;
	size?: string;
	price?: string;
	payment?: string;
	inspection?: boolean;
	completed?: boolean;
	ai?: string;
	// Agent
	occupation?: string;
	// Career
	role?: string;
	cv?: string;
	cvSize?: string;
	about?: string;
	// Investor / Contact
	message?: string;
}

export const VIEWS = {
	all: ["All enquiries", "Everything received across the site, newest first."],
	customers: [
		"Customer enquiries",
		"Completed assessments with contact details captured.",
	],
	agents: ["Agent applications", "Kept separate from customer enquiries."],
	investors: [
		"Investor enquiries",
		"Materials are sent manually after review.",
	],
	abandoned: [
		"Abandoned assessments",
		"Started the assessment but did not finish. Whatever was entered is kept.",
	],
	careers: [
		"Job applications",
		"Submitted from the Careers page, with CV attached.",
	],
} satisfies Record<string, [string, string]>;

export function viewInfo(view: string): [string, string] {
	return (
		(VIEWS as Record<string, [string, string] | undefined>)[view] ?? VIEWS.all
	);
}

export const naira = (n?: number) =>
	"₦" + Number(n || 0).toLocaleString("en-NG");