import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@workspace/ui/components/dialog";
import { FormInput, FormSelect } from "@workspace/ui/components/form-fields";
import { toast } from "@workspace/ui/components/toast";
import { Loader2 } from "lucide-react";
import { type ComponentProps, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { closeDialog } from "@/store/dialog-store";
import { createAppliance, updateAppliancesBulk } from "../../catalogue/api";
import {
	catalogueAppliancesQueryOptions,
	catalogueKeys,
} from "../../catalogue/query-options";

const applianceSchema = z.object({
	name: z.string().min(2, "Name is required"),
	category: z.string().min(2, "Category is required"),
	typical_wattage: z.coerce.number().min(1, "Must be at least 1W"),
	default_quantity: z.coerce.number().min(0, "Cannot be negative"),
});

// type ApplianceFormValues = z.infer<typeof applianceSchema>;

interface ApplianceDialogProps extends ComponentProps<typeof Dialog> {
	applianceId?: string;
}

const CATEGORY_OPTIONS = [
	{ label: "Essential / Lighting", value: "lighting" },
	{ label: "Cooling & Air", value: "cooling" },
	{ label: "Kitchen & Dining", value: "kitchen" },
	{ label: "Electronics & Media", value: "entertainment" },
	{ label: "Pumps & Heavy Duty", value: "heavy_duty" },
	{ label: "Commercial / Business", value: "business" },
];

export function ApplianceDialog({
	applianceId,
	...props
}: ApplianceDialogProps) {
	const queryClient = useQueryClient();

	const { data: appliances } = useQuery(catalogueAppliancesQueryOptions());
	const appliance = appliances?.find((a) => a.id === applianceId);

	const form = useForm({
		resolver: zodResolver(applianceSchema),
		defaultValues: {
			name: "",
			category: "lighting",
			typical_wattage: 100,
			default_quantity: 1,
		},
	});

	useEffect(() => {
		if (applianceId && appliance) {
			form.reset({
				name: appliance.name,
				category: appliance.category,
				typical_wattage: appliance.typical_wattage,
				default_quantity: appliance.default_quantity,
			});
		} else if (!applianceId) {
			form.reset({
				name: "",
				category: "lighting",
				typical_wattage: 100,
				default_quantity: 1,
			});
		}
	}, [appliance, applianceId, form]);

	const createMutation = useMutation({
		mutationFn: createAppliance,
		onSuccess: () => {
			toast.add({
				title: "Appliance Added",
				description: "New appliance is now available in the calculator.",
				type: "success",
			});
			queryClient.invalidateQueries({ queryKey: catalogueKeys.appliances() });
			closeDialog();
		},
		onError: (error) => {
			toast.add({
				title: "Failed to add appliance",
				description: error.message || "An error occurred.",
				type: "error",
			});
		},
	});

	const updateMutation = useMutation({
		mutationFn: updateAppliancesBulk,
		onSuccess: () => {
			toast.add({
				title: "Appliance Updated",
				description: "Settings updated for this appliance.",
				type: "success",
			});
			queryClient.invalidateQueries({ queryKey: catalogueKeys.appliances() });
			closeDialog();
		},
		onError: (error) => {
			toast.add({
				title: "Failed to update appliance",
				description: error.message || "An error occurred.",
				type: "error",
			});
		},
	});

	const isPending = createMutation.isPending || updateMutation.isPending;

	const onSubmit = form.handleSubmit((values) => {
		if (applianceId) {
			// PUT expects a map of changes keyed by ID
			updateMutation.mutate({
				[applianceId]: {
					typical_wattage: values.typical_wattage,
					default_quantity: values.default_quantity,
				},
			});
		} else {
			// POST expects specific keys
			createMutation.mutate({
				name: values.name,
				category: values.category,
				wattage: values.typical_wattage,
				defaultQuantity: values.default_quantity,
			});
		}
	});

	return (
		<Dialog {...props}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{applianceId ? "Edit Appliance Data" : "Add Appliance"}
					</DialogTitle>
					<DialogDescription>
						{applianceId
							? "Adjust baseline wattage and suggested default quantities."
							: "Configure a new power consumption option for the calculator."}
					</DialogDescription>
				</DialogHeader>

				<form
					id="appliance-form"
					onSubmit={onSubmit}
					className="flex flex-col gap-4 py-2"
				>
					<FormInput
						control={form.control}
						name="name"
						label="Appliance Name"
						placeholder="e.g. Standing Fan, Refrigerator"
						disabled={!!applianceId}
					/>

					<FormSelect
						control={form.control}
						name="category"
						label="Category"
						options={CATEGORY_OPTIONS}
						placeholder="Select category"
						disabled={!!applianceId}
					/>

					<div className="grid grid-cols-2 gap-4">
						<FormInput
							control={form.control}
							name="typical_wattage"
							type="number"
							label="Typical Watts (W)"
							placeholder="150"
						/>
						<FormInput
							control={form.control}
							name="default_quantity"
							type="number"
							label="Default Quantity"
							placeholder="1"
						/>
					</div>
				</form>

				<DialogFooter className="flex items-center gap-2 sm:justify-end">
					<DialogClose
						render={
							<Button
								type="button"
								variant="outline"
								size="sm"
								disabled={isPending}
							/>
						}
					>
						Cancel
					</DialogClose>
					<Button
						type="submit"
						form="appliance-form"
						size="sm"
						disabled={isPending}
					>
						{isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
						{applianceId ? "Save Appliance" : "Add Appliance"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
