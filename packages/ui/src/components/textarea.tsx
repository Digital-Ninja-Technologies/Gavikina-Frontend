import { cn } from "@workspace/ui/lib/utils";
import type * as React from "react";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"flex field-sizing-content w-full rounded-lg border border-navy/14 bg-transparent px-3 py-3 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-navy/40 focus-visible:border-navy/28 focus-visible:ring-3 focus-visible:ring-green/14 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 resize-y min-h-24 max-h-40",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
