import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { AlertCircle, Loader2, RefreshCcw } from "lucide-react";
import type React from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { ApiError } from "#/lib/api-client";

export function ComponentErrorState({
	error,
	resetErrorBoundary,
	title,
}: {
	error: Error | ApiError;
	resetErrorBoundary: () => void;
	title?: string;
}) {
	const errorTitle = title || "Something went wrong";

	return (
		<div className="flex min-h-40 flex-col items-center justify-center space-y-4 p-6 text-center">
			<div className="rounded-full bg-destructive/10 p-4">
				<AlertCircle className="size-8 text-destructive" />
			</div>
			<div className="space-y-1">
				<h3 className="text-lg font-semibold">{errorTitle}</h3>
				<p className="max-w-sm wrap-break-word text-sm text-muted-foreground">
					{error?.message ||
						(error as unknown as { data: { message: string } })?.data
							?.message ||
						"Something went wrong while fetching details."}
				</p>
			</div>
			<Button variant="outline" onClick={resetErrorBoundary} className="gap-2">
				<RefreshCcw className="size-4" />
				Try Again
			</Button>
		</div>
	);
}

interface AsyncBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
	errorTitle?: string;
	ignoreQueryReset?: boolean;
	showError?: boolean;
}

export function AsyncBoundary({
	children,
	fallback,
	errorTitle,
	ignoreQueryReset = false,
	showError = true,
}: AsyncBoundaryProps) {
	const loadingFallback = fallback || (
		<div className="flex min-h-50 h-full items-center justify-center">
			<Loader2 className="size-8 animate-spin text-muted-foreground" />
		</div>
	);

	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					onReset={ignoreQueryReset ? undefined : reset}
					fallbackRender={({ error, resetErrorBoundary }) => {
						if (!showError) {
							return (
								<span className="text-sm text-destructive">
									{(error as Error)?.message ||
										errorTitle ||
										"An error occurred"}
								</span>
							);
						}

						return (
							<ComponentErrorState
								error={error as Error}
								resetErrorBoundary={resetErrorBoundary}
								title={errorTitle}
							/>
						);
					}}
				>
					<Suspense fallback={loadingFallback}>{children}</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
