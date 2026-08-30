import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: true, // Keep this true for dashboards so data is fresh when admins switch tabs
			retry: 1,
		},
	},
});
