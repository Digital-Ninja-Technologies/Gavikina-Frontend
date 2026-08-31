import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useLocation,
} from "@tanstack/react-router";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import DashboardCatchBoundary from "@/components/catch-boundary";
import { AppSidebar } from "@/components/app-sidebar";
import { sessionQueryOptions } from "@/modules/auth/query-options";

export const Route = createFileRoute("/_protected")({
	component: ProtectedLayout,
	errorComponent: DashboardCatchBoundary,
	beforeLoad: async ({ context, location }) => {
		const session = await context.queryClient.query(sessionQueryOptions());

		if (!session) {
			throw redirect({ to: "/login", search: { redirect: location.href } });
		}

		// Optional: Prefetch dashboard stats for the sidebar badges
		// await context.queryClient.query(dashboardStatsQueryOptions());

		return { user: session.user };
	},
});

function ProtectedLayout() {
	const location = useLocation();

	const pathSegments = location.pathname.split("/").filter(Boolean);
	const activePage = pathSegments[pathSegments.length - 1];
	const pageTitle = activePage
		? activePage.charAt(0).toUpperCase() +
			activePage.slice(1).replaceAll("-", " ")
		: "Overview";

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="sticky inset-x-0 top-0 z-10 flex h-16 w-full shrink-0 items-center gap-2 border-b border-navy/10 bg-white/90 px-4 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2">
						<SidebarTrigger className="-ml-1" />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink render={<Link to="/" />}>
										Dashboard
									</BreadcrumbLink>
								</BreadcrumbItem>
								{pathSegments.length > 0 && (
									<BreadcrumbSeparator className="hidden md:block" />
								)}
								<BreadcrumbItem>
									<BreadcrumbPage>{pageTitle}</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="page-wrapper flex flex-1 flex-col bg-cream/30">
					<Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
