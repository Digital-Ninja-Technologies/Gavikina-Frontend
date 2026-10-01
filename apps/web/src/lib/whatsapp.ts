const WHATSAPP_NUMBER = "2348145865720";

export function buildWhatsAppUrl(message: string) {
	return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
