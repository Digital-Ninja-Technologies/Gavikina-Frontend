import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import type { AdminLoginValues } from "@workspace/schemas";
import { adminLoginSchema } from "@workspace/schemas";
import { Button } from "@workspace/ui/components/button";
import { FormInput } from "@workspace/ui/components/form-fields"; // Adjust if you use a specific PasswordInput
import { toast } from "@workspace/ui/components/toast";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { loginAdmin } from "../api";
import { sessionQueryOptions } from "../query-options";

export function LoginForm({ redirectUrl }: { redirectUrl?: string }) {
	const navigate = useNavigate();
	const router = useRouter();
	const queryClient = useQueryClient();

	const form = useForm<AdminLoginValues>({
		resolver: zodResolver(adminLoginSchema),
		defaultValues: { email: "", password: "" },
		mode: "onChange",
	});

	const mutation = useMutation({
		mutationFn: loginAdmin,
		onSuccess: async () => {
			toast.add({ title: "Sign in successful", type: "success" });

			await queryClient.query({
				...sessionQueryOptions(),
				staleTime: 0,
			});

			router.invalidate();
			navigate({ to: redirectUrl || "/", replace: true });
		},
		onError: (error) => {
			toast.add({
				title: "Sign in failed",
				description: error?.message || "Invalid email or password.",
				type: "error",
			});
		},
	});

	const onSubmit = (data: AdminLoginValues) => {
		mutation.mutate(data);
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-cream px-4 py-10">
			<div className="w-full max-w-md animate-gv-fade">
				<img
					src={`/logo-primary-ondark.svg`}
					alt="Gavikina Energy"
					className="mx-auto block h-8 w-auto"
				/>

				<div className="mt-8 rounded-3xl border border-navy/10 bg-white p-8 shadow-xl">
					<h1 className="text-2xl font-semibold tracking-tight text-navy">
						Admin sign in
					</h1>
					<p className="mb-6 mt-2 text-sm leading-relaxed text-navy/60">
						One account manages every enquiry, assessment and project on the
						site.
					</p>

					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4"
					>
						<FormInput
							control={form.control}
							name="email"
							type="email"
							label="Admin email"
							placeholder="admin@gavikina.com"
						/>

						<FormInput
							control={form.control}
							name="password"
							type="password"
							label="Password"
							placeholder="••••••••"
						/>

						<Button
							type="submit"
							size="lg"
							className="mt-2 w-full"
							disabled={!form.formState.isValid || mutation.isPending}
						>
							{mutation.isPending ? (
								<span className="flex items-center gap-2">
									<Loader2 className="size-4 animate-spin" /> Signing in...
								</span>
							) : (
								"Sign in"
							)}
						</Button>

						<span className="mt-2 text-center text-xs text-navy/50">
							Two-factor prompt follows on a live deployment.
						</span>
					</form>
				</div>
			</div>
		</div>
	);
}
