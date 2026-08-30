import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import DashboardCatchBoundary from "#/components/catch-boundary";
import { sessionQueryOptions } from "@/modules/auth/query-options";

export const Route = createFileRoute("/_protected")({
	component: ProtectedLayout,
	errorComponent: DashboardCatchBoundary,
	beforeLoad: async ({ context, location }) => {
		const session = await context.queryClient.query(sessionQueryOptions());

		if (!session) {
			throw redirect({
				to: "/login",
				search: { redirect: location.href },
			});
		}

		// 3. (Optional) Prefetch dashboard overview data here if needed
		// await context.queryClient.query(dashboardStatsQueryOptions());

		return { user: session.user };
	},
});

function ProtectedLayout() {
	return (
		<div className="flex min-h-screen bg-cream/30">
			{/* TODO: Add Dashboard Sidebar here */}

			<div className="flex flex-1 flex-col min-w-0">
				{/* TODO: Add Dashboard Header here */}

				<div className="flex h-14 items-center gap-3 border-b border-navy/10 bg-white px-5 min-[961px]:hidden">
					<button
						type="button"
						className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy/16"
						aria-label="Open menu"
					>
						☰
					</button>
					<span className="text-[14.5px] font-semibold tracking-tight text-navy">
						Gavikina Admin
					</span>
				</div>

				<main className="flex-1 p-6 page-wrapper">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
