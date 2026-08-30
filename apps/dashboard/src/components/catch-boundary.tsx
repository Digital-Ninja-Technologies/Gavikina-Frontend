import { useRouter } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardCatchBoundary({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	const router = useRouter();

	return (
		<div className="flex min-h-screen flex-col items-center justify-center space-y-6 p-4 text-center">
			<div className="rounded-full bg-red-50 p-4 text-red-500">
				<AlertCircle className="size-12" />
			</div>

			<div className="space-y-2">
				<h2 className="text-2xl font-bold tracking-tight text-navy">
					Unable to load Dashboard
				</h2>
				<p className="mx-auto max-w-sm text-sm text-navy/70">
					{error.message ||
						"We encountered an error while loading your session."}
				</p>
			</div>

			<div className="flex items-center gap-4">
				<Button
					variant="outline"
					onClick={() => {
						router.invalidate();
						reset();
					}}
					className="gap-2"
				>
					<RefreshCw className="size-4" />
					Try Again
				</Button>

				<Button onClick={() => router.navigate({ to: "/login" })}>
					Back to Login
				</Button>
			</div>
		</div>
	);
}
