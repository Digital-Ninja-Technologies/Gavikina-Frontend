import { zodResolver } from "@hookform/resolvers/zod";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "@workspace/ui/components/toast";
import { Save } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { AsyncBoundary } from "#/components/async-boundary";
import { AppliancesSection } from "@/modules/calculator-settings/components/appliances-section";
import { SizingFormulaCard } from "@/modules/calculator-settings/components/sizing-formula-card";
import { TiersSection } from "@/modules/calculator-settings/components/tiers-section";
import { updateFormula } from "@/modules/catalogue/api";
import {
	catalogueAppliancesQueryOptions,
	catalogueFormulaQueryOptions,
	catalogueKeys,
	catalogueTiersQueryOptions,
} from "@/modules/catalogue/query-options";

export const Route = createFileRoute("/_protected/calculator-settings")({
	component: CalculatorSettingsRoute,
});

const formulaSchema = z.object({
	headroom: z.coerce.number().min(1).max(2),
	powerFactor: z.coerce.number().min(0.1).max(1.0),
	longBackupBoost: z.coerce.number().min(1.0).max(2.0),
});

function CalculatorSettingsRoute() {
	return (
		<div className="flex flex-col gap-8 animate-gv-fade">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="page-title">Calculator Settings</h1>
					<p className="page-description mt-1">
						Tune the sizing formula, appliance wattages, and system tiers
						powering the calculator.
					</p>
				</div>

				<div className="flex items-center gap-2.5">
					<Button type="submit" form="formula-form" className="gap-1.5">
						<Save className="size-4" /> Save Formula
					</Button>
				</div>
			</div>

			<AsyncBoundary
				errorTitle="Failed to load calculator configuration"
				fallback={<CalculatorSettingsSkeleton />}
			>
				<CalculatorSettingsContent />
			</AsyncBoundary>
		</div>
	);
}

function CalculatorSettingsContent() {
	const queryClient = useQueryClient();

	const { data: formula } = useSuspenseQuery(catalogueFormulaQueryOptions());
	const { data: tiers } = useSuspenseQuery(catalogueTiersQueryOptions());
	const { data: appliances } = useSuspenseQuery(
		catalogueAppliancesQueryOptions(),
	);

	const form = useForm({
		resolver: zodResolver(formulaSchema),
		defaultValues: formula,
	});

	const formulaMutation = useMutation({
		mutationFn: updateFormula,
		onSuccess: () => {
			toast.add({
				title: "Formula Updated",
				description: "Sizing calibration applied to the public calculator.",
				type: "success",
			});
			queryClient.invalidateQueries({ queryKey: catalogueKeys.formula() });
			form.reset({}, { keepValues: true });
		},
		onError: (error) => {
			toast.add({
				title: "Failed to Update Formula",
				description:
					error.message || "There was a problem saving your changes.",
				type: "error",
			});
		},
	});

	const onSubmit = form.handleSubmit((values) => {
		formulaMutation.mutate(values);
	});

	return (
		<div className="flex flex-col gap-8">
			<FormProvider {...form}>
				<form id="formula-form" onSubmit={onSubmit}>
					<SizingFormulaCard />
				</form>
			</FormProvider>
			<TiersSection tiers={tiers} />
			<AppliancesSection appliances={appliances} />
		</div>
	);
}

function CalculatorSettingsSkeleton() {
	return (
		<div className="flex flex-col gap-8">
			{/* Formula Skeleton */}
			<Card className="border-navy/10 shadow-xs">
				<CardHeader className="pb-4">
					<Skeleton className="h-5 w-48 bg-navy/10" />
					<Skeleton className="h-4 w-3/4 bg-navy/5 mt-1" />
				</CardHeader>
				<CardContent className="grid grid-cols-1 gap-5 sm:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <static skeleton loader>
						<div key={i} className="space-y-2">
							<Skeleton className="h-4 w-32 bg-navy/10" />
							<Skeleton className="h-10 w-full bg-navy/5" />
							<Skeleton className="h-3 w-48 bg-navy/5" />
						</div>
					))}
				</CardContent>
			</Card>

			{/* Tiers Skeleton */}
			<Card className="border-navy/10 shadow-xs">
				<CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-2">
						<Skeleton className="h-5 w-56 bg-navy/10" />
						<Skeleton className="h-4 w-72 bg-navy/5" />
					</div>
					<Skeleton className="h-9 w-24 bg-navy/10" />
				</CardHeader>
				<CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <static skeleton loader>
						<Card key={i} className="border-navy/10">
							<CardHeader className="pb-3">
								<Skeleton className="h-5 w-32 bg-navy/10" />
								<Skeleton className="h-3 w-24 mt-1 bg-navy/5" />
							</CardHeader>
							<CardContent className="space-y-3">
								<Skeleton className="h-10 w-full bg-navy/5" />
								<Skeleton className="h-10 w-full bg-navy/5" />
							</CardContent>
						</Card>
					))}
				</CardContent>
			</Card>

			{/* Appliances Skeleton */}
			<Card className="border-navy/10 shadow-xs">
				<CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-2">
						<Skeleton className="h-5 w-48 bg-navy/10" />
						<Skeleton className="h-4 w-64 bg-navy/5" />
					</div>
					<Skeleton className="h-9 w-32 bg-navy/10" />
				</CardHeader>
				<CardContent>
					<div className="space-y-4 pt-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: <static skeleton loader>
								key={i}
								className="flex justify-between items-center border-b border-navy/5 pb-4 last:border-0"
							>
								<Skeleton className="h-4 w-32 bg-navy/10" />
								<Skeleton className="h-4 w-20 bg-navy/5" />
								<Skeleton className="h-4 w-16 bg-navy/5" />
								<Skeleton className="h-8 w-8 bg-navy/10" />
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
