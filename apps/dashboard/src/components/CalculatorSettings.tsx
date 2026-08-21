import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { APPLIANCES, TIERS, defaultCalculatorSettings, loadCalculatorSettings, resetCalculatorSettings, saveCalculatorSettings } from '@gavikina/engine';
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

  const onSubmit = form.handleSubmit((values) => {
    saveCalculatorSettings(values);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  });

  const onReset = () => {
    resetCalculatorSettings();
    form.reset(defaultCalculatorSettings());
    setSaved(false);
  };

  const errors = form.formState.errors;

  return (
    <div className="animate-gv-fade">
      <h1 className="m-0 text-[27px] font-semibold tracking-tight">Calculator settings</h1>
      <p className="mt-2 max-w-165 text-sm text-navy/58">
        Tune the numbers behind the public Solar Calculator and Full Assessment — appliance wattages, system tier
        pricing, and the sizing formula. Changes apply immediately on the live site.
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
          <h2 className="m-0 text-base font-semibold tracking-tight">System tier pricing</h2>
          <p className="mt-1.5 text-[12.5px] text-navy/55">Indicative price ranges shown on the Catalogue, homepage, and calculator result.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-120 border-collapse">
              <thead>
                <tr className="border-b border-navy/10">
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-navy/45">Tier</th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-navy/45">Size</th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-navy/45">Price min (₦)</th>
                  <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-navy/45">Price max (₦)</th>
                </tr>
              </thead>
              <tbody>
                {TIERS.map((t) => (
                  <tr key={t.id} className="border-b border-navy/6 last:border-b-0">
                    <td className="px-3 py-2 text-[13.5px] font-medium">{t.name}</td>
                    <td className="px-3 py-2 text-[12.5px] text-navy/55">{t.size_kva}kVA</td>
                    <td className="w-40 px-3 py-2">
                      <input type="number" min={0} className={cellInput} {...form.register(`tiers.${t.id}.price_range_min`, { valueAsNumber: true })} />
                      {errors.tiers?.[t.id]?.price_range_max && (
                        <span className="mt-1 block text-[11px] text-red-600">{errors.tiers[t.id]?.price_range_max?.message}</span>
                      )}
                    </td>
                    <td className="w-40 px-3 py-2">
                      <input type="number" min={0} className={cellInput} {...form.register(`tiers.${t.id}.price_range_max`, { valueAsNumber: true })} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
