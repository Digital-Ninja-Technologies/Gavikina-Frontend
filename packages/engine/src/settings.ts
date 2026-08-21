// Admin-editable overrides for the calculator's tunable parameters (appliance
// wattages, tier pricing, sizing formula constants). Persisted to localStorage —
// the dashboard and website share an origin (the dashboard is proxied under
// /dashboard on the same domain), so a save in the admin settings page is
// picked up by the public calculator without a real backend.

import { useEffect, useState } from 'react';
import { APPLIANCES, DEFAULT_FORMULA, TIERS, size, watts } from './sizing';
import type { Appliance, CalculatorFormula, Selection, Tier } from './sizing';

export interface ApplianceOverride {
  typical_wattage: number;
  default_quantity: number;
}

export interface TierOverride {
  price_range_min: number;
  price_range_max: number;
}

export interface CalculatorSettings {
  formula: CalculatorFormula;
  appliances: Record<string, ApplianceOverride>;
  tiers: Record<string, TierOverride>;
}

const STORAGE_KEY = 'gv-calculator-settings-v1';

export function defaultCalculatorSettings(): CalculatorSettings {
  return {
    formula: { ...DEFAULT_FORMULA },
    appliances: Object.fromEntries(
      APPLIANCES.map((a) => [a.id, { typical_wattage: a.typical_wattage, default_quantity: a.default_quantity }])
    ),
    tiers: Object.fromEntries(TIERS.map((t) => [t.id, { price_range_min: t.price_range_min, price_range_max: t.price_range_max }])),
  };
}

function readStored(): Partial<CalculatorSettings> | null {
  if (typeof window === 'undefined') return null;
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
      APPLIANCES.map((a) => [a.id, { ...defaults.appliances[a.id], ...stored.appliances?.[a.id] }])
    ),
    tiers: Object.fromEntries(TIERS.map((t) => [t.id, { ...defaults.tiers[t.id], ...stored.tiers?.[t.id] }])),
  };
}

export function saveCalculatorSettings(settings: CalculatorSettings) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* storage unavailable */
  }
}

export function resetCalculatorSettings() {
  if (typeof window === 'undefined') return;
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
  const settings = loadCalculatorSettings();
  return TIERS.map((t) => ({ ...t, ...settings.tiers[t.id] }));
}

export function getEffectiveFormula(): CalculatorFormula {
  return loadCalculatorSettings().formula;
}

export function effectiveWatts(selection: Selection): number {
  return watts(selection, getEffectiveAppliances());
}

export function effectiveSize(selection: Selection, backupHours?: number) {
  return size(selection, backupHours, getEffectiveAppliances(), getEffectiveTiers(), getEffectiveFormula());
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
