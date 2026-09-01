import type { Appliance } from "@workspace/engine";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@workspace/ui/components/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@workspace/ui/components/table";
import { Pencil, Plus, Zap } from "lucide-react";
import { openDialog } from "@/store/dialog-store";

export function AppliancesSection({ appliances }: { appliances: Appliance[] }) {
	return (
		<Card className="border-navy/10 shadow-xs">
			<CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-navy">
						<Zap className="size-5 text-amber" />
						<CardTitle className="text-base font-semibold">
							Appliance Catalog &amp; Defaults
						</CardTitle>
					</div>
					<CardDescription className="text-xs text-navy/60 sm:text-sm">
						Default appliances and baseline wattages selectable in the public
						load calculator.
					</CardDescription>
				</div>

				<Button
					type="button"
					size="sm"
					variant="outline"
					onClick={() => openDialog("APPLIANCE_FORM")}
				>
					<Plus /> Add Appliance
				</Button>
			</CardHeader>

			<CardContent>
				<Table>
					<TableHeader className="bg-muted/40">
						<TableRow>
							<TableHead className="text-xs font-semibold uppercase tracking-wider text-navy/60">
								Appliance
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wider text-navy/60">
								Category
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wider text-navy/60">
								Typical Wattage
							</TableHead>
							<TableHead className="text-xs font-semibold uppercase tracking-wider text-navy/60">
								Default Qty
							</TableHead>
							<TableHead className="w-16 text-right text-xs font-semibold uppercase tracking-wider text-navy/60">
								Edit
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{appliances.map((a) => (
							<TableRow key={a.id} className="hover:bg-cream/30">
								<TableCell className="font-medium text-navy">
									{a.name}
								</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className="bg-navy/5 text-xs capitalize text-navy/70 border-navy/10"
									>
										{a.category.replace("_", " ")}
									</Badge>
								</TableCell>
								<TableCell className="tabular-nums font-medium text-navy">
									{a.typical_wattage.toLocaleString()} W
								</TableCell>
								<TableCell className="tabular-nums text-navy/70">
									{a.default_quantity}
								</TableCell>
								<TableCell className="text-right">
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										aria-label={`Edit ${a.name}`}
										onClick={() =>
											openDialog("APPLIANCE_FORM", { applianceId: a.id })
										}
									>
										<Pencil className="size-3.5 text-navy/60" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
