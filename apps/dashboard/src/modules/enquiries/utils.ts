const DUMMY_EMAILS = new Set(["no-email@provided.com", "none", "n/a", ""])
const DUMMY_PHONES = new Set(["0000000000", "0", "none", "n/a", ""])

export function cleanEmail(email?: string | null): string | undefined {
  if (!email) return undefined
  const trimmed = email.trim()
  if (DUMMY_EMAILS.has(trimmed.toLowerCase())) return undefined
  if (!trimmed.includes("@")) return undefined
  return trimmed
}

export function cleanPhone(phone?: string | null): string | undefined {
  if (!phone) return undefined
  const trimmed = phone.trim()
  if (DUMMY_PHONES.has(trimmed.toLowerCase())) return undefined
  // Strips non-digits to check if it is just repeated zeros
  const digits = trimmed.replace(/\D/g, "")
  if (!digits || /^0+$/.test(digits)) return undefined
  return trimmed
}
