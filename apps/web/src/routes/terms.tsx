import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({ component: Terms });

const SECTIONS = [
	{
		heading: "1. About these terms",
		body: `These Terms & Conditions ("Terms") govern your use of gavikinaenergy.com and the products and services offered by Gavikina Nigeria Limited, trading as Gavikina Energy ("Gavikina", "we", "us", "our"). By using our website, requesting an assessment, or placing an order, you agree to these Terms.`,
	},
	{
		heading: "2. Our services",
		body: 'We size, supply, install and commission solar and energy systems ("Systems") for homes, businesses and multi-site operations across Nigeria. Prices shown on this website, including the catalogue and calculator, are indicative ranges only and are confirmed in a written quotation after a load assessment or site inspection.',
	},
	{
		heading: "3. Quotes & orders",
		body: "A quotation is not a binding contract until you accept it in writing and, where applicable, pay the agreed deposit. Final specification, pricing and delivery timelines are confirmed in your signed quotation or order form.",
	},
	{
		heading: "4. Payment",
		body: "Payment terms, including deposits, milestones and balance on completion, are set out in your quotation. Title to equipment passes to you only once payment in full has been received, except where otherwise agreed in writing.",
	},
	{
		heading: "5. Installation & site access",
		body: "You agree to provide safe and reasonable access to the installation site and accurate information about your premises and electrical load. Delays caused by site conditions, access, or third parties are not our responsibility.",
	},
	{
		heading: "6. Warranty",
		body: "Components carry the manufacturer warranties stated at quotation stage; our workmanship is covered as described in your quotation or warranty certificate. Warranty excludes damage from misuse, unauthorised modification, acts of God, or failure to maintain the System as instructed.",
	},
	{
		heading: "7. Limitation of liability",
		body: "To the fullest extent permitted by law, our liability for any claim relating to the Systems or services is limited to the amount paid for the relevant System, and we are not liable for indirect or consequential loss.",
	},
	{
		heading: "8. Intellectual property",
		body: "All content on this website, including text, images and logos, belongs to Gavikina Nigeria Limited or its licensors and may not be copied or used without permission.",
	},
	{
		heading: "9. Governing law",
		body: "These Terms are governed by the laws of the Federal Republic of Nigeria, and disputes are subject to the exclusive jurisdiction of the courts of Nigeria.",
	},
	{
		heading: "10. Changes to these terms",
		body: "We may update these Terms from time to time; the version in force is the one published on this page at the time of your order.",
	},
];

function Terms() {
	return (
		<div className="max-w-4xl section-wrapper">
			<span className="text-xs font-semibold uppercase tracking-widest text-green">
				Legal
			</span>
			<h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy sm:text-4xl lg:text-5xl">
				Terms &amp; Conditions
			</h1>
			<p className="mt-2 text-xs text-navy/50">Last updated: 2 October 2026</p>

			<div className="mt-10 flex flex-col gap-8">
				{SECTIONS.map((s) => (
					<div key={s.heading}>
						<h2 className="text-lg font-semibold tracking-tight text-navy sm:text-xl">
							{s.heading}
						</h2>
						<p className="mt-2 text-sm leading-loose text-navy/70 sm:text-[15.5px]">
							{s.body}
						</p>
					</div>
				))}

				<div>
					<h2 className="text-lg font-semibold tracking-tight text-navy sm:text-xl">
						11. Contact us
					</h2>
					<p className="mt-2 text-sm leading-loose text-navy/70 sm:text-[15.5px]">
						Gavikina Nigeria Limited (trading as Gavikina Energy)
						<br />
						14 Adeola Odeku Street, Victoria Island, Lagos, Nigeria
						<br />
						Email: hello@gavikinaenergy.com
						<br />
						Phone: 0800 428 4546
					</p>
				</div>
			</div>
		</div>
	);
}
