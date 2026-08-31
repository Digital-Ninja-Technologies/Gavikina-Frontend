import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@workspace/ui/components/alert-dialog";
import { cn } from "@workspace/ui/lib/utils";
import { createContext, use, useRef, useState } from "react";

interface ConfirmOptions {
	title: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "default" | "destructive";
}

type ConfirmContextType = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
	const [options, setOptions] = useState<ConfirmOptions | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const resolverRef = useRef<((value: boolean) => void) | null>(null);

	const confirm = (opts: ConfirmOptions): Promise<boolean> => {
		setOptions(opts);
		setIsOpen(true);
		return new Promise((resolve) => {
			resolverRef.current = resolve;
		});
	};

	const handleAction = (result: boolean) => {
		setIsOpen(false);
		resolverRef.current?.(result);
		resolverRef.current = null;
	};

	return (
		<ConfirmContext.Provider value={confirm}>
			{children}
			<AlertDialog
				open={isOpen}
				onOpenChange={(open) => !open && handleAction(false)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{options?.title}</AlertDialogTitle>
						{options?.description && (
							<AlertDialogDescription>
								{options.description}
							</AlertDialogDescription>
						)}
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => handleAction(false)}>
							{options?.cancelText || "Cancel"}
						</AlertDialogCancel>

						<AlertDialogAction
							onClick={() => handleAction(true)}
							className={cn(
								options?.variant === "destructive" &&
									"bg-destructive text-accent-foreground hover:bg-destructive/90",
							)}
						>
							{options?.confirmText || "Continue"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</ConfirmContext.Provider>
	);
}

export function useConfirm() {
	const context = use(ConfirmContext);

	if (!context) {
		throw new Error("useConfirm must be used within a ConfirmProvider");
	}

	return context;
}
