// Gavikina Energy — shared sizing engine.
// Single source of truth for appliance wattages, system tiers, and the
// sizing/fuel-comparison math. Consumed by the website's Solar Calculator
// and Lead Qualifier, and by the dashboard's Overview stats and Projects form.

export interface Appliance {
	id: string;
	name: string;
	category: string;
	typical_wattage: number;
	default_quantity: number;
}

export interface Tier {
	id: string;
	name: string;
	size_kva: number;
	price_range_min: number;
	price_range_max: number;
	typically_powers: string[];
	notes: string;
}

export interface BackupOption {
	id: string;
	label: string;
	hours: number;
	note: string;
}

export interface Reason {
	id: string;
	label: string;
}

export interface PaymentMethod {
	id: string;
	label: string;
}

export type Selection = Record<string, number>;

export const APPLIANCES: Appliance[] = [
	{
		id: "led",
		name: "LED bulbs",
		category: "Lighting",
		typical_wattage: 10,
		default_quantity: 0,
	},
	{
		id: "seclight",
		name: "Security lights",
		category: "Lighting",
		typical_wattage: 100,
		default_quantity: 0,
	},
	{
		id: "fanstand",
		name: "Standing fan",
		category: "Cooling",
		typical_wattage: 60,
		default_quantity: 0,
	},
	{
		id: "fanceil",
		name: "Ceiling fan",
		category: "Cooling",
		typical_wattage: 75,
		default_quantity: 0,
	},
	{
		id: "ac1",
		name: "Air conditioner — 1HP",
		category: "Cooling",
		typical_wattage: 750,
		default_quantity: 0,
	},
	{
		id: "ac15",
		name: "Air conditioner — 1.5HP",
		category: "Cooling",
		typical_wattage: 1200,
		default_quantity: 0,
	},
	{
		id: "tv",
		name: 'TV — 43" LED',
		category: "Living",
		typical_wattage: 100,
		default_quantity: 0,
	},
	{
		id: "decoder",
		name: "Decoder / set-top box",
		category: "Living",
		typical_wattage: 30,
		default_quantity: 0,
	},
	{
		id: "router",
		name: "Wi-Fi router",
		category: "Living",
		typical_wattage: 15,
		default_quantity: 0,
	},
	{
		id: "laptop",
		name: "Laptop",
		category: "Living",
		typical_wattage: 65,
		default_quantity: 0,
	},
	{
		id: "phones",
		name: "Phone charging",
		category: "Living",
		typical_wattage: 15,
		default_quantity: 0,
	},
	{
		id: "fridge",
		name: "Fridge — small/medium",
		category: "Kitchen",
		typical_wattage: 150,
		default_quantity: 0,
	},
	{
		id: "freezer",
		name: "Chest freezer",
		category: "Kitchen",
		typical_wattage: 250,
		default_quantity: 0,
	},
	{
		id: "dispenser",
		name: "Water dispenser",
		category: "Kitchen",
		typical_wattage: 550,
		default_quantity: 0,
	},
	{
		id: "blender",
		name: "Blender",
		category: "Kitchen",
		typical_wattage: 400,
		default_quantity: 0,
	},
	{
		id: "microwave",
		name: "Microwave",
		category: "Kitchen",
		typical_wattage: 1200,
		default_quantity: 0,
	},
	{
		id: "iron",
		name: "Electric iron",
		category: "Utility",
		typical_wattage: 1000,
		default_quantity: 0,
	},
	{
		id: "washer",
		name: "Washing machine",
		category: "Utility",
		typical_wattage: 500,
		default_quantity: 0,
	},
	{
		id: "pump",
		name: "Water pump",
		category: "Utility",
		typical_wattage: 750,
		default_quantity: 0,
	},
	{
		id: "pos",
		name: "POS terminal + printer",
		category: "Business",
		typical_wattage: 200,
		default_quantity: 0,
	},
	{
		id: "desktop",
		name: "Desktop workstation",
		category: "Business",
		typical_wattage: 250,
		default_quantity: 0,
	},
	{
		id: "coldroom",
		name: "Display chiller",
		category: "Business",
		typical_wattage: 900,
		default_quantity: 0,
	},
];

// Indicative pricing — pending client confirmation.
export const TIERS: Tier[] = [
	{
		id: "t15",
		name: "1.5kVA",
		size_kva: 1.5,
		price_range_min: 850000,
		price_range_max: 1150000,
		typically_powers: [
			"Lights and fans",
			"TV and decoder",
			"Phone and laptop charging",
			"Wi-Fi router",
		],
		notes: "Essentials backup for a small flat or shop.",
	},
	{
		id: "t25",
		name: "2.5kVA",
		size_kva: 2.5,
		price_range_min: 1400000,
		price_range_max: 1850000,
		typically_powers: [
			"Everything in 1.5kVA",
			"Fridge or freezer",
			"Water pump",
			"Small office equipment",
		],
		notes: "The common choice for a two-bedroom home.",
	},
	{
		id: "t35",
		name: "3.5kVA",
		size_kva: 3.5,
		price_range_min: 2200000,
		price_range_max: 2800000,
		typically_powers: [
			"Everything in 2.5kVA",
			"One 1HP air conditioner",
			"Freezer plus fridge",
			"Iron in short bursts",
		],
		notes: "Comfortable whole-home cover with one AC.",
	},
	{
		id: "t5",
		name: "5kVA",
		size_kva: 5,
		price_range_min: 3400000,
		price_range_max: 4200000,
		typically_powers: [
			"Everything in 3.5kVA",
			"Two air conditioners",
			"Microwave and washing machine",
			"Busy retail floor",
		],
		notes: "Larger homes and small businesses.",
	},
	{
		id: "t10",
		name: "10kVA",
		size_kva: 10,
		price_range_min: 6800000,
		price_range_max: 8500000,
		typically_powers: [
			"Multiple ACs",
			"Display chillers and cold storage",
			"Full office floor",
			"Light workshop tools",
		],
		notes: "Business-grade. Site inspection required before quoting.",
	},
];

export const SIZE_TIERS = TIERS.map((t) => t.name);

export const INCLUDED = [
	"Solar panels",
	"Hybrid inverter",
	"Lithium battery bank",
	"Roof or ground mounting",
	"Surge and lightning protection",
	"DC and AC cabling",
	"Installation labour",
	"Commissioning and handover",
];

export const BACKUP_OPTIONS: BackupOption[] = [
	{ id: "4h", label: "4 hours", hours: 4, note: "Evening cover" },
	{ id: "8h", label: "8 hours", hours: 8, note: "Overnight" },
	{ id: "12h", label: "12 hours", hours: 12, note: "Half a day" },
	{ id: "24h", label: "24 hours", hours: 24, note: "Full day, no grid" },
];

export const REASONS: Reason[] = [
	{ id: "outage", label: "Grid supply is unreliable" },
	{ id: "fuel", label: "Generator fuel is too expensive" },
	{ id: "noise", label: "Generator noise and fumes" },
	{ id: "business", label: "Downtime is costing the business" },
	{ id: "clean", label: "Moving to cleaner energy" },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
	{ id: "full", label: "Full payment upfront" },
	{ id: "stages", label: "Staged payment" },
	{ id: "finance", label: "Financing / instalments" },
	{ id: "advise", label: "Not sure — advise me" },
];

export const CATEGORIES = [...new Set(APPLIANCES.map((a) => a.category))];

export const fmt = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;
export const fmtRange = (t: Tier) =>
	`${fmt(t.price_range_min)} – ${fmt(t.price_range_max)}`;

export interface CalculatorFormula {
	// Safety margin applied on top of measured peak load, e.g. 1.3 = 30% headroom.
	headroom: number;
	// Inverter power factor used to convert watts to kVA.
	powerFactor: number;
	// Extra capacity required when 12h+ backup is requested, e.g. 1.15 = 15% more.
	longBackupBoost: number;
}

export const DEFAULT_FORMULA: CalculatorFormula = {
	headroom: 1.3,
	powerFactor: 0.8,
	longBackupBoost: 1.15,
};

export function watts(
	selection: Selection,
	appliances: Appliance[] = APPLIANCES,
): number {
	return appliances.reduce(
		(sum, a) => sum + (selection[a.id] || 0) * a.typical_wattage,
		0,
	);
}

// Peak load + headroom, converted at the configured power factor.
export function size(
	selection: Selection,
	backupHours?: number,
	appliances: Appliance[] = APPLIANCES,
	tiers: Tier[] = TIERS,
	formula: CalculatorFormula = DEFAULT_FORMULA,
) {
	const w = watts(selection, appliances);
	const requiredKva =
		w === 0 ? 0 : (w * formula.headroom) / formula.powerFactor / 1000;
	const long = !!backupHours && backupHours >= 12;
	const target = long ? requiredKva * formula.longBackupBoost : requiredKva;
	const tier =
		tiers.find((t) => t.size_kva >= target) || tiers[tiers.length - 1];
	return { watts: w, requiredKva, tier: w === 0 ? null : tier };
}

export interface FuelComparison {
	monthlySpend: number;
	annualSpend: number;
	fiveYearSpend: number;
	systemMid: number;
	paybackMonths: number;
	fiveYearSaving: number;
}

// Rough monthly saving: fuel spend avoided, against amortised system midpoint over 7 years.
export function fuelCompare(
	monthlySpend: number,
	tier: Tier | null,
): FuelComparison | null {
	if (!tier || !monthlySpend) return null;
	const mid = (tier.price_range_min + tier.price_range_max) / 2;
	const months = mid / monthlySpend;
	return {
		monthlySpend,
		annualSpend: monthlySpend * 12,
		fiveYearSpend: monthlySpend * 60,
		systemMid: mid,
		paybackMonths: Math.round(months),
		fiveYearSaving: Math.max(0, monthlySpend * 60 - mid),
	};
}
