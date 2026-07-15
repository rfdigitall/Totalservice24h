/**
 * Google tag (gtag.js) + Consent Mode — Total Service 24H
 * Tag AW in pagina (richiesto da Google Ads) + eventi conversione espliciti su click tel:
 */
window.TRACKING_CONFIG = {
  googleAdsId: 'AW-17710881957',
  ga4Id: 'G-5M16LNBYZP',
  phoneE164: '+393927398625',
  googleAdsSendTo: 'AW-17710881957/RrqfCJ_M840cEKW5mv1B',
  conversionValue: 1.0,
  conversionCurrency: 'EUR',
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

;(function () {
  var cfg = window.TRACKING_CONFIG
  var adsId = cfg.googleAdsId
  var ga4Id = cfg.ga4Id
  var sendTo = cfg.googleAdsSendTo

  window.gtag('js', new Date())

  window.gtag('config', adsId, {
    allow_enhanced_conversions: true,
    conversion_linker: true,
    send_page_view: false,
  })

  window.gtag('config', ga4Id, {
    anonymize_ip: true,
    send_page_view: false,
  })

  if (sendTo) {
    window.gtag('set', {
      phone_conversion_number: cfg.phoneE164,
      phone_conversion_ids: [sendTo],
    })
  }

  var s = document.createElement('script')
  s.async = true
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(adsId)
  s.onload = function () {
    window.__tsGtagLoaded = true
    document.dispatchEvent(new CustomEvent('ts:gtag-ready'))
  }
  document.head.appendChild(s)
})()
