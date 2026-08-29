import { queryOptions } from "@tanstack/react-query";
import { getAppliances, getFormula, getTiers } from "./api";

export const catalogueKeys = {
	all: ["catalogue"] as const,
	tiers: () => [...catalogueKeys.all, "tiers"] as const,
	appliances: () => [...catalogueKeys.all, "appliances"] as const,
	formula: () => [...catalogueKeys.all, "formula"] as const,
};

export const catalogueTiersQueryOptions = () =>
	queryOptions({
		queryKey: catalogueKeys.tiers(),
		queryFn: () => getTiers(),
		select: (res) => res.data,
	});

export const catalogueAppliancesQueryOptions = () =>
	queryOptions({
		queryKey: catalogueKeys.appliances(),
		queryFn: () => getAppliances(),
		select: (res) => res.data,
	});

export const catalogueFormulaQueryOptions = () =>
	queryOptions({
		queryKey: catalogueKeys.formula(),
		queryFn: () => getFormula(),
		select: (res) => res.data,
	});
