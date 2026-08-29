// Shared "Past Projects" data model — the record shape the dashboard's
// Projects module creates/edits, and the website's Projects page displays.
// There is no backend yet, so this array is the seed both apps start from;
// the dashboard additionally persists edits to its own localStorage.

export interface Project {
	id: string;
	title: string;
	location: string;
	size: string;
	category: "home" | "business";
	caseStudy: boolean;
	images: number;
	body: string;
}

export const SEED_PROJECTS: Project[] = [
	{
		id: "p1",
		title: "Lekki Phase 1 duplex",
		location: "Lekki, Lagos",
		size: "5kVA",
		category: "home",
		caseStudy: false,
		images: 3,
		body: "Full-house cover including two bedroom ACs and the borehole pump.",
	},
	{
		id: "p2",
		title: "Ikeja private clinic",
		location: "Ikeja, Lagos",
		size: "10kVA",
		category: "business",
		caseStudy: true,
		images: 5,
		body: "Ward, theatre lighting and vaccine cold chain on 24-hour autonomy.",
	},
	{
		id: "p3",
		title: "Gwarinpa family home",
		location: "Gwarinpa, Abuja",
		size: "3.5kVA",
		category: "home",
		caseStudy: false,
		images: 2,
		body: "Replaced a 3.5kVA petrol generator that was running six hours a night.",
	},
	{
		id: "p4",
		title: "Ring Road supermarket",
		location: "Benin City, Edo",
		size: "10kVA",
		category: "business",
		caseStudy: false,
		images: 4,
		body: "Display chillers, POS and floor lighting through the full trading day.",
	},
	{
		id: "p5",
		title: "Ogudu terrace",
		location: "Ogudu, Lagos",
		size: "2.5kVA",
		category: "home",
		caseStudy: false,
		images: 2,
		body: "Essentials backup: lights, fans, fridge, TV and charging.",
	},
	{
		id: "p6",
		title: "Wuse tailoring workshop",
		location: "Wuse, Abuja",
		size: "5kVA",
		category: "business",
		caseStudy: false,
		images: 2,
		body: "Six industrial machines plus pressing irons on staged loads.",
	},
];
