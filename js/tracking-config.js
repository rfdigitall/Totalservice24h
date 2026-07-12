/**
 * Configurazione tracking — Total Service 24H
 * Conversione Google Ads: Chiamata da Bottone
 */
window.TRACKING_CONFIG = {
  googleAdsId: 'AW-17710881957',
  ga4Id: 'G-5M16LNBYZP',
  phoneE164: '+393927398625',
  googleAdsSendTo: 'AW-17710881957/RrqfCJ_M840cEKW5mv1B'
}

;(function () {
  'use strict'
  var TRC = window.TRACKING_CONFIG
  var GOOGLE_ADS = TRC.googleAdsId
  var GA4 = TRC.ga4Id
  var SEND_TO = TRC.googleAdsSendTo
  var PHONE = TRC.phoneE164

  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments) }

  window.gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500
  })

  var s = document.createElement('script')
  s.async = true
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4
  document.head.appendChild(s)

  window.gtag('js', new Date())
  window.gtag('config', GA4, {
    anonymize_ip: true,
    send_page_view: false
  })
  window.gtag('set', {
    phone_conversion_number: PHONE,
    phone_conversion_ids: SEND_TO ? [SEND_TO] : []
  })
  window.gtag('config', GOOGLE_ADS, {
    anonymize_ip: true,
    conversion_linker: true,
    allow_enhanced_conversions: true,
    phone_conversion_number: PHONE
  })
})()
