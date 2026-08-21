import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { APPLIANCES, defaultCalculatorSettings, loadCalculatorSettings, newTier, resetCalculatorSettings, saveCalculatorSettings } from '@gavikina/engine';
import { calculatorSettingsSchema } from '@gavikina/schemas';
import type { CalculatorSettingsValues } from '@gavikina/schemas';
import { Field, Input } from '@gavikina/ui';

const cellInput = 'w-full rounded-lg border border-navy/16 bg-white px-2.5 py-1.5 text-[13px] text-navy focus:outline-none focus:ring-2 focus:ring-green/40';

export default function CalculatorSettings() {
  const [saved, setSaved] = useState(false);

  const form = useForm<CalculatorSettingsValues>({
    resolver: zodResolver(calculatorSettingsSchema),
    defaultValues: loadCalculatorSettings(),
  });

  const tierFields = useFieldArray({ control: form.control, name: 'tiers' });

  const onSubmit = form.handleSubmit((values) => {
    saveCalculatorSettings(values);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  });

  const onReset = () => {
    resetCalculatorSettings();
    const defaults = defaultCalculatorSettings();
    form.reset(defaults);
    setSaved(false);
  };

  const errors = form.formState.errors;

  return (
    <div className="animate-gv-fade">
      <h1 className="m-0 text-[27px] font-semibold tracking-tight">Calculator settings</h1>
      <p className="mt-2 max-w-165 text-sm text-navy/58">
        Tune the numbers behind the public Solar Calculator and Full Assessment — appliance wattages, system tiers,
        and the sizing formula. Changes apply immediately on the live site.
      </p>

      <form onSubmit={onSubmit} noValidate>
        <div className="mt-6 rounded-2xl border border-navy/10 bg-white p-6">
          <h2 className="m-0 text-base font-semibold tracking-tight">Sizing formula</h2>
          <p className="mt-1.5 text-[12.5px] text-navy/55">
            Required kVA is calculated as <span className="font-medium">(peak watts × headroom) ÷ power factor</span>, then
            boosted further for backup runs of 12 hours or more.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-4 max-[640px]:grid-cols-1">
            <Field label="Headroom multiplier" error={errors.formula?.headroom?.message}>
              <Input type="number" step="0.01" min="1" max="2" {...form.register('formula.headroom', { valueAsNumber: true })} />
              <span className="text-[11.5px] text-navy/50">1.3 = 30% safety margin above measured load</span>
            </Field>
            <Field label="Power factor" error={errors.formula?.powerFactor?.message}>
              <Input type="number" step="0.01" min="0.1" max="1" {...form.register('formula.powerFactor', { valueAsNumber: true })} />
              <span className="text-[11.5px] text-navy/50">Inverter efficiency, 0–1</span>
            </Field>
            <Field label="Long-backup boost" error={errors.formula?.longBackupBoost?.message}>
              <Input type="number" step="0.01" min="1" max="2" {...form.register('formula.longBackupBoost', { valueAsNumber: true })} />
              <span className="text-[11.5px] text-navy/50">Applied when 12h+ backup is requested</span>
            </Field>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-navy/10 bg-white p-6">
          <h2 className="m-0 text-base font-semibold tracking-tight">Appliance wattages</h2>
          <p className="mt-1.5 text-[12.5px] text-navy/55">Typical draw and default quantity shown in the calculator's appliance list.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-150 border-collapse">
              <thead>
                <tr className="border-b border-navy/10">
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-navy/45">Appliance</th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-navy/45">Category</th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-navy/45">Typical watts</th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-navy/45">Default qty</th>
                </tr>
              </thead>
              <tbody>
                {APPLIANCES.map((a) => (
                  <tr key={a.id} className="border-b border-navy/6 last:border-b-0">
                    <td className="px-3 py-2 text-[13.5px] font-medium">{a.name}</td>
                    <td className="px-3 py-2 text-[12.5px] text-navy/55">{a.category}</td>
                    <td className="w-32 px-3 py-2">
                      <input
                        type="number"
                        min={1}
                        max={20000}
                        className={cellInput}
                        {...form.register(`appliances.${a.id}.typical_wattage`, { valueAsNumber: true })}
                      />
                    </td>
                    <td className="w-28 px-3 py-2">
                      <input
                        type="number"
                        min={0}
                        max={50}
                        className={cellInput}
                        {...form.register(`appliances.${a.id}.default_quantity`, { valueAsNumber: true })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-navy/10 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="m-0 text-base font-semibold tracking-tight">System tiers</h2>
              <p className="mt-1.5 text-[12.5px] text-navy/55">Shown on the Catalogue, homepage, and calculator result. Add or remove tiers as your product line changes.</p>
            </div>
            <button
              type="button"
              onClick={() => tierFields.append(newTier())}
              className="rounded-xl border-0 bg-green px-4 py-2.25 text-[13px] font-semibold text-white hover:bg-green-dark"
            >
              Add a tier
            </button>
          </div>
          {errors.tiers?.root?.message && <p className="mt-3 text-[12.5px] text-red-600">{errors.tiers.root.message}</p>}
          {typeof errors.tiers?.message === 'string' && <p className="mt-3 text-[12.5px] text-red-600">{errors.tiers.message}</p>}

          <div className="mt-4 flex flex-col gap-3.5">
            {tierFields.fields.map((field, index) => {
              const tierErrors = errors.tiers?.[index];
              return (
                <div key={field.id} className="rounded-xl border border-navy/12 bg-[#FBFAF8] p-4">
                  <div className="grid grid-cols-[minmax(0,1.4fr)_110px_150px_150px_auto] items-start gap-3 max-[760px]:grid-cols-2">
                    <Field label="Tier name" error={tierErrors?.name?.message}>
                      <input className={cellInput} {...form.register(`tiers.${index}.name`)} />
                    </Field>
                    <Field label="Size (kVA)" error={tierErrors?.size_kva?.message}>
                      <input type="number" step="0.1" min={0.1} className={cellInput} {...form.register(`tiers.${index}.size_kva`, { valueAsNumber: true })} />
                    </Field>
                    <Field label="Price min (₦)" error={tierErrors?.price_range_min?.message}>
                      <input type="number" min={0} className={cellInput} {...form.register(`tiers.${index}.price_range_min`, { valueAsNumber: true })} />
                    </Field>
                    <Field label="Price max (₦)" error={tierErrors?.price_range_max?.message}>
                      <input type="number" min={0} className={cellInput} {...form.register(`tiers.${index}.price_range_max`, { valueAsNumber: true })} />
                    </Field>
                    <div className="flex h-full items-end pb-0.5 max-[760px]:justify-end">
                      <button
                        type="button"
                        onClick={() => tierFields.remove(index)}
                        disabled={tierFields.fields.length <= 1}
                        aria-label={`Delete ${field.name || 'tier'}`}
                        className="rounded-lg border border-red-200 bg-white px-3 py-2 text-[12.5px] font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
                    <Field label="Typically powers (comma-separated)">
                      <Controller
                        control={form.control}
                        name={`tiers.${index}.typically_powers`}
                        render={({ field: f }) => (
                          <input
                            className={cellInput}
                            value={f.value.join(', ')}
                            onChange={(e) => f.onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                            placeholder="Lights and fans, TV and decoder"
                          />
                        )}
                      />
                    </Field>
                    <Field label="Notes">
                      <input className={cellInput} {...form.register(`tiers.${index}.notes`)} placeholder="Shown as a one-line description" />
                    </Field>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button type="submit" className="rounded-xl border-0 bg-green px-4.5 py-2.75 text-[13.5px] font-semibold text-white hover:bg-green-dark">
            Save changes
          </button>
          <button type="button" onClick={onReset} className="rounded-xl border border-navy/16 bg-white px-4.5 py-2.75 text-[13.5px] font-medium hover:bg-cream">
            Reset to defaults
          </button>
          {saved && <span className="text-[13px] font-medium text-green">Saved — live on the site now.</span>}
        </div>
      </form>
    </div>
  );
}
