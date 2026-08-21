import { z } from 'zod';
import { APPLIANCES, TIERS } from '@gavikina/engine';

// The dashboard's Calculator Settings form validates against this — same
// shape @gavikina/engine's saveCalculatorSettings() persists.
export const calculatorFormulaSchema = z.object({
  headroom: z.number().min(1, 'Must be at least 1').max(2, 'Must be 2 or less'),
  powerFactor: z.number().min(0.1, 'Must be greater than 0').max(1, 'Must be 1 or less'),
  longBackupBoost: z.number().min(1, 'Must be at least 1').max(2, 'Must be 2 or less'),
});

const applianceOverrideSchema = z.object({
  typical_wattage: z.number().min(1, 'Must be at least 1W').max(20000, 'That seems too high'),
  default_quantity: z.number().int().min(0, 'Cannot be negative').max(50, 'That seems too high'),
});

const tierOverrideSchema = z
  .object({
    price_range_min: z.number().min(0, 'Cannot be negative'),
    price_range_max: z.number().min(0, 'Cannot be negative'),
  })
  .refine((v) => v.price_range_max >= v.price_range_min, {
    message: 'Max must be at least the min',
    path: ['price_range_max'],
  });

export const calculatorSettingsSchema = z.object({
  formula: calculatorFormulaSchema,
  appliances: z.object(Object.fromEntries(APPLIANCES.map((a) => [a.id, applianceOverrideSchema]))),
  tiers: z.object(Object.fromEntries(TIERS.map((t) => [t.id, tierOverrideSchema]))),
});
export type CalculatorSettingsValues = z.infer<typeof calculatorSettingsSchema>;
