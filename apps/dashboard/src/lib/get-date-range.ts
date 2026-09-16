export function getStableDateRange(to = 7) {
	const end = new Date();
	const start = new Date();
	start.setDate(end.getDate() - to);

	const startDate = start.toLocaleDateString("en-CA");
	const endDate = end.toLocaleDateString("en-CA");

	const label = `${start.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
	})} – ${end.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	})}`;

	return { startDate, endDate, label };
}