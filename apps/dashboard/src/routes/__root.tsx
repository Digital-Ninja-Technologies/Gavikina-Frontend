import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	Link,
	Outlet,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Button } from "@workspace/ui/components/button";
import { Toaster } from "@workspace/ui/components/toast";
import { AlertCircle } from "lucide-react";
import nprogress from "nprogress";
import { useEffect } from "react";

import "@workspace/ui/globals.css";
import "nprogress/nprogress.css";

nprogress.configure({ showSpinner: false, minimum: 0.15 });

interface DashboardRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<DashboardRouterContext>()({
	component: RootLayout,
	notFoundComponent: NotFoundPage,
	errorComponent: GlobalErrorPage,
});

function RootLayout() {
	const isLoading = useRouterState({ select: (s) => s.isLoading });

	useEffect(() => {
		if (isLoading) {
			nprogress.start();
		} else {
			nprogress.done();
		}
	}, [isLoading]);

	return (
		<>
			{/* The Outlet renders EITHER the full-screen Login OR the Protected Layout */}
			<Outlet />

			<Toaster />

			<TanStackDevtools
				config={{ position: "bottom-right" }}
				plugins={[
					{ name: "Tanstack Router", render: <TanStackRouterDevtoolsPanel /> },
					{ name: "Tanstack Query", render: <ReactQueryDevtoolsPanel /> },
				]}
			/>
		</>
	);
}

function NotFoundPage() {
	return (
		<div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
			<h1 className="text-7xl font-bold tracking-tight text-navy sm:text-9xl">
				404
			</h1>
			<h2 className="mt-4 text-xl font-semibold tracking-tight text-navy sm:text-2xl">
				Page not found
			</h2>
			<p className="mt-2 max-w-md text-sm leading-relaxed text-navy/70">
				The dashboard page you are looking for does not exist.
			</p>
			<Button
				size="lg"
				className="mt-8"
				nativeButton={false}
				render={<Link to="/" />}
			>
				Back to Dashboard
			</Button>
		</div>
	);
}

// biome-ignore lint/suspicious/noExplicitAny: <any err>
function GlobalErrorPage({ error, reset }: { error: any; reset: () => void }) {
	return (
		<div className="flex min-h-[65vh] flex-col items-center justify-center px-4 text-center">
			<span className="flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
				<AlertCircle className="size-8" />
			</span>
			<h1 className="mt-6 text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
				Something went wrong
			</h1>
			<p className="mt-2 max-w-md text-sm leading-relaxed text-navy/70">
				{error?.message ||
					"An unexpected error occurred while loading this page."}
			</p>
			<div className="mt-8 flex items-center gap-4">
				<Button onClick={reset} size="lg">
					Try again
				</Button>
				<Button
					variant="outline"
					size="lg"
					nativeButton={false}
					render={<Link to=".." />}
				>
					Go Back
				</Button>
			</div>
		</div>
	);
}
