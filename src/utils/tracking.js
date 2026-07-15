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

function syncConsentMode() {
  if (typeof window === 'undefined' || !window.gtag) return
  if (hasAnalyticsConsent()) {
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    })
    return
  }
  const c = getConsent()
  if (c && c.analytics === false) {
    window.gtag('consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    })
  }
}

function fireAdsConversion(sendTo) {
  if (!sendTo || !window.gtag) return
  window.gtag('event', 'conversion', { send_to: sendTo })
}

function fireGaLead(method) {
  if (!hasAnalyticsConsent() || !window.gtag) return
  window.gtag('event', 'generate_lead', { method: method || 'lead' })
}

let trackingLoaded = false

export function loadTracking() {
  if (trackingLoaded || typeof window === 'undefined') return

  trackingLoaded = true
  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments)
    }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`
  document.head.appendChild(script)

  window.gtag('js', new Date())
  syncConsentMode()
  window.gtag('config', GA4_ID, {
    anonymize_ip: true,
    send_page_view: hasAnalyticsConsent(),
  })
  window.gtag('config', GOOGLE_ADS.id, { anonymize_ip: true })

  window.trackGoogleAdsTelClick = () => {
    fireGaLead('phone')
    fireAdsConversion(GOOGLE_ADS.conversion)
  }
  window.trackGoogleAdsLead = (source) => {
    fireGaLead(source || 'lead')
    fireAdsConversion(GOOGLE_ADS.leadConversion)
  }
}

export function redirectToThankYou(service = 'fabbro', leadSrc) {
  const params = new URLSearchParams({ svc: service })
  if (leadSrc) {
    params.set('lead', '1')
    params.set('src', leadSrc)
  }
  const url = `./grazie.html?${params.toString()}`
  window.setTimeout(() => {
    window.location.href = url
  }, 400)
}
