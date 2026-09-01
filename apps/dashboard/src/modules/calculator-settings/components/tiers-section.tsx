import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Tier } from "@workspace/engine";
import { fmt } from "@workspace/engine";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { toast } from "@workspace/ui/components/toast";
import { Layers, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { useConfirm } from "#/components/confirm-provider";
import { deleteTierApi } from "#/modules/catalogue/api";
import { catalogueKeys } from "#/modules/catalogue/query-options";
import { openDialog } from "@/store/dialog-store";

export function TiersSection({ tiers }: { tiers: Tier[] }) {
	const queryClient = useQueryClient();
	const confirm = useConfirm();

	const deleteMutation = useMutation({
		mutationFn: deleteTierApi,
		onSuccess: () => {
			toast.add({
				title: "Tier Deleted",
				description: "System tier has been removed from the catalogue.",
				type: "success",
			});
			queryClient.invalidateQueries({ queryKey: catalogueKeys.tiers() });
		},
		onError: (error) => {
			toast.add({
				title: "Unable to Delete",
				description: error.message || "There was a problem deleting this tier.",
				type: "error",
			});
		},
	});

	const handleEdit = (id: string) => {
		openDialog("TIER_FORM", { tierId: id });
	};

	const handleDelete = async (tier: Tier) => {
		const isConfirmed = await confirm({
			title: `Delete ${tier.name}?`,
			description:
				"This will permanently remove this tier from the product catalogue. This action cannot be undone.",
			confirmText: "Delete Tier",
			variant: "destructive",
		});

		if (isConfirmed) {
			deleteMutation.mutate(tier.id);
		}
	};

	return (
		<Card className="border-navy/10 shadow-xs">
			<CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-navy">
						<Layers className="size-5 text-green" />
						<CardTitle className="text-base font-semibold">
							System Tiers &amp; Pricing Models
						</CardTitle>
					</div>
					<CardDescription className="text-xs text-navy/60 sm:text-sm leading-relaxed">
						Available installation sizes matched during assessment and displayed
						in the product catalogue.
					</CardDescription>
				</div>

				<Button type="button" size="sm" onClick={() => openDialog("TIER_FORM")}>
					<Plus /> Add Tier
				</Button>
			</CardHeader>

			<CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				{tiers.map((t) => (
					<Card
						key={t.id}
						className="py-4 gap-4 group relative flex flex-col justify-between border-navy/10 bg-white shadow-xs transition-all hover:border-navy/25 hover:shadow-md"
					>
						<CardHeader>
							<div className="flex items-start justify-between gap-2">
								<div>
									<CardTitle className="text-base font-semibold text-navy">
										{t.name}
									</CardTitle>
									<span className="text-xs font-semibold text-green">
										{t.size_kva} kVA continuous
									</span>
								</div>

								<DropdownMenu>
									<DropdownMenuTrigger
										render={
											<Button
												variant="ghost"
												size="icon-sm"
												className="-mt-1 -mr-2 text-navy/40 hover:text-navy"
											/>
										}
									>
										<MoreVertical className="size-4" />
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-40">
										<DropdownMenuItem
											onClick={() => handleEdit(t.id)}
											className="cursor-pointer"
										>
											<Pencil className="mr-2 size-3.5" />
											Edit Settings
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() => handleDelete(t)}
											className="cursor-pointer text-destructive focus:text-destructive"
										>
											<Trash2 className="mr-2 size-3.5" />
											Delete Tier
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</CardHeader>

						<CardContent className="flex-1 gap-3">
							<div>
								<span className="text-[11px] font-semibold uppercase tracking-wider text-navy/40">
									Indicative Price
								</span>
								<div className="text-sm font-semibold text-amber">
									{fmt(t.price_range_min)} – {fmt(t.price_range_max)}
								</div>
							</div>

							<div>
								<span className="text-[11px] font-semibold uppercase tracking-wider text-navy/40">
									Powers
								</span>
								<div className="mt-1 flex flex-wrap gap-1">
									{t.typically_powers.map((item) =>
										item.split(",").map((power, idx) => {
											const trimmedPower = power.trim();
											return (
												<Badge
													key={`${trimmedPower}-${
														// biome-ignore lint/suspicious/noArrayIndexKey: <...>
														idx
													}`}
													variant="outline"
													className="bg-cream/60 text-[11px] text-navy/80 border-navy/10"
												>
													{trimmedPower}
												</Badge>
											);
										}),
									)}
								</div>
							</div>

							{t.notes && (
								<p className="text-xs leading-relaxed text-navy/60 italic">
									{t.notes}
								</p>
							)}
						</CardContent>
					</Card>
				))}
			</CardContent>
		</Card>
	);
}
