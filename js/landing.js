(function () {
  'use strict'

  var CFG = window.LANDING_CONFIG || {}
  var PHONE_TEL = 'tel:+393927398625'
  var WA_NUM = '393927398625'
  var COOKIE_KEY = 'ts_cookie_consent_v1'
  var CALL_TS = 'ts_call_ts'
  var CALLBACK_DONE = 'ts_callback_done'
  var PHRASES = ['nella tua zona', 'nelle tue vicinanze', 'vicino a te', 'in zona']
  var GOOGLE_ADS = 'AW-17710881957'
  var GA4 = 'G-1LSVPLL52C'
  var ETA_LABEL = '25–40 min'

  function $(sel, root) { return (root || document).querySelector(sel) }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)) }

  function getPhrase() {
    try {
      var c = sessionStorage.getItem('ts_phrase_v1')
      if (c) return c
      c = PHRASES[Math.floor(Math.random() * PHRASES.length)]
      sessionStorage.setItem('ts_phrase_v1', c)
      return c
    } catch (e) { return PHRASES[0] }
  }

  function romeTime() {
    return new Intl.DateTimeFormat('it-IT', {
      timeZone: 'Europe/Rome',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    }).format(new Date())
  }

  function romeDate() {
    return new Intl.DateTimeFormat('it-IT', {
      timeZone: 'Europe/Rome',
      weekday: 'short', day: 'numeric', month: 'short',
    }).format(new Date())
  }

  function waUrl(text) {
    return 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(text)
  }

  function getConsent() {
    try { return JSON.parse(localStorage.getItem(COOKIE_KEY) || 'null') } catch (e) { return null }
  }

  function setConsent(analytics) {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ analytics: analytics, ts: Date.now() }))
  }

  function loadTracking() {
    if (window.__tsTrackLoaded || !getConsent() || !getConsent().analytics) return
    window.__tsTrackLoaded = true
    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments) }
    var s = document.createElement('script')
    s.async = true
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_ADS
    document.head.appendChild(s)
    window.gtag('js', new Date())
    window.gtag('config', GOOGLE_ADS, { anonymize_ip: true })
    window.gtag('config', GA4, { anonymize_ip: true })
    window.trackTel = function () {
      window.gtag('event', 'generate_lead', { method: 'phone' })
    }
    window.trackLead = function (src) {
      window.gtag('event', 'generate_lead', { method: src || 'lead' })
    }
  }

  function trackTelClick() {
    if (window.trackTel) window.trackTel()
    try { sessionStorage.setItem(CALL_TS, String(Date.now())) } catch (e) {}
  }

  function thankYou() {
    setTimeout(function () {
      location.href = './grazie.html?svc=' + encodeURIComponent(CFG.id || 'fabbro')
    }, 400)
  }

  function initClock() {
    function tick() {
      var t = romeTime()
      $$('[data-clock]').forEach(function (el) { el.textContent = t })
      $$('[data-date]').forEach(function (el) { el.textContent = romeDate() })
    }
    tick()
    setInterval(tick, 1000)
  }

  function initCopy() {
    var p = getPhrase()
    $$('[data-near]').forEach(function (el) { el.textContent = p })
    $$('[data-eta]').forEach(function (el) { el.textContent = ETA_LABEL })
  }

  function initTelLinks() {
    $$('a[href="' + PHONE_TEL + '"], .js-call').forEach(function (a) {
      a.addEventListener('click', trackTelClick)
    })
  }

  function initWhatsAppQuick() {
    var quick = $('#wa-quick')
    if (quick) {
      quick.href = waUrl(CFG.whatsappPrefix + '\nRichiesta urgente')
      quick.addEventListener('click', function () {
        if (window.trackLead) window.trackLead('whatsapp_quick')
      })
    }
  }

  function initWhatsAppForm() {
    var form = $('#wa-form')
    if (!form) return
    var sel = $('#wa-problem')
    if (sel && CFG.urgencies) {
      sel.innerHTML = Object.keys(CFG.urgencies).map(function (k) {
        return '<option value="' + k + '">' + CFG.urgencies[k] + '</option>'
      }).join('')
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var street = $('#wa-street').value.trim()
      var num = $('#wa-number').value.trim()
      var err = $('#wa-err')
      var consent = $('#wa-consent').checked
      err.textContent = ''
      if (!street || !num) { err.textContent = 'Compila indirizzo.'; return }
      if (!consent) { err.textContent = 'Accetta la privacy.'; return }
      if (window.trackLead) window.trackLead('whatsapp_form')
      var problem = CFG.urgencies[sel.value] || sel.value
      var msg = [CFG.whatsappPrefix, 'Emergenza: ' + problem, 'Indirizzo: ' + street + ', ' + num, 'Consenso privacy: sì'].join('\n')
      window.open(waUrl(msg), '_blank', 'noopener,noreferrer')
      thankYou()
    })
  }

  function initCallback() {
    var modal = $('#callback-modal')
    var form = $('#callback-form')
    if (!modal) return
    $$('.js-callback').forEach(function (b) {
      b.addEventListener('click', function () {
        if (sessionStorage.getItem(CALLBACK_DONE)) return
        modal.classList.add('is-open')
      })
    })
    $$('[data-close-modal]').forEach(function (b) {
      b.addEventListener('click', function () { modal.classList.remove('is-open') })
    })
    if (!form) return
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var phone = $('#callback-phone').value.replace(/\D/g, '')
      var err = $('#callback-err')
      if (phone.length < 9) { err.textContent = 'Numero non valido.'; return }
      if (!$('#callback-consent').checked) { err.textContent = 'Accetta la privacy.'; return }
      if (window.trackLead) window.trackLead('callback_form')
      var norm = phone.indexOf('39') === 0 ? '+' + phone : '+39' + phone
      var msg = [CFG.callbackPrefix, 'Numero: ' + norm, 'Consenso privacy: sì'].join('\n')
      sessionStorage.setItem(CALLBACK_DONE, '1')
      window.open(waUrl(msg), '_blank', 'noopener,noreferrer')
      modal.classList.remove('is-open')
      thankYou()
    })
  }

  function initExit() {
    var modal = $('#exit-modal')
    if (!modal || sessionStorage.getItem('ts_exit_shown')) return
    document.documentElement.addEventListener('mouseleave', function (e) {
      if (e.clientY > 0) return
      sessionStorage.setItem('ts_exit_shown', '1')
      modal.classList.add('is-open')
    }, { once: true })
    $$('[data-close-exit]').forEach(function (b) {
      b.addEventListener('click', function () { modal.classList.remove('is-open') })
    })
  }

  function initCookie() {
    var banner = $('#cookie-banner')
    if (!banner) return
    if (getConsent()) {
      banner.classList.add('hidden')
      loadTracking()
      return
    }
    $('#cookie-accept').addEventListener('click', function () {
      setConsent(true)
      banner.classList.add('hidden')
      loadTracking()
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
    initCopy()
    initClock()
    renderServices()
    renderFooterServices()
    initTelLinks()
    initWhatsAppQuick()
    initWhatsAppForm()
    initCallback()
    initExit()
    initCookie()
  })
})()
