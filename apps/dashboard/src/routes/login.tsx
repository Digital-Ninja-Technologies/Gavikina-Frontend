import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { LoginForm } from "@/modules/auth/components/login-form";
import { sessionQueryOptions } from "@/modules/auth/query-options";

export const Route = createFileRoute("/login")({
	validateSearch: z.object({
		redirect: z.string().optional().catch(""),
	}),
	beforeLoad: async ({ context }) => {
		const session = await context.queryClient.query(sessionQueryOptions());
		if (session) {
			throw redirect({ to: "/" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	const { redirect } = Route.useSearch();
	return <LoginForm redirectUrl={redirect} />;
}
