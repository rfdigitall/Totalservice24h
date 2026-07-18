/**
 * Google tag (gtag.js) + Consent Mode — Total Service 24H
 * Consent default is sync; gtag.js network load is deferred until after first paint
 * so it does not compete with LCP (hero image / fonts). Ads traffic loads gtag
 * immediately so Call Forwarding can replace the number before the user dials.
 */
window.TRACKING_CONFIG = {
  googleAdsId: 'AW-17710881957',
  ga4Id: 'G-5M16LNBYZP',
  phoneE164: '+393927398625',
  /** Display format must match the number shown on the site (Google WCM). */
  phoneDisplay: '392 739 8625',
  /** Click-to-call conversion (existing). */
  googleAdsSendTo: 'AW-17710881957/RrqfCJ_M840cEKW5mv1B',
  /** Calls from website / Call Forwarding conversion. */
  googleAdsCallForwardSendTo: 'AW-17710881957/-QrICMGWztIcEKW5mv1B',
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
  var callForward = cfg.googleAdsCallForwardSendTo
  var phoneDisplay = cfg.phoneDisplay || '392 739 8625'
  var started = false

  function applyWcmNumber(formatted, mobile) {
    if (typeof window.__tsApplyWcmNumber === 'function') {
      window.__tsApplyWcmNumber(formatted, mobile)
    } else {
      window.__tsPendingWcm = { formatted: formatted, mobile: mobile }
    }
  }

  function bootConfigs() {
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
    // Event snippet — Call Forwarding ("Chiamata" website calls)
    if (callForward) {
      window.gtag('config', callForward, {
        phone_conversion_number: phoneDisplay,
        phone_conversion_callback: applyWcmNumber,
      })
    }
    if (sendTo) {
      window.gtag('set', {
        phone_conversion_number: phoneDisplay,
        phone_conversion_ids: [sendTo],
      })
    }
  }

  function injectGtag() {
    if (started) return
    started = true
    bootConfigs()
    var s = document.createElement('script')
    s.async = true
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(adsId)
    s.onload = function () {
      window.__tsGtagLoaded = true
      document.dispatchEvent(new CustomEvent('ts:gtag-ready'))
    }
    document.head.appendChild(s)
  }

  // Expose so site.js can load gtag immediately on cookie accept
  window.__tsLoadGtag = injectGtag

  function isAdsTraffic() {
    try {
      var params = new URLSearchParams(location.search)
      return !!(params.get('gclid') || params.get('gbraid') || params.get('wbraid') || params.get('utm_source') === 'google')
    } catch (e) {
      return false
    }
  }

  function schedule() {
    // Call Forwarding needs the tag early for paid clicks
    if (isAdsTraffic()) {
      injectGtag()
      return
    }
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(function () { injectGtag() }, { timeout: 2800 })
    } else {
      window.addEventListener('load', function () {
        setTimeout(injectGtag, 1)
      })
    }
    // Hard fallback if idle never fires (some mobile browsers)
    setTimeout(injectGtag, 3500)
  }

  // Prefer after first paint when available (organic traffic only path)
  try {
    if (typeof PerformanceObserver === 'function' && !isAdsTraffic()) {
      var done = false
      var po = new PerformanceObserver(function (list) {
        var entries = list.getEntries()
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].name === 'first-contentful-paint' || entries[i].entryType === 'paint') {
            if (done) return
            done = true
            try { po.disconnect() } catch (e) {}
            setTimeout(injectGtag, 50)
            return
          }
        }
      })
      po.observe({ type: 'paint', buffered: true })
      schedule()
      return
    }
  } catch (e) {}
  schedule()
})()
