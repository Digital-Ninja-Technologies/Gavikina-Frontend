import { useMutation, useQueryClient } from "@tanstack/react-query";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@workspace/ui/components/table";
import { toast } from "@workspace/ui/components/toast";
import { MoreVertical, Pencil, Plus, Trash2, Zap } from "lucide-react";
import { useConfirm } from "#/components/confirm-provider";
import { deleteApplianceApi } from "@/modules/catalogue/api";
import { catalogueKeys } from "@/modules/catalogue/query-options";
import { openDialog } from "@/store/dialog-store";

export function AppliancesSection({ appliances }: { appliances: Appliance[] }) {
	const queryClient = useQueryClient();
	const confirm = useConfirm();

	const deleteMutation = useMutation({
		mutationFn: deleteApplianceApi,
		onSuccess: () => {
			toast.add({
				title: "Appliance Deleted",
				description: "The appliance has been removed from the catalogue.",
				type: "success",
			});
			queryClient.invalidateQueries({ queryKey: catalogueKeys.appliances() });
		},
		onError: (error) => {
			toast.add({
				title: "Failed to Delete Appliance",
				description:
					error instanceof Error
						? error.message
						: "There was a problem deleting this appliance.",
				type: "error",
			});
		},
	});

	const handleEdit = (id: string) => {
		openDialog("APPLIANCE_FORM", { applianceId: id });
	};

	const handleDelete = async (appliance: Appliance) => {
		const isConfirmed = await confirm({
			title: `Delete "${appliance.name}"?`,
			description:
				"This appliance will be removed from the public calculator defaults. This action cannot be undone.",
			confirmText: "Delete Appliance",
			variant: "destructive",
		});

		if (isConfirmed) {
			deleteMutation.mutate(appliance.id);
		}
	};

	return (
		<Card className="border-navy/10 shadow-xs">
			<CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-navy">
						<Zap className="size-5 text-green" />
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
								Actions
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
										className="border-navy/10 bg-navy/5 text-xs capitalize text-navy/70"
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
									<DropdownMenu>
										<DropdownMenuTrigger
											render={
												<Button
													variant="ghost"
													size="icon-sm"
													className="text-navy/40 hover:text-navy"
												/>
											}
										>
											<MoreVertical className="size-4" />
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="w-36">
											<DropdownMenuItem
												onClick={() => handleEdit(a.id)}
												className="cursor-pointer text-xs"
											>
												<Pencil className="mr-2 size-3.5" />
												Edit Appliance
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => handleDelete(a)}
												className="cursor-pointer text-xs text-destructive hover:text-background! focus:text-destructive"
											>
												<Trash2 className="mr-2 size-3.5" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
