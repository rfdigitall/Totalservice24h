/**
 * Configurazione tracking — Total Service 24H
 * Consent Mode v2 (default denied) + gtag caricato da site.js su tutte le pagine.
 * GA4 (analytics) rispetta il consenso; conversioni Google Ads vengono inviate
 * sempre via gtag con Consent Mode (modeling se ad_storage denied).
 */
window.TRACKING_CONFIG = {
  googleAdsId: 'AW-17710881957',
  ga4Id: 'G-5M16LNBYZP',
  phoneE164: '+393927398625',
  /** Click telefono → conversione Ads */
  googleAdsSendTo: 'AW-17710881957/RrqfCJ_M840cEKW5mv1B',
  /** Lead WhatsApp / callback / thank-you → imposta label dedicato da Google Ads */
  googleAdsLeadSendTo: '',
}

window.dataLayer = window.dataLayer || []
window.gtag = window.gtag || function () { window.dataLayer.push(arguments) }

window.gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500,
})
