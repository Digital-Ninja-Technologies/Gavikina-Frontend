import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Toaster } from "@workspace/ui/components/toast";
import appCss from "@workspace/ui/globals.css?url";
import nprogress from "nprogress";
import TanstackQueryProvider from "#/integrations/tanstack-query/root-provider";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Modal from "../components/Modal";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import "nprogress/nprogress.css";
import { useEffect } from "react";

nprogress.configure({ showSpinner: false, minimum: 0.15 });

interface MyRouterContext {
	queryClient: QueryClient;
}

const SITE_URL = "https://gavikinaenergy.com";
const SITE_TITLE = "Gavikina Energy — Power Your Own";
const SITE_DESCRIPTION =
	"Gavikina Energy — solar systems sized from a measured load, installed and commissioned by our own engineers, owned outright by you.";

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: SITE_TITLE },
			{ name: "description", content: SITE_DESCRIPTION },
			{ name: "theme-color", content: "#101328" },
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: "Gavikina Energy" },
			{ property: "og:title", content: SITE_TITLE },
			{
				property: "og:description",
				content:
					"Solar systems sized to what you actually run — installed, commissioned, and owned outright by you.",
			},
			{ property: "og:image", content: `${SITE_URL}/og-image.png` },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:url", content: SITE_URL },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: SITE_TITLE },
			{
				name: "twitter:description",
				content:
					"Solar systems sized to what you actually run — installed, commissioned, and owned outright by you.",
			},
			{ name: "twitter:image", content: `${SITE_URL}/og-image.png` },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{ rel: "manifest", href: "/site.webmanifest" },
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
		],
	}),
	component: RootLayout,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

export function RootLayout() {
	const isLoading = useRouterState({ select: (s) => s.isLoading });

	useEffect(() => {
		if (isLoading) {
			nprogress.start();
		} else {
			nprogress.done();
		}
	}, [isLoading]);

	const { queryClient } = Route.useRouteContext();
	return (
		<TanstackQueryProvider queryClient={queryClient}>
			<div className="min-h-screen text-navy">
				<Header />
				<Outlet />
				<Footer />
				<Toaster />
				<Modal />
			</div>
		</TanstackQueryProvider>
	);
}
