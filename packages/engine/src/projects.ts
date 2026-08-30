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
