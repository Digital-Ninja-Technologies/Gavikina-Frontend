// Seed/sample enquiry data standing in for a real API — there is no backend
// yet. Once one exists, this module is what gets replaced by TanStack Query
// hooks calling it.

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

export const LEADS: Lead[] = [
	{
		id: "l1",
		type: "Customer",
		name: "Adaeze Okonkwo",
		property: "Home",
		reason: "Generator fuel is too expensive",
		phone: "0803 411 2288",
		email: "adaeze.okonkwo@mail.com",
		area: "Lekki, Lagos",
		appliances: [
			["LED bulbs", 8, 80],
			["Ceiling fan", 3, 225],
			["Fridge — small/medium", 1, 150],
			['TV — 43" LED', 1, 100],
			["Air conditioner — 1HP", 1, 750],
			["Wi-Fi router", 1, 15],
		],
		backup: "8 hours overnight",
		fuel: 95000,
		size: "3.5kVA",
		price: "₦2,200,000 – ₦2,800,000",
		payment: "Staged payments",
		inspection: true,
		completed: true,
		when: "18 Aug, 09:41",
		ai: "A 3.5kVA system covers the 1,320W you listed, with battery to carry you through the night without the grid. At ₦95,000 a month on fuel you are spending about ₦1.14m a year, so the system pays for itself inside three years and keeps working after that.",
	},
	{
		id: "l2",
		type: "Customer",
		name: "Ring Road Supermarket",
		property: "Business",
		reason: "Downtime is costing sales",
		phone: "0812 700 4413",
		email: "accounts@ringroadstores.ng",
		area: "Benin City, Edo",
		appliances: [
			["Display chiller", 3, 2700],
			["POS terminal + printer", 4, 800],
			["LED bulbs", 24, 240],
			["Standing fan", 4, 240],
			["Chest freezer", 2, 500],
		],
		backup: "12 hours trading day",
		fuel: 340000,
		size: "10kVA",
		price: "₦6,800,000 – ₦8,500,000",
		payment: "Financing partner",
		inspection: true,
		completed: true,
		when: "17 Aug, 16:20",
		ai: "A 10kVA system carries the 4,480W of chillers, POS and floor lighting you listed through a full trading day. Against ₦340,000 a month in fuel, the system replaces roughly ₦4.1m of annual running cost. A site inspection is required at this size before the quote is fixed.",
	},
	{
		id: "l3",
		type: "Customer",
		name: "Musa Bello",
		property: "Home",
		reason: "Grid supply is unreliable",
		phone: "0805 118 9002",
		email: "musa.bello@mail.com",
		area: "Gwarinpa, Abuja",
		appliances: [
			["LED bulbs", 6, 60],
			["Standing fan", 2, 120],
			["Fridge — small/medium", 1, 150],
			['TV — 43" LED', 1, 100],
			["Phone charging", 3, 45],
		],
		backup: "6 hours evening",
		fuel: 42000,
		size: "2.5kVA",
		price: "₦1,400,000 – ₦1,850,000",
		payment: "Full payment",
		inspection: false,
		completed: true,
		when: "16 Aug, 11:05",
		ai: "A 2.5kVA system covers the 475W you listed with room for the fridge to cycle overnight. Your ₦42,000 monthly fuel spend is about ₦504,000 a year, so the essentials cover pays back in roughly three years.",
	},
	{
		id: "l4",
		type: "Customer",
		name: "Tolu Adeyemi",
		property: "Home",
		reason: "Building a new home",
		phone: "",
		email: "",
		area: "Ogudu, Lagos",
		appliances: [
			["LED bulbs", 6, 60],
			["Ceiling fan", 2, 150],
			['TV — 43" LED', 1, 100],
		],
		backup: "4 hours essentials",
		fuel: 0,
		size: "1.5kVA",
		price: "₦850,000 – ₦1,150,000",
		payment: "",
		inspection: false,
		completed: false,
		when: "18 Aug, 08:12",
		ai: "",
	},
	{
		id: "l5",
		type: "Customer",
		name: "Unnamed visitor",
		property: "Business",
		reason: "Cutting running costs",
		phone: "",
		email: "",
		area: "Not given",
		appliances: [
			["Desktop workstation", 4, 1000],
			["LED bulbs", 12, 120],
		],
		backup: "",
		fuel: 0,
		size: "2.5kVA",
		price: "₦1,400,000 – ₦1,850,000",
		payment: "",
		inspection: false,
		completed: false,
		when: "17 Aug, 21:47",
		ai: "",
	},
	{
		id: "a1",
		type: "Agent",
		name: "Chidi Nwosu",
		phone: "0807 224 1190",
		email: "chidi.nwosu@mail.com",
		area: "Aba, Abia",
		occupation: "Electrical contractor",
		when: "17 Aug, 14:03",
		ai: "Chidi, an electrical contractor in Aba already has the trust and the site access this scheme needs. You are the newest applicant we have from Aba, so an introduction there would open ground we do not cover yet. Coming from electrical contracting, the part of the training that will matter most is load assessment.",
		reason:
			"I already wire buildings in Aba and customers keep asking me about solar. I know the estates and I can bring introductions every month.",
	},
	{
		id: "a2",
		type: "Agent",
		name: "Halima Yusuf",
		phone: "0902 555 8871",
		email: "halima.yusuf@mail.com",
		area: "Kano",
		occupation: "Estate agent",
		when: "15 Aug, 10:38",
		ai: "Halima, an estate agent in Kano is close to the decision the whole scheme depends on. You are the first applicant we have from Kano, so an introduction there would open ground we do not cover yet. Managing 40 rental units means the load assessment training will matter most for you.",
		reason:
			"I manage 40 rental units and every tenant complains about power. I want to offer solar as part of the letting.",
	},
	{
		id: "i1",
		type: "Investor",
		name: "Olumide Bakare",
		phone: "0806 900 1122",
		email: "obakare@harmattancap.com",
		when: "16 Aug, 18:55",
		message:
			"Reviewing distributed-energy operators in Nigeria. Ticket size ₦150m–₦400m, five-year horizon. Please send the full materials and last twelve months of installation volumes.",
	},
	{
		id: "i2",
		type: "Investor",
		name: "Ngozi Eze",
		phone: "",
		email: "ngozi@ezefamilyoffice.com",
		when: "14 Aug, 09:14",
		message:
			"Family office, first time in this sector. Interested in the agent network economics specifically.",
	},
	{
		id: "j1",
		type: "Career",
		name: "Emeka Obi",
		phone: "0813 220 7741",
		email: "emeka.obi@mail.com",
		area: "Surulere, Lagos",
		role: "Installation engineer",
		cv: "emeka-obi-cv.pdf",
		cvSize: "412 KB",
		when: "18 Aug, 10:26",
		about:
			"Four years wiring residential builds, two of them on solar retrofits. NABCEP entry-level certificate, comfortable on roofs and with DC protection.",
	},
	{
		id: "j2",
		type: "Career",
		name: "Blessing Aduba",
		phone: "0906 331 4180",
		email: "blessing.aduba@mail.com",
		area: "Abuja",
		role: "Open application",
		cv: "blessing-aduba-cv.pdf",
		cvSize: "268 KB",
		when: "15 Aug, 13:52",
		about:
			"Customer operations background at a solar distributor. Handled scheduling for a team of six installers and all warranty claims.",
	},
	{
		id: "c1",
		type: "Contact",
		name: "Samuel Idowu",
		contact: "samuel.idowu@mail.com",
		when: "18 Aug, 07:30",
		message:
			"Can you service a system you did not install? Mine is a 3kVA from another company and the batteries are down.",
	},
];

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

// '18 Aug, 09:41' -> sortable number (all records are August 2026)
export const TODAY = 18;
export const ts = (when?: string) => {
	const m = /^(\d+) \w+, (\d+):(\d+)$/.exec(when || "");
	return m ? Number(m[1]) * 10000 + Number(m[2]) * 100 + Number(m[3]) : 0;
};

export function rowsForView(view: string): Lead[] {
	if (view === "customers")
		return LEADS.filter((l) => l.type === "Customer" && l.completed);
	if (view === "abandoned")
		return LEADS.filter((l) => l.type === "Customer" && !l.completed);
	if (view === "agents") return LEADS.filter((l) => l.type === "Agent");
	if (view === "investors") return LEADS.filter((l) => l.type === "Investor");
	if (view === "careers") return LEADS.filter((l) => l.type === "Career");
	return LEADS;
}
