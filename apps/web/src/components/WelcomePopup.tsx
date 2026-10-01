import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { buildWhatsAppUrl } from "../lib/whatsapp";

const WHATSAPP_URL = buildWhatsAppUrl(
	"I will love to go solar powered, I need more clarification.",
);

const SEEN_KEY = "gv-welcome-popup-seen";

export default function WelcomePopup() {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		try {
			if (sessionStorage.getItem(SEEN_KEY)) return;
		} catch {
			// private mode / storage blocked — fall through and show it anyway
		}
		const timer = setTimeout(() => setOpen(true), 1200);
		return () => clearTimeout(timer);
	}, []);

	const dismiss = () => {
		setOpen(false);
		try {
			sessionStorage.setItem(SEEN_KEY, "1");
		} catch {
			// ignore
		}
	};

	return (
		<Dialog open={open} onOpenChange={(next) => !next && dismiss()}>
			<DialogContent
				showCloseButton={false}
				className="rounded-3xl border border-navy/10 bg-white p-8 text-center shadow-2xl sm:max-w-md"
			>
				<DialogClose
					aria-label="Close dialog"
					className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-lg border border-navy/10 bg-white text-navy/70 transition-colors hover:bg-cream/40 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
				>
					<X className="size-4" />
				</DialogClose>

				<span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-green/10 text-green">
					<MessageCircle className="size-6" />
				</span>

				<DialogTitle className="mt-4 text-xl font-semibold tracking-tight text-navy">
					Skip the assessment
				</DialogTitle>
				<DialogDescription className="mt-2 text-sm leading-relaxed text-navy/70">
					If you'd rather not go through the full assessment, talk to a team
					member right away and get your questions answered directly.
				</DialogDescription>

				<div className="mt-6 flex flex-col gap-2">
					<Button
						variant="primary"
						size="lg"
						className="w-full"
						nativeButton={false}
						onClick={dismiss}
						render={
							<a
								href={WHATSAPP_URL}
								target="_blank"
								rel="noopener noreferrer"
							/>
						}
					>
						<MessageCircle /> Chat with us on WhatsApp
					</Button>
					<Button
						variant="ghost"
						size="lg"
						className="w-full text-navy/60"
						onClick={dismiss}
					>
						Continue browsing
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
