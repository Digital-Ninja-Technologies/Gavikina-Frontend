import type { CalculatorFormula } from "@workspace/engine";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import { FormInput } from "@workspace/ui/components/form-fields";
import { Sliders } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function SizingFormulaCard() {
	const { control } = useFormContext<CalculatorFormula>();

	return (
		<Card className="border-navy/10 shadow-xs">
			<CardHeader className="gap-3">
				<div className="flex items-center gap-2 text-navy">
					<Sliders className="size-5 text-green" />
					<CardTitle className="text-base font-semibold">
						Sizing Formula Calibration
					</CardTitle>
				</div>
				<CardDescription className="text-xs text-navy/60 sm:text-sm max-w-4xl leading-relaxed">
					System sizing is calculated as{" "}
					<code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-navy">
						(peak watts × headroom) ÷ power factor
					</code>
					, with an additional multiplier applied for backup requirements of 12
					hours or more.
				</CardDescription>
			</CardHeader>

			<CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-3">
				<div className="space-y-1">
					<FormInput
						control={control}
						name="headroom"
						type="number"
						step="0.05"
						label="Headroom Multiplier"
						placeholder="1.30"
						description="1.30 represents a 30% safety margin above total connected load."
					/>
				</div>

				<div className="space-y-1">
					<FormInput
						control={control}
						name="powerFactor"
						type="number"
						step="0.05"
						label="Inverter Power Factor"
						placeholder="0.80"
						description="Standard pure sine wave inverter efficiency factor (0.1 to 1.0)."
					/>
				</div>

				<div className="space-y-1">
					<FormInput
						control={control}
						name="longBackupBoost"
						type="number"
						step="0.05"
						label="Long Backup Boost"
						placeholder="1.15"
						description="Capacity multiplier applied when users select 12h+ autonomy."
					/>
				</div>
			</CardContent>
		</Card>
	);
}
