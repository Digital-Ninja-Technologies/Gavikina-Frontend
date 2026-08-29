// Admin-editable overrides for the calculator's tunable parameters (appliance
// wattages, tier pricing, sizing formula constants). Persisted to localStorage —
// the dashboard and website share an origin (the dashboard is proxied under
// /dashboard on the same domain), so a save in the admin settings page is
// picked up by the public calculator without a real backend.

import { useEffect, useState } from "react";
import type { Appliance, CalculatorFormula, Selection, Tier } from "./sizing";
import { APPLIANCES, DEFAULT_FORMULA, size, TIERS, watts } from "./sizing";

export interface ApplianceOverride {
	typical_wattage: number;
	default_quantity: number;
}

export interface CalculatorSettings {
	formula: CalculatorFormula;
	appliances: Record<string, ApplianceOverride>;
	// The full tier list — unlike appliances, admins can add and remove tiers,
	// not just tune existing ones, so this is stored as a plain list rather
	// than a fixed-id override map.
	tiers: Tier[];
}

const STORAGE_KEY = "gv-calculator-settings-v1";

export function defaultCalculatorSettings(): CalculatorSettings {
	return {
		formula: { ...DEFAULT_FORMULA },
		appliances: Object.fromEntries(
			APPLIANCES.map((a) => [
				a.id,
				{
					typical_wattage: a.typical_wattage,
					default_quantity: a.default_quantity,
				},
			]),
		),
		tiers: TIERS.map((t) => ({ ...t })),
	};
}

function readStored(): Partial<CalculatorSettings> | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}

export function loadCalculatorSettings(): CalculatorSettings {
	const defaults = defaultCalculatorSettings();
	const stored = readStored();
	if (!stored) return defaults;
	return {
		formula: { ...defaults.formula, ...stored.formula },
		appliances: Object.fromEntries(
			APPLIANCES.map((a) => [
				a.id,
				{ ...defaults.appliances[a.id], ...stored.appliances?.[a.id] },
			]),
		),
		tiers:
			Array.isArray(stored.tiers) && stored.tiers.length > 0
				? stored.tiers
				: defaults.tiers,
	};
}

export function saveCalculatorSettings(settings: CalculatorSettings) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
	} catch {
		/* storage unavailable */
	}
}

export function newTier(): Tier {
	return {
		id: "t" + Date.now(),
		name: "",
		size_kva: 0,
		price_range_min: 0,
		price_range_max: 0,
		typically_powers: [],
		notes: "",
	};
}

export function resetCalculatorSettings() {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.removeItem(STORAGE_KEY);
	} catch {
		/* storage unavailable */
	}
}

export function getEffectiveAppliances(): Appliance[] {
	const settings = loadCalculatorSettings();
	return APPLIANCES.map((a) => ({ ...a, ...settings.appliances[a.id] }));
}

export function getEffectiveTiers(): Tier[] {
	// Sorted ascending by size — size() picks the first tier whose size_kva
	// covers the target load, so admin-added tiers must slot in correctly
	// regardless of the order they were saved in.
	return [...loadCalculatorSettings().tiers].sort(
		(a, b) => a.size_kva - b.size_kva,
	);
}

export function getEffectiveFormula(): CalculatorFormula {
	return loadCalculatorSettings().formula;
}

export function effectiveWatts(selection: Selection): number {
	return watts(selection, getEffectiveAppliances());
}

export function effectiveSize(selection: Selection, backupHours?: number) {
	return size(
		selection,
		backupHours,
		getEffectiveAppliances(),
		getEffectiveTiers(),
		getEffectiveFormula(),
	);
}

// SSR-safe: renders the static defaults on first paint (matching server output),
// then swaps in any admin-saved overrides once mounted on the client.
export function useCalculatorAppliances(): Appliance[] {
	const [appliances, setAppliances] = useState<Appliance[]>(APPLIANCES);
	useEffect(() => setAppliances(getEffectiveAppliances()), []);
	return appliances;
}

export function useCalculatorTiers(): Tier[] {
	const [tiers, setTiers] = useState<Tier[]>(TIERS);
	useEffect(() => setTiers(getEffectiveTiers()), []);
	return tiers;
}
