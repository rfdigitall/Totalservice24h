import { WHATSAPP_NUMBER } from '../constants/config'

export function normalizeItalianPhone(raw) {
  const digits = raw.replace(/\D/g, '')
  if (digits.length < 9 || digits.length > 13) return null
  if (digits.startsWith('39') && digits.length >= 11) return `+${digits}`
  if (digits.startsWith('3') && digits.length === 10) return `+39${digits}`
  return `+${digits}`
}

export function buildWhatsAppUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}
