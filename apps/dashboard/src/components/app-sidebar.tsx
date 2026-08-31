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

	const {
		data: stats,
		isPending,
		isError,
	} = useQuery(dashboardStatsQueryOptions());

	const navGroups: {
		label: string;
		items: {
			title: string;
			url: string;
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
					url: "/",
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
					url: "/enquiries/all",
					icon: Inbox,
					isActive: location.pathname === "/enquiries/all",
					hasBadge: true,
					badgeValue: stats?.totalEnquiries || 0,
				},
				{
					title: "Customers",
					url: "/enquiries/customers",
					icon: Users,
					isActive: location.pathname === "/enquiries/customers",
					hasBadge: true,
					badgeValue: stats?.typeCounts?.customer || 0,
				},
				{
					title: "Agents",
					url: "/enquiries/agents",
					icon: UserPlus,
					isActive: location.pathname === "/enquiries/agents",
					hasBadge: true,
					badgeValue: stats?.typeCounts?.agent || 0,
				},
				{
					title: "Investors",
					url: "/enquiries/investors",
					icon: Briefcase,
					isActive: location.pathname === "/enquiries/investors",
					hasBadge: true,
					badgeValue: stats?.typeCounts?.investor || 0,
				},
				{
					title: "Job Applications",
					url: "/enquiries/careers",
					icon: FolderOpen,
					isActive: location.pathname === "/enquiries/careers",
					hasBadge: true,
					badgeValue: stats?.typeCounts?.careers || 0,
				},
				{
					title: "Abandoned",
					url: "/enquiries/abandoned",
					icon: XCircle,
					isActive: location.pathname === "/enquiries/abandoned",
					hasBadge: true,
					badgeValue: 0, // Standard logic: abandoned assessments don't use this endpoint
				},
			],
		},
		{
			label: "Content & Tools",
			items: [
				{
					title: "Past Projects",
					url: "/projects",
					icon: FolderOpen,
					isActive: location.pathname.includes("/projects"),
				},
				{
					title: "Calculator Settings",
					url: "/calculator-settings",
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
											render={<Link to={item.url} />}
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
