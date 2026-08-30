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
	{ id: "staged", label: "Staged payment" },
	{ id: "financing", label: "Financing / instalments" },
	{ id: "not_sure", label: "Not sure — advise me" },
];

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
