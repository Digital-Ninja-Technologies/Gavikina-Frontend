import { Link, useRouterState } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu";
import { cn } from "@workspace/ui/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "../assets/logo-primary.svg";
import { NAV } from "../lib/content";
import { openAssess, openCalc } from "../store/modal";

const normalizePath = (path: string) => {
	if (path === "/") return "/";
	return path.replace(/\/+$/, "");
};

const isPathActive = (targetPath: string, currentPath: string) => {
	const normalizedTarget = normalizePath(targetPath);
	const normalizedCurrent = normalizePath(currentPath);
	if (normalizedTarget === "/") return normalizedCurrent === "/";
	return (
		normalizedCurrent === normalizedTarget ||
		normalizedCurrent.startsWith(`${normalizedTarget}/`)
	);
};

export default function Header() {
	const [mobileOpen, setMobileOpen] = useState(false);
	const pathname = useRouterState({ select: (s) => s.location.pathname });

	// biome-ignore lint/correctness/useExhaustiveDependencies: <close sidebar on navigation>
	useEffect(() => {
		setMobileOpen(false);
	}, [pathname]);

	useEffect(() => {
		document.body.style.overflow = mobileOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [mobileOpen]);

	return (
		<>
			<header className="sticky top-0 z-50 border-b border-navy/10 bg-white/95 backdrop-blur-md">
				<div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
					<div className="flex items-center gap-8">
						<Link to="/" className="flex shrink-0 items-center">
							<img
								src={logo}
								alt="Gavikina Energy"
								className="block h-8 w-auto"
							/>
						</Link>

						<NavigationMenu className="hidden lg:flex">
							<NavigationMenuList className="gap-1">
								{NAV.map((group) => {
									const isGroupActive = group.items.some((item) =>
										isPathActive(item.path, pathname),
									);

									return (
										<NavigationMenuItem key={group.key}>
											<NavigationMenuTrigger
												className={cn(
													"bg-transparent text-sm font-medium text-navy transition-colors hover:bg-cream hover:text-navy focus:bg-cream focus:text-navy data-[state=open]:bg-cream",
													isGroupActive && "bg-cream text-navy",
												)}
											>
												{group.label}
											</NavigationMenuTrigger>
											<NavigationMenuContent>
												<ul className="flex w-64 flex-col gap-1 p-2">
													{group.items.map((item) => {
														const active = isPathActive(item.path, pathname);
														return (
															<li key={item.path}>
                                <NavigationMenuLink
                                  className={"text-left items-start"}
																	render={
																		<Link
																			to={item.path}
																			className={cn(
																				"flex flex-col gap-0.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-cream",
																				active && "bg-cream",
																			)}
																		/>
																	}
																>
																	<span className="text-sm font-medium text-navy">
																		{item.label}
																	</span>
																	{item.note && (
																		<span className="text-xs leading-tight text-navy/60">
																			{item.note}
																		</span>
																	)}
																</NavigationMenuLink>
															</li>
														);
													})}
												</ul>
											</NavigationMenuContent>
										</NavigationMenuItem>
									);
								})}

								<NavigationMenuItem>
									<NavigationMenuLink
										render={
											<Link
												to="/contact"
												className={cn(
													navigationMenuTriggerStyle(),
													"bg-transparent text-sm font-medium text-navy hover:bg-cream hover:text-navy focus:bg-cream focus:text-navy",
													isPathActive("/contact", pathname) &&
														"bg-cream text-navy",
												)}
											/>
										}
									>
										Contact
									</NavigationMenuLink>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					<div className="flex shrink-0 items-center gap-2 sm:gap-3">
						<Button
							variant="outline"
							size="lg"
							className="hidden lg:inline-flex"
							onClick={openCalc}
						>
							Solar calculator
						</Button>
						<Button
							variant={"primary"}
							size="lg"
							onClick={() => openAssess()}
							className="px-3 text-xs sm:px-4 sm:text-sm"
						>
							Free assessment
						</Button>
						<button
							type="button"
							className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-navy/20 bg-white text-navy transition-colors hover:bg-cream lg:hidden"
							aria-label={mobileOpen ? "Close menu" : "Open menu"}
							aria-expanded={mobileOpen}
							onClick={() => setMobileOpen((v) => !v)}
						>
							{mobileOpen ? (
								<X className="size-5" />
							) : (
								<Menu className="size-5" />
							)}
						</button>
					</div>
				</div>
			</header>
			{mobileOpen && (
				<div className="animate-gv-in fixed inset-x-0 bottom-0 top-18 z-40 overflow-y-auto bg-white px-6 pb-10 pt-4 lg:hidden">
					{NAV.map((group) => (
						<div key={group.key} className="mt-8 first:mt-0">
							<h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-navy/50">
								{group.label}
							</h4>
							{group.items.map((item) => (
								<Link
									key={item.path}
									to={item.path}
									className="flex w-full flex-col gap-0.5 border-b border-navy/10 py-3 text-left text-navy"
								>
									<span className="text-sm font-medium">{item.label}</span>
									{item.note && (
										<span className="text-xs text-navy/60">{item.note}</span>
									)}
								</Link>
							))}
						</div>
					))}
					<div className="mt-4">
						<Link
							to="/contact"
							className="flex w-full border-b border-navy/10 py-3 text-left text-sm font-medium text-navy"
						>
							Contact
						</Link>
					</div>
					<div className="mt-6 flex flex-col gap-3">
						<Button variant="outline" onClick={openCalc} className="w-full">
							Solar calculator
						</Button>
						<Button onClick={() => openAssess()} className="w-full">
							Free assessment
						</Button>
					</div>
				</div>
			)}
		</>
	);
}
