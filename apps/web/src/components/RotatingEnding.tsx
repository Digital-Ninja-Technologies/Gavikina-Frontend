import { useEffect, useState } from "react";

const ENDINGS = [
	"SMEs",
	"Businesses",
	"Homes",
	"Commercial Organizations",
	"Multiple Locations",
];

const HOLD_MS = 2000;
const DROP_MS = 360;

export default function RotatingEnding() {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setIndex((i) => (i + 1) % ENDINGS.length);
		}, HOLD_MS + DROP_MS);
		return () => clearInterval(id);
	}, []);

	return (
		<span className="relative inline-flex h-[1.2em] items-center overflow-hidden align-bottom">
			<span key={index} className="animate-gv-drop-in inline-block">
				{ENDINGS[index]}
			</span>
		</span>
	);
}
