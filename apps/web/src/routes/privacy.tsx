import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({ component: Privacy });

const SECTIONS = [
	{
		heading: "1. Who we are",
		body: `Gavikina Energy is the trading brand of Gavikina Nigeria Limited ("Gavikina", "we", "us", "our"), a company incorporated in Nigeria. This Privacy Policy explains how we collect, use, share and protect personal information when you visit gavikinaenergy.com, request an energy assessment, order from our catalogue, or otherwise interact with us.`,
	},
	{
		heading: "2. Information we collect",
		body: "Contact details you provide (name, phone, email, address) when you request an assessment, a quote, or contact us; site and load information you share for sizing a system (approximate location, appliances, consumption); technical information collected automatically (IP address, browser, pages visited) through standard web analytics; and communications you send us.",
	},
	{
		heading: "3. How we use it",
		body: "To respond to enquiries and schedule assessments, prepare quotes and deliver installations, provide after-sales support and warranty service, improve our website and services, and meet legal, tax and regulatory obligations.",
	},
	{
		heading: "4. Legal basis & NDPR",
		body: "We process personal data in line with the Nigeria Data Protection Act 2023 and the Nigeria Data Protection Regulation. We rely on your consent, the need to perform a contract with you (for example, an installation), and our legitimate business interests.",
	},
	{
		heading: "5. Sharing",
		body: "We do not sell personal information. We may share it with field engineers and installation partners assigned to your project, payment and logistics providers, professional advisers, and regulators or law enforcement where required by law.",
	},
	{
		heading: "6. Data retention",
		body: "We keep personal information for as long as needed to deliver services, honour warranties, and meet legal or tax retention requirements, after which it is deleted or anonymised.",
	},
	{
		heading: "7. Your rights",
		body: "Subject to applicable law, you may request access to, correction of, or deletion of your personal information, and may object to or restrict certain processing. Contact us using the details below to exercise these rights.",
	},
	{
		heading: "8. Security",
		body: "We apply reasonable technical and organisational measures to protect personal information, but no system is completely secure and we cannot guarantee absolute security.",
	},
	{
		heading: "9. Cookies",
		body: "Our website may use cookies and similar technologies for analytics and to remember preferences. You can control cookies through your browser settings.",
	},
	{
		heading: "10. Children",
		body: "Our services are directed at businesses and adults making purchasing decisions. We do not knowingly collect personal information from children.",
	},
	{
		heading: "11. Changes to this policy",
		body: 'We may update this policy from time to time. The "last updated" date below reflects the most recent revision.',
	},
];

function Privacy() {
	return (
		<div className="max-w-4xl section-wrapper">
			<span className="text-xs font-semibold uppercase tracking-widest text-green">
				Legal
			</span>
			<h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy sm:text-4xl lg:text-5xl">
				Privacy Policy
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
						12. Contact us
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
