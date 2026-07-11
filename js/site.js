(function () {
  'use strict'

  var CFG = window.LANDING_CONFIG || {}
  var TRC = window.TRACKING_CONFIG || {}
  var WA_NUM = '393927398625'
  var COOKIE_KEY = 'ts_cookie_consent_v1'
  var PROMPT_KEY = 'ts_prompt_shown'
  var GOOGLE_ADS_SEND_TO = TRC.googleAdsSendTo || ''
  var GA4 = TRC.ga4Id || 'G-1LSVPLL52C'
  var TIMED_PROMPT_MS = 35000

  function $(sel, root) { return (root || document).querySelector(sel) }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)) }

  function waUrl(text) { return 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(text) }

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(COOKIE_KEY) || 'null') } catch (e) { return null }
  }
  function setConsent(analytics) {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics: analytics, ts: Date.now() }))
  }

  function hasAnalyticsConsent() {
    var c = getConsent()
    return !!(c && c.analytics)
  }

  function grantConsent() {
    if (!window.gtag) return
    window.gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted'
    })
  }

  function setupTracking() {
    if (window.__tsTrackReady || !hasAnalyticsConsent()) return
    window.__tsTrackReady = true
    grantConsent()
    window.gtag('config', GA4, { anonymize_ip: true, send_page_view: true })
    window.trackTel = function () {
      if (!hasAnalyticsConsent()) return
      window.gtag('event', 'generate_lead', { method: 'phone' })
      if (GOOGLE_ADS_SEND_TO) {
        window.gtag('event', 'conversion', { send_to: GOOGLE_ADS_SEND_TO })
      }
    }
    window.trackLead = function (src) {
      if (!hasAnalyticsConsent()) return
      window.gtag('event', 'generate_lead', { method: src || 'lead' })
    }
    $$('a[href^="tel:"]').forEach(function (a) {
      if (a.__tsBound) return
      a.__tsBound = true
      a.addEventListener('click', function () { if (window.trackTel) window.trackTel() })
    })
  }

  function initTelLinks() {
    $$('a[href^="tel:"]').forEach(function (a) {
      if (a.__tsBound) return
      a.__tsBound = true
      a.addEventListener('click', function () { if (window.trackTel) window.trackTel() })
    })
  }

  function thankYou() {
    setTimeout(function () {
      location.href = './grazie.html?svc=' + encodeURIComponent(CFG.id || 'fabbro')
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
    hidden.value = keys[0]
    wrap.innerHTML = keys.map(function (k, i) {
      return '<button type="button" class="problem-pick__btn' + (i === 0 ? ' is-active' : '') + '" data-val="' + k + '">' + CFG.urgencies[k] + '</button>'
    }).join('')
    $$('.problem-pick__btn', wrap).forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('.problem-pick__btn', wrap).forEach(function (b) { b.classList.remove('is-active') })
        btn.classList.add('is-active')
        hidden.value = btn.getAttribute('data-val')
      })
    })
  }

  function initContactForm() {
    var form = $('#contact-form')
    if (!form) return
    initProblemPick()
    var sel = $('#contact-problem')
    if (sel && CFG.urgencies && !$('#contact-problem-pick')) {
      sel.innerHTML = Object.keys(CFG.urgencies).map(function (k) {
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
      if (window.trackLead) window.trackLead('whatsapp_form')
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
      thankYou()
    })
  }

  function openCallPrompt() {
    var modal = $('#exit-modal')
    if (!modal || sessionStorage.getItem(PROMPT_KEY)) return
    sessionStorage.setItem(PROMPT_KEY, '1')
    modal.classList.add('is-open')
  }

  function initCallPrompt() {
    var modal = $('#exit-modal')
    if (!modal) return
    $$('[data-close-exit]').forEach(function (b) {
      b.addEventListener('click', function () { modal.classList.remove('is-open') })
    })
    if (!sessionStorage.getItem(PROMPT_KEY)) {
      setTimeout(openCallPrompt, TIMED_PROMPT_MS)
    }
    document.documentElement.addEventListener('mouseleave', function (e) {
      if (e.clientY > 0 || sessionStorage.getItem(PROMPT_KEY)) return
      openCallPrompt()
    }, { once: true })
  }

  function initCookie() {
    var banner = $('#cookie-banner')
    if (!banner) return
    if (hasAnalyticsConsent()) {
      banner.classList.add('hidden')
      setupTracking()
      return
    }
    $('#cookie-accept').addEventListener('click', function () {
      setConsent(true)
      banner.classList.add('hidden')
      setupTracking()
    })
    $('#cookie-reject').addEventListener('click', function () {
      setConsent(false)
      banner.classList.add('hidden')
    })
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

  document.addEventListener('DOMContentLoaded', function () {
    renderServices()
    renderFooterServices()
    initTelLinks()
    initContactForm()
    initCallPrompt()
    initCookie()
    var wa = $('.js-wa-footer')
    if (wa) wa.href = waUrl(CFG.whatsappPrefix || 'Richiesta assistenza')
  })
})()
