import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
	useLocation,
	useMatches,
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
import * as React from "react";
import { getStableDateRange } from "#/lib/get-date-range";
import { AppSidebar } from "@/components/app-sidebar";
import DashboardCatchBoundary from "@/components/catch-boundary";
import { sessionQueryOptions } from "@/modules/auth/query-options";
import {
	dashboardOverviewQueryOptions,
	dashboardStatsQueryOptions,
} from "@/modules/dashboard/query-options";

export const Route = createFileRoute("/_protected")({
	component: ProtectedLayout,
	errorComponent: DashboardCatchBoundary,
	beforeLoad: async ({ context, location }) => {
		const session = await context.queryClient.query(sessionQueryOptions());

		if (!session) {
			throw redirect({ to: "/login", search: { redirect: location.href } });
		}

		void context.queryClient.query(dashboardStatsQueryOptions());
		const { startDate, endDate } = getStableDateRange();
		void context.queryClient.query(
			dashboardOverviewQueryOptions({ startDate, endDate }),
		);

		return { user: session.user };
	},
});

const KNOWN_SEGMENTS: Record<string, string> = {
	enquiries: "Enquiries",
	projects: "Past Projects",
	"calculator-settings": "Calculator Settings",
};

function ProtectedLayout() {
	const location = useLocation();
	const matches = useMatches();

	const pathSegments = location.pathname.split("/").filter(Boolean);
	const isRoot = pathSegments.length === 0;

	const currentMatch = matches[matches.length - 1];
	const leafTitle = (currentMatch?.staticData as { title?: string } | undefined)
		?.title;

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
								{isRoot ? (
									<BreadcrumbItem>
										<BreadcrumbPage>Dashboard</BreadcrumbPage>
									</BreadcrumbItem>
								) : (
									<>
										<BreadcrumbItem className="hidden md:block">
											<BreadcrumbLink render={<Link to="/" />}>
												Dashboard
											</BreadcrumbLink>
										</BreadcrumbItem>
										<BreadcrumbSeparator className="hidden md:block" />

										{pathSegments.map((segment, index) => {
											const isLast = index === pathSegments.length - 1;
											const href = `/${pathSegments.slice(0, index + 1).join("/")}`;

											if (isLast) {
												const pageTitle =
													leafTitle ||
													(pathSegments[0] === "enquiries" && index === 1
														? "Enquiry Details"
														: KNOWN_SEGMENTS[segment] ||
															segment.charAt(0).toUpperCase() +
																segment.slice(1).replaceAll("-", " "));

												return (
													<BreadcrumbItem key={segment}>
														<BreadcrumbPage>{pageTitle}</BreadcrumbPage>
													</BreadcrumbItem>
												);
											}

											const segmentLabel =
												KNOWN_SEGMENTS[segment] ||
												segment.charAt(0).toUpperCase() +
													segment.slice(1).replaceAll("-", " ");

											return (
												<React.Fragment key={segment}>
													<BreadcrumbItem className="hidden sm:block">
														<BreadcrumbLink render={<Link to={href} />}>
															{segmentLabel}
														</BreadcrumbLink>
													</BreadcrumbItem>
													<BreadcrumbSeparator className="hidden sm:block" />
												</React.Fragment>
											);
										})}
									</>
								)}
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
