import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@workspace/ui/components/sidebar";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react";
import { logoutAdmin } from "@/modules/auth/api";
import { sessionQueryOptions } from "@/modules/auth/query-options";

export function NavUser() {
	const { isMobile } = useSidebar();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const { data: authData } = useSuspenseQuery(sessionQueryOptions());
	if (!authData) return <NavUserSkeleton />;

	const user = authData.user;

	async function handleLogout() {
		await logoutAdmin();
		queryClient.clear();
		navigate({ to: "/login", replace: true });
	}

	const initials = user.name
		? user.name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.substring(0, 2)
				.toUpperCase()
		: "AD";

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<SidebarMenuButton
								size="lg"
								className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							/>
						}
					>
						{/* Trigger inside the Dark Sidebar */}
						<Avatar className="h-8 w-8 rounded-lg">
							<AvatarFallback className="rounded-lg bg-white/10 text-white">
								{initials}
							</AvatarFallback>
						</Avatar>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-semibold text-white">
								{user.name}
							</span>
							<span className="truncate text-[11px] text-white/50">
								{user.email}
							</span>
						</div>
						<ChevronsUpDownIcon className="ml-auto size-4 text-white/50" />
					</DropdownMenuTrigger>

					{/* Dropdown Menu (Light Background) */}
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border border-navy/10 shadow-xl"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-3 px-1 py-1.5 text-left text-sm">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarFallback className="rounded-lg bg-navy text-white">
											{initials}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold text-navy">
											{user.name}
										</span>
										<span className="truncate text-xs text-navy/70">
											{user.email}
										</span>
									</div>
								</div>
							</DropdownMenuLabel>
						</DropdownMenuGroup>
						<DropdownMenuSeparator className="bg-navy/10" />
						<DropdownMenuItem
							onClick={handleLogout}
							className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
						>
							<LogOutIcon className="mr-2 size-4" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

export function NavUserSkeleton() {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton size="lg" className="pointer-events-none">
					<Skeleton className="h-8 w-8 rounded-lg bg-white/10" />
					<div className="grid flex-1 gap-1">
						<Skeleton className="h-4 w-24 bg-white/10" />
						<Skeleton className="h-3 w-32 bg-white/10" />
					</div>
					<Skeleton className="ml-auto size-4 bg-white/10" />
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
