/**
 * Google tag (gtag.js) + Consent Mode — Total Service 24H
 * Consent default is sync; gtag.js network load is deferred until after first paint
 * so it does not compete with LCP (hero image / fonts).
 *
 * 26/08/2026: DNI / Call Forwarding DISATTIVATO (stesso fix GF/SOS).
 * call_view aveva MISSED + account call reporting puntava a conversionActions/179 morto.
 * Ora tel: va DIRETTO a 392 739 8625. Click tel (googleAdsSendTo) resta attivo.
 * Per riattivare DNI: rimetti googleAdsCallForwardSendTo sotto.
 */
window.TRACKING_CONFIG = {
  googleAdsId: 'AW-17710881957',
  ga4Id: 'G-5M16LNBYZP',
  phoneE164: '+393927398625',
  /** Display format must match the number shown on the site (Google WCM). */
  phoneDisplay: '392 739 8625',
  /** Click-to-call conversion (existing). */
  googleAdsSendTo: 'AW-17710881957/RrqfCJ_M840cEKW5mv1B',
  /** VUOTO = niente sostituzione numero Google (chiamata diretta) */
  googleAdsCallForwardSendTo: '',
  conversionValue: 1.0,
  conversionCurrency: 'EUR',
  /** Ads traffic: grant marketing consent so tel-click conversions fire without banner accept. */
  forceMarketingConsentForAds: true,
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
  var FALLBACK_MS = 4500

  function isAdsTraffic() {
    try {
      var params = new URLSearchParams(location.search)
      return !!(
        params.get('gclid') ||
        params.get('gbraid') ||
        params.get('wbraid') ||
        params.get('utm_source') === 'google' ||
        params.get('google_phone_conversion_debug') === 'true'
      )
    } catch (e) {
      return false
    }
  }

  /** Hide visible phone digits on Ads until Google forwarding number is ready. */
  window.__tsDniReveal = function (reason) {
    if (window.__tsDniRevealed) return
    window.__tsDniRevealed = true
    try {
      document.documentElement.classList.remove('ts-dni-await')
      document.documentElement.classList.add('ts-dni-ready')
    } catch (e) {}
    try {
      if (console && console.info) console.info('[TS DNI] reveal', reason || '')
    } catch (e2) {}
  }

  function armAntiFlicker() {
    if (!callForward) return
    if (!isAdsTraffic()) return
    if (document.getElementById('ts-dni-af-style')) return
    var css =
      'html.ts-dni-await:not(.ts-dni-ready) a.number-panel__phone,' +
      'html.ts-dni-await:not(.ts-dni-ready) a.btn-tel-small,' +
      'html.ts-dni-await:not(.ts-dni-ready) a.call-fab,' +
      'html.ts-dni-await:not(.ts-dni-ready) a.footer__phone-link,' +
      'html.ts-dni-await:not(.ts-dni-ready) a.btn-mech[href^="tel:"]{' +
      'font-size:0!important;letter-spacing:0!important;color:transparent!important;position:relative;}' +
      'html.ts-dni-await:not(.ts-dni-ready) a.number-panel__phone::after,' +
      'html.ts-dni-await:not(.ts-dni-ready) a.btn-tel-small::after,' +
      'html.ts-dni-await:not(.ts-dni-ready) a.call-fab::after,' +
      'html.ts-dni-await:not(.ts-dni-ready) a.footer__phone-link::after,' +
      'html.ts-dni-await:not(.ts-dni-ready) a.btn-mech[href^="tel:"]::after{' +
      'content:"Chiama ora";font-size:clamp(1rem,4vw,1.35rem);font-weight:700;letter-spacing:0.02em;' +
      'color:#8BC4D6;white-space:nowrap;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);}' +
      'html.ts-dni-await:not(.ts-dni-ready) a.btn-mech[href^="tel:"]::after,' +
      'html.ts-dni-await:not(.ts-dni-ready) a.btn-tel-small::after,' +
      'html.ts-dni-await:not(.ts-dni-ready) a.call-fab::after{color:#14171B;}' +
      'html.ts-dni-await:not(.ts-dni-ready) a.call-fab svg{opacity:0;}'
    var el = document.createElement('style')
    el.id = 'ts-dni-af-style'
    el.textContent = css
    document.head.appendChild(el)
    document.documentElement.classList.add('ts-dni-await')
    setTimeout(function () {
      if (!window.__tsDniRevealed) window.__tsDniReveal('timeout-' + FALLBACK_MS + 'ms')
    }, FALLBACK_MS)
  }

  armAntiFlicker()

  function applyWcmNumber(formatted, mobile) {
    if (typeof window.__tsApplyWcmNumber === 'function') {
      window.__tsApplyWcmNumber(formatted, mobile)
    } else {
      window.__tsPendingWcm = { formatted: formatted, mobile: mobile }
    }
    if (window.__tsDniReveal) window.__tsDniReveal('wcm-callback')
  }

  function grantAdsConsent() {
    if (!cfg.forceMarketingConsentForAds || !isAdsTraffic()) return
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    })
  }

  function bootConfigs() {
    grantAdsConsent()
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
    // Event snippet — Call Forwarding ("Chiamata" website calls) — only if enabled
    if (callForward) {
      window.gtag('config', callForward, {
        phone_conversion_number: phoneDisplay,
        phone_conversion_callback: applyWcmNumber,
      })
    }
    /* Click tel only when DNI is off — do not set phone_conversion_number */
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

