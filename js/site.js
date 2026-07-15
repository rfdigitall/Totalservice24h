(function () {
  'use strict'

  var CFG = window.LANDING_CONFIG || {}
  var TRC = window.TRACKING_CONFIG || {}
  var WA_NUM = '393927398625'
  var COOKIE_KEY = 'ts_cookie_consent_v1'
  var PROMPT_KEY = 'ts_prompt_shown'
  var CALL_TS_KEY = 'ts_call_ts'
  var CALLBACK_DONE_KEY = 'ts_callback_done'
  var LEAD_CONV_PREFIX = 'ts_lead_conv_'
  var GOOGLE_ADS_SEND_TO = TRC.googleAdsSendTo || ''
  var GOOGLE_ADS_LEAD_SEND_TO = TRC.googleAdsLeadSendTo || ''
  var GA4 = TRC.ga4Id || 'G-5M16LNBYZP'
  var TIMED_PROMPT_MS = 35000
  var CALLBACK_WINDOW_MS = 10000
  var NIGHT_START = 20
  var NIGHT_END = 7
  var callArmed = false
  var gtagReadyQueue = []

  function $(sel, root) { return (root || document).querySelector(sel) }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)) }

  function waUrl(text) { return 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(text) }

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(COOKIE_KEY) || 'null') } catch (e) { return null }
  }
  function setConsent(analytics) {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics: analytics, ts: Date.now() }))
  }

  /** Consenso solo per GA4 / misurazione comportamento (non blocca conversioni Ads). */
  function hasAnalyticsConsent() {
    var c = getConsent()
    return !!(c && c.analytics)
  }

  /** Consent Mode v2: analytics separato da tag Ads; conversioni inviate sempre via gtag. */
  function syncConsentMode() {
    if (!window.gtag) return
    if (hasAnalyticsConsent()) {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      })
      return
    }
    var c = getConsent()
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

  function trackLeadOnce(src) {
    var key = LEAD_CONV_PREFIX + (src || 'lead')
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
    fireGaLead(src || 'lead')
    fireAdsConversion(GOOGLE_ADS_LEAD_SEND_TO)
  }

  function initTrackingHandlers() {
    window.trackTel = function () {
      fireGaLead('phone')
      fireAdsConversion(GOOGLE_ADS_SEND_TO)
    }
    window.trackLead = function (src) {
      trackLeadOnce(src || 'lead')
    }
  }

  function flushGtagReadyQueue() {
    while (gtagReadyQueue.length) {
      var fn = gtagReadyQueue.shift()
      try { fn() } catch (e) { /* ignore */ }
    }
  }

  function loadGtagScript(done) {
    if (window.__tsGtagLoaded) {
      done()
      return
    }
    var GOOGLE_ADS = TRC.googleAdsId || ''
    var PHONE = TRC.phoneE164 || '+393927398625'
    var SEND_TO = TRC.googleAdsSendTo || ''
    var s = document.createElement('script')
    s.async = true
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4)
    s.onload = function () {
      window.__tsGtagLoaded = true
      window.gtag('js', new Date())
      window.gtag('config', GA4, { anonymize_ip: true, send_page_view: false })
      window.gtag('set', {
        phone_conversion_number: PHONE,
        phone_conversion_ids: SEND_TO ? [SEND_TO] : [],
      })
      if (GOOGLE_ADS) {
        window.gtag('config', GOOGLE_ADS, {
          anonymize_ip: true,
          conversion_linker: true,
          allow_enhanced_conversions: true,
          phone_conversion_number: PHONE,
        })
      }
      done()
    }
    document.head.appendChild(s)
  }

  function ensureGtagReady(done) {
    if (typeof done === 'function') gtagReadyQueue.push(done)
    if (window.__tsTrackReady) {
      flushGtagReadyQueue()
      return
    }
    loadGtagScript(function () {
      syncConsentMode()
      if (!window.__tsTrackReady) {
        window.__tsTrackReady = true
        initTrackingHandlers()
        if (hasAnalyticsConsent()) {
          window.gtag('config', GA4, { anonymize_ip: true, send_page_view: true })
        }
      }
      flushGtagReadyQueue()
    })
  }

  function bindTelTracking(links) {
    links.forEach(function (a) {
      if (a.__tsBound) return
      a.__tsBound = true
      a.addEventListener('click', function () {
        markCallAttempt()
        ensureGtagReady(function () {
          if (window.trackTel) window.trackTel()
        })
      })
    })
  }

  function initTelLinks() {
    bindTelTracking($$('a[href^="tel:"]'))
  }

  function setModalOpen(open) {
    document.body.classList.toggle('modal-open', open)
  }

  function thankYou(leadSrc) {
    setTimeout(function () {
      var q = 'svc=' + encodeURIComponent(CFG.id || 'fabbro')
      if (leadSrc) {
        q += '&lead=1&src=' + encodeURIComponent(leadSrc)
      }
      location.href = './grazie.html?' + q
    }, 400)
  }

  function getProblemValue() {
    var hidden = $('#contact-problem-val')
    if (hidden && hidden.value) return hidden.value
    var sel = $('#contact-problem')
    return sel ? sel.value : ''
  }

  function initProblemPick() {
    var wrap = $('#contact-problem-pick')
    var hidden = $('#contact-problem-val')
    if (!wrap || !CFG.urgencies) return
    var keys = Object.keys(CFG.urgencies)
    hidden.value = ''
    wrap.innerHTML = keys.map(function (k) {
      return '<button type="button" class="problem-pick__btn" data-val="' + k + '">' + CFG.urgencies[k] + '</button>'
    }).join('')
    $$('.problem-pick__btn', wrap).forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('.problem-pick__btn', wrap).forEach(function (b) { b.classList.remove('is-active') })
        btn.classList.add('is-active')
        hidden.value = btn.getAttribute('data-val')
      })
    })
  }

  function initFaqAccordion() {
    $$('.home-faq').forEach(function (faq) {
      $$('details', faq).forEach(function (det) {
        det.addEventListener('toggle', function () {
          if (!det.open) return
          $$('details', faq).forEach(function (other) {
            if (other !== det) other.open = false
          })
        })
      })
    })
  }

  function initContactForm() {
    var form = $('#contact-form')
    if (!form) return
    initProblemPick()
    var sel = $('#contact-problem')
    if (sel && CFG.urgencies && !$('#contact-problem-pick')) {
      sel.innerHTML = '<option value="">Seleziona il problema</option>' + Object.keys(CFG.urgencies).map(function (k) {
        return '<option value="' + k + '">' + CFG.urgencies[k] + '</option>'
      }).join('')
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var street = $('#contact-street').value.trim()
      var num = $('#contact-number').value.trim()
      var err = $('#contact-err')
      var consent = $('#contact-consent').checked
      var problemKey = getProblemValue()
      err.textContent = ''
      if (!problemKey) { err.textContent = 'Seleziona il problema.'; return }
      if (!street) { err.textContent = 'Inserisci la via.'; return }
      if (!num) { err.textContent = 'Inserisci il civico.'; return }
      if (!consent) { err.textContent = 'Accetta la privacy.'; return }
      ensureGtagReady(function () {
        if (window.trackLead) window.trackLead('whatsapp_form')
      })
      var problem = CFG.urgencies[problemKey] || problemKey
      var svc = CFG.id === 'idraulico' ? 'Idraulico h24' : 'Fabbro h24'
      var msg = [
        CFG.whatsappPrefix || 'Richiesta — Total Service 24H',
        '',
        'Servizio: ' + svc,
        'Tipo di emergenza: ' + problem,
        'Indirizzo: Via ' + street + ', n. ' + num,
        '',
        'Richiedo un intervento urgente nella mia zona.',
        'Sono disponibile per essere ricontattato al più presto.',
        '',
        'Consenso privacy: confermato',
        '— totalservice24h.it'
      ].join('\n')
      window.open(waUrl(msg), '_blank', 'noopener,noreferrer')
      thankYou('whatsapp_form')
    })
  }

  function markCallAttempt() {
    if (!$('#callback-modal') || sessionStorage.getItem(CALLBACK_DONE_KEY)) return
    sessionStorage.setItem(CALL_TS_KEY, String(Date.now()))
    callArmed = true
  }

  function openCallbackModal() {
    var modal = $('#callback-modal')
    if (!modal || sessionStorage.getItem(CALLBACK_DONE_KEY)) return
    modal.classList.add('is-open')
    setModalOpen(true)
  }

  function closeCallbackModal() {
    var modal = $('#callback-modal')
    if (!modal) return
    modal.classList.remove('is-open')
    if (!$('.modal.is-open')) setModalOpen(false)
  }

  function checkCallbackReturn() {
    if (!callArmed || sessionStorage.getItem(CALLBACK_DONE_KEY)) return
    var raw = sessionStorage.getItem(CALL_TS_KEY)
    if (!raw) return
    var elapsed = Date.now() - Number(raw)
    if (elapsed > 0 && elapsed < CALLBACK_WINDOW_MS) {
      openCallbackModal()
      callArmed = false
    }
  }

  function initCallbackGuard() {
    var modal = $('#callback-modal')
    var form = $('#callback-form')
    if (!modal) return

    $$('[data-close-callback]').forEach(function (b) {
      b.addEventListener('click', function () { closeCallbackModal() })
    })

    var waAlt = $('[data-callback-wa]')
    if (waAlt) {
      waAlt.addEventListener('click', function () {
        sessionStorage.setItem(CALLBACK_DONE_KEY, '1')
        closeCallbackModal()
      })
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault()
        var phone = $('#callback-phone').value.trim()
        var consent = $('#callback-consent').checked
        var err = $('#callback-err')
        var digits = phone.replace(/\D/g, '')
        err.textContent = ''
        if (digits.length < 9) { err.textContent = 'Inserisci un numero valido.'; return }
        if (!consent) { err.textContent = 'Accetta la privacy.'; return }
        ensureGtagReady(function () {
          if (window.trackLead) window.trackLead('callback_form')
        })
        var normalized = digits.indexOf('39') === 0 ? '+' + digits : '+39' + digits
        var svc = CFG.id === 'idraulico' ? 'Idraulico h24' : 'Fabbro h24'
        var msg = [
          CFG.whatsappPrefix || 'Richiesta — Total Service 24H',
          '',
          'Servizio: ' + svc,
          'Richiesta richiamata',
          'Numero cliente: ' + normalized,
          '',
          'Non sono riuscito a completare la chiamata. Ricontattatemi al più presto.',
          'Consenso privacy: confermato',
          '— totalservice24h.it'
        ].join('\n')
        sessionStorage.setItem(CALLBACK_DONE_KEY, '1')
        window.open(waUrl(msg), '_blank', 'noopener,noreferrer')
        closeCallbackModal()
        thankYou('callback_form')
      })
    }

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') checkCallbackReturn()
    })
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) checkCallbackReturn()
    })
    window.addEventListener('focus', checkCallbackReturn)
  }

  function openCallPrompt() {
    var modal = $('#exit-modal')
    if (!modal || sessionStorage.getItem(PROMPT_KEY)) return
    sessionStorage.setItem(PROMPT_KEY, '1')
    modal.classList.add('is-open')
    setModalOpen(true)
  }

  function initCallPrompt() {
    var modal = $('#exit-modal')
    if (!modal) return
    $$('[data-close-exit]').forEach(function (b) {
      b.addEventListener('click', function () {
        modal.classList.remove('is-open')
        if (!$('.modal.is-open')) setModalOpen(false)
      })
    })
    if (!sessionStorage.getItem(PROMPT_KEY)) {
      setTimeout(openCallPrompt, TIMED_PROMPT_MS)
    }
    document.documentElement.addEventListener('mouseleave', function (e) {
      if (e.clientY > 0 || sessionStorage.getItem(PROMPT_KEY)) return
      openCallPrompt()
    }, { once: true })
  }

  function getRomeHour() {
    return parseInt(new Intl.DateTimeFormat('it-IT', {
      timeZone: 'Europe/Rome',
      hour: 'numeric',
      hour12: false
    }).format(new Date()), 10)
  }

  function isNightMode() {
    var h = getRomeHour()
    return h >= NIGHT_START || h < NIGHT_END
  }

  function initDayNight() {
    var night = isNightMode()
    document.body.classList.toggle('theme-night', night)
    $$('[data-day]').forEach(function (el) {
      var text = night ? el.getAttribute('data-night') : el.getAttribute('data-day')
      if (text) el.textContent = text
    })
  }

  function initCookie() {
    var banner = $('#cookie-banner')
    if (!banner) {
      ensureGtagReady(function () {})
      return
    }
    if (hasAnalyticsConsent()) {
      banner.classList.add('hidden')
      ensureGtagReady(function () {})
      return
    }
    $('#cookie-accept').addEventListener('click', function () {
      setConsent(true)
      banner.classList.add('hidden')
      ensureGtagReady(function () {
        syncConsentMode()
        if (window.gtag && hasAnalyticsConsent()) {
          window.gtag('config', GA4, { anonymize_ip: true, send_page_view: true })
        }
      })
    })
    $('#cookie-reject').addEventListener('click', function () {
      setConsent(false)
      banner.classList.add('hidden')
      ensureGtagReady(function () {
        syncConsentMode()
      })
    })
    ensureGtagReady(function () {})
  }

  function initGraziePage() {
    if (!document.body.classList.contains('grazie-page')) return
    var params = new URLSearchParams(location.search)
    var svc = params.get('svc') || 'fabbro'
    var back = document.getElementById('back')
    var msg = document.getElementById('msg')
    if (back) back.href = svc === 'idraulico' ? './idraulico.html' : './fabbro.html'
    if (msg && svc === 'idraulico') {
      msg.textContent = 'Richiesta idraulico inviata su WhatsApp. Un operatore confermerà i tempi di intervento.'
    }
    ensureGtagReady(function () {
      if (params.get('lead') === '1') {
        var src = params.get('src') || 'form'
        if (window.trackLead) window.trackLead(src)
      }
    })
    initTelLinks()
  }

  function renderServices() {
    var grid = $('#services-grid')
    if (!grid || !CFG.services) return
    grid.innerHTML = CFG.services.map(function (s) {
      return '<article class="service"><strong>' + s.title + '</strong><small>' + s.desc + '</small></article>'
    }).join('')
  }

  function renderFooterServices() {
    var ul = $('#footer-services')
    if (!ul || !CFG.footerServices) return
    ul.innerHTML = CFG.footerServices.map(function (s) { return '<li>' + s + '</li>' }).join('')
  }

  function initAdsTraffic() {
    var params = new URLSearchParams(location.search)
    if (params.get('gclid') || params.get('gbraid') || params.get('wbraid') || params.get('utm_source') === 'google') {
      document.body.classList.add('ads-traffic')
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.remove('modal-open')
    initAdsTraffic()
    initDayNight()
    renderServices()
    renderFooterServices()
    initTelLinks()
    initContactForm()
    initFaqAccordion()
    initCallbackGuard()
    initCallPrompt()
    initCookie()
    initGraziePage()
    $$('.js-wa-footer').forEach(function (wa) {
      wa.href = waUrl(CFG.whatsappPrefix || 'Richiesta assistenza — Total Service 24H')
    })
  })
})()
