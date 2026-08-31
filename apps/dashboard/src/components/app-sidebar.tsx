import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
	Briefcase,
	FolderOpen,
	Inbox,
	LayoutDashboard,
	type LucideIcon,
	Settings2,
	UserPlus,
	Users,
	XCircle,
} from "lucide-react";
import type * as React from "react";
import { AsyncBoundary } from "#/components/async-boundary";
import { dashboardStatsQueryOptions } from "@/modules/dashboard/query-options";
import { NavUser, NavUserSkeleton } from "./nav-user";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const location = useLocation();

	const searchParams = location.search as { view?: string };

	const {
		data: stats,
		isPending,
		isError,
	} = useQuery(dashboardStatsQueryOptions());

	const navGroups: {
		label: string;
		items: {
			title: string;
			to: string;
			search?: Record<string, unknown>;
			icon: LucideIcon;
			isActive: boolean;
			hasBadge?: boolean;
			badgeValue?: number;
		}[];
	}[] = [
		{
			label: "Workspace",
			items: [
				{
					title: "Overview",
					to: "/",
					icon: LayoutDashboard,
					isActive: location.pathname === "/",
				},
			],
		},
		{
			label: "Enquiries",
			items: [
				{
					title: "All Enquiries",
					to: "/enquiries",
					search: { view: "all" },
					icon: Inbox,
					isActive:
						location.pathname === "/enquiries" &&
						(!searchParams.view || searchParams.view === "all"),
					hasBadge: true,
					badgeValue: stats?.totalEnquiries || 0,
				},
				{
					title: "Customers",
					to: "/enquiries",
					search: { view: "customers" },
					icon: Users,
					isActive:
						location.pathname === "/enquiries" &&
						searchParams.view === "customers",
					hasBadge: true,
					badgeValue: stats?.typeCounts?.customer || 0,
				},
				{
					title: "Agents",
					to: "/enquiries",
					search: { view: "agents" },
					icon: UserPlus,
					isActive:
						location.pathname === "/enquiries" &&
						searchParams.view === "agents",
					hasBadge: true,
					badgeValue: stats?.typeCounts?.agent || 0,
				},
				{
					title: "Investors",
					to: "/enquiries",
					search: { view: "investors" },
					icon: Briefcase,
					isActive:
						location.pathname === "/enquiries" &&
						searchParams.view === "investors",
					hasBadge: true,
					badgeValue: stats?.typeCounts?.investor || 0,
				},
				{
					title: "Job Applications",
					to: "/enquiries",
					search: { view: "careers" },
					icon: FolderOpen,
					isActive:
						location.pathname === "/enquiries" &&
						searchParams.view === "careers",
					hasBadge: true,
					badgeValue: stats?.typeCounts?.careers || 0,
				},
				{
					title: "Abandoned",
					to: "/enquiries",
					search: { view: "abandoned" },
					icon: XCircle,
					isActive:
						location.pathname === "/enquiries" &&
						searchParams.view === "abandoned",
					hasBadge: true,
					badgeValue: 0,
				},
			],
		},
		{
			label: "Content & Tools",
			items: [
				{
					title: "Past Projects",
					to: "/projects",
					icon: FolderOpen,
					isActive: location.pathname.includes("/projects"),
				},
				{
					title: "Calculator Settings",
					to: "/calculator-settings",
					icon: Settings2,
					isActive: location.pathname.includes("/calculator-settings"),
				},
			],
		},
	];

	return (
		<Sidebar variant="sidebar" {...props}>
			<SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-5">
				<Link to="/" className="block">
					<img
						src={`/logo-primary-ondark.svg`}
						alt="Gavikina Energy"
						className="block h-8 w-auto transition-all group-data-[collapsible=icon]:scale-0"
					/>
					<div className="absolute inset-0 flex items-center justify-center scale-0 opacity-0 transition-all group-data-[collapsible=icon]:scale-100 group-data-[collapsible=icon]:opacity-100">
						<div className="flex size-8 items-center justify-center rounded-lg bg-green text-white font-bold">
							G
						</div>
					</div>
				</Link>
			</SidebarHeader>

			<SidebarContent className="pt-4">
				{navGroups.map((group) => (
					<SidebarGroup key={group.label}>
						<SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
							{group.label}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											isActive={item.isActive}
											tooltip={item.title}
											size={"lg"}
											className={
												item.isActive
													? "bg-white/12 text-white hover:bg-white/12"
													: ""
											}
											render={<Link to={item.to} search={item.search} />}
										>
											<item.icon className="size-4" />
											<span>{item.title}</span>

											{item.hasBadge && isPending && (
												<Skeleton className="ml-auto h-5 w-6 rounded-full bg-white/10" />
											)}

											{item.hasBadge &&
												!isPending &&
												!isError &&
												item.badgeValue !== undefined &&
												item.badgeValue > 0 && (
													<span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[11px] tabular-nums text-white/70">
														{item.badgeValue}
													</span>
												)}
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>

			<SidebarFooter>
				<AsyncBoundary fallback={<NavUserSkeleton />}>
					<NavUser />
				</AsyncBoundary>
			</SidebarFooter>
		</Sidebar>
	);
}
