import { createFileRoute } from "@tanstack/react-router";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { FAQS } from "../lib/content";

export const Route = createFileRoute("/faq")({ component: Faq });

function Faq() {
	return (
		<div className="max-w-4xl section-wrapper">
			<span className="text-xs font-semibold uppercase tracking-widest text-green">
				FAQ
			</span>
			<h1 className="mt-2 text-3xl leading-[1.2] font-semibold tracking-tight text-navy sm:text-4xl lg:text-5xl">
				Questions we get every week.
			</h1>

			<div className="mt-10">
				<Accordion defaultValue={["item-0"]}>
					{FAQS.map((f, i) => (
						<AccordionItem
							key={f.q}
							value={`item-${i}`}
							className="border-b border-navy/10 py-1"
						>
							<AccordionTrigger className="text-left text-base tracking-tight text-navy hover:no-underline sm:text-lg">
								{f.q}
							</AccordionTrigger>
							<AccordionContent className="text-sm leading-loose text-navy/70 sm:text-base">
								{f.a}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	);
}
