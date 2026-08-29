import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function getContext() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 5,
				refetchOnWindowFocus: false,
			},
		},
	});

	return {
		queryClient,
	};
}

export default function TanstackQueryProvider({
	queryClient,
	children,
}: {
	queryClient: QueryClient;
	children: React.ReactNode;
}) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
