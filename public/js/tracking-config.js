/**
 * Configurazione tracking — Total Service 24H
 * Consent Mode v2 (default denied). gtag.js viene caricato da site.js
 * solo DOPO Accetta / Solo necessari (o se esiste già una scelta salvata).
 * Con "Solo necessari": ad_storage/analytics_storage/ad_user_data/ad_personalization
 * restano denied; conversion events possono usare modeling cookieless.
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
