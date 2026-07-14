import { COOKIE_CONSENT_KEY, GA4_ID, GOOGLE_ADS } from '../constants/config'

export function getConsent() {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setConsent(analytics) {
  localStorage.setItem(
    COOKIE_CONSENT_KEY,
    JSON.stringify({ analytics, ts: Date.now() }),
  )
}

export function hasAnalyticsConsent() {
  return getConsent()?.analytics === true
}

let trackingLoaded = false

export function loadTracking() {
  if (trackingLoaded || typeof window === 'undefined') return
  if (!hasAnalyticsConsent()) return

  trackingLoaded = true
  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments)
    }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS.id}`
  document.head.appendChild(script)

  window.gtag('js', new Date())
  window.gtag('config', GOOGLE_ADS.id, { anonymize_ip: true })
  window.gtag('config', GA4_ID, { anonymize_ip: true })

  const fire = (source) => {
    if (GOOGLE_ADS.conversion) {
      window.gtag('event', 'conversion', { send_to: GOOGLE_ADS.conversion })
    }
    window.gtag('event', 'generate_lead', { method: source })
  }

  window.trackGoogleAdsTelClick = () => fire('phone')
  window.trackGoogleAdsLead = (source) => fire(source || 'lead')
}

export function redirectToThankYou(service = 'fabbro') {
  const url = `./grazie.html?svc=${encodeURIComponent(service)}`
  window.setTimeout(() => {
    window.location.href = url
  }, 400)
}
