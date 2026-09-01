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
import { FormInput, FormTextarea } from "@workspace/ui/components/form-fields";
import { toast } from "@workspace/ui/components/toast";
import { Loader2 } from "lucide-react";
import { type ComponentProps, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTier, updateTier } from "#/modules/catalogue/api";
import {
	catalogueKeys,
	catalogueTiersQueryOptions,
} from "#/modules/catalogue/query-options";
import { closeDialog } from "@/store/dialog-store";

const tierSchema = z.object({
	name: z.string().min(2, "Tier name is required"),
	size_kva: z.coerce.number().min(0.5, "Size must be at least 0.5 kVA"),
	price_range_min: z.coerce.number().min(0, "Minimum price cannot be negative"),
	price_range_max: z.coerce.number().min(0, "Maximum price cannot be negative"),
	typically_powers_text: z.string().min(2, "List at least one appliance group"),
	notes: z.string().optional(),
});

interface TierDialogProps extends ComponentProps<typeof Dialog> {
	tierId?: string;
}

export function TierDialog({ tierId, ...props }: TierDialogProps) {
	const queryClient = useQueryClient();

	const { data: tiers } = useQuery(catalogueTiersQueryOptions());
	const tier = tiers?.find((t) => t.id === tierId);

	const form = useForm({
		resolver: zodResolver(tierSchema),
		defaultValues: {
			name: "",
			size_kva: 3.5,
			price_range_min: 3000000,
			price_range_max: 4500000,
			typically_powers_text: "",
			notes: "",
		},
	});

	useEffect(() => {
		if (tierId && tier) {
			form.reset({
				name: tier.name,
				size_kva: tier.size_kva,
				price_range_min: tier.price_range_min,
				price_range_max: tier.price_range_max,
				typically_powers_text: tier.typically_powers.join(", "),
				notes: tier.notes || "",
			});
		} else if (!tierId) {
			form.reset({
				name: "",
				size_kva: 3.5,
				price_range_min: 3000000,
				price_range_max: 4500000,
				typically_powers_text: "",
				notes: "",
			});
		}
	}, [tier, tierId, form]);

	const createMutation = useMutation({
		mutationFn: createTier,
		onSuccess: () => {
			toast.add({
				title: "Tier Created",
				description: "New system tier has been added to the catalogue.",
				type: "success",
			});
			queryClient.invalidateQueries({ queryKey: catalogueKeys.tiers() });
			closeDialog();
		},
		onError: (error) => {
			toast.add({
				title: "Failed to create tier",
				description: error.message || "An error occurred.",
				type: "error",
			});
		},
	});

	const updateMutation = useMutation({
		mutationFn: (data: { id: string; payload: any }) =>
			updateTier(data.id, data.payload),
		onSuccess: () => {
			toast.add({
				title: "Tier Updated",
				description: "Changes have been saved successfully.",
				type: "success",
			});
			queryClient.invalidateQueries({ queryKey: catalogueKeys.tiers() });
			closeDialog();
		},
		onError: (error) => {
			toast.add({
				title: "Failed to update tier",
				description: error.message || "An error occurred.",
				type: "error",
			});
		},
	});

	const isPending = createMutation.isPending || updateMutation.isPending;

	const onSubmit = form.handleSubmit((values) => {
		const payload = {
			name: values.name,
			size_kva: values.size_kva,
			price_range_min: values.price_range_min,
			price_range_max: values.price_range_max,
			typically_powers: values.typically_powers_text
				.split(",")
				.map((s) => s.trim())
				.filter(Boolean),
			notes: values.notes,
		};

		if (tierId) {
			updateMutation.mutate({ id: tierId, payload });
		} else {
			createMutation.mutate({ ...payload, notes: payload.notes || "" });
		}
	});

	return (
		<Dialog {...props}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{tierId ? "Edit System Tier" : "Add System Tier"}
					</DialogTitle>
					<DialogDescription>
						System tiers represent standard installation packages shown in the
						product catalogue and calculator output.
					</DialogDescription>
				</DialogHeader>

				<form
					id="tier-form"
					onSubmit={onSubmit}
					className="flex flex-col gap-4 py-2"
				>
					<div className="grid grid-cols-2 gap-4">
						<FormInput
							control={form.control}
							name="name"
							label="Tier Name"
							placeholder="e.g. Standard Home"
						/>
						<FormInput
							control={form.control}
							name="size_kva"
							type="number"
							step="0.5"
							label="Continuous Rating (kVA)"
							placeholder="5"
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<FormInput
							control={form.control}
							name="price_range_min"
							type="number"
							step="50000"
							label="Price Minimum (₦)"
							placeholder="3500000"
						/>
						<FormInput
							control={form.control}
							name="price_range_max"
							type="number"
							step="50000"
							label="Price Maximum (₦)"
							placeholder="4800000"
						/>
					</div>

					<FormInput
						control={form.control}
						name="typically_powers_text"
						label="Typically Powers (comma-separated)"
						placeholder="Lights and fans, Inverter fridge, 1HP AC"
					/>

					<FormTextarea
						control={form.control}
						name="notes"
						label="Short Notes"
						rows={2}
						placeholder="Optional description shown underneath the tier name."
					/>
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
					<Button type="submit" form="tier-form" size="sm" disabled={isPending}>
						{isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
						{tierId ? "Save Changes" : "Create Tier"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
