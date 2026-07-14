import { useEffect, useMemo, useState } from 'react'
import { BRAND_NAME, PHONE_DISPLAY, SITE_URL } from '../constants/config'

function readCity() {
  try {
    const params = new URLSearchParams(window.location.search)
    const raw = params.get('city')?.trim()
    if (!raw) return ''
    return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()
  } catch {
    return ''
  }
}

function setMeta(name, content) {
  if (!content) return
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setOg(property, content) {
  if (!content) return
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useCityMatch() {
  const [city, setCity] = useState('')

  useEffect(() => {
    setCity(readCity())
  }, [])

  const cityLabel = city || 'Veneto'
  const cityIn = city ? `a ${city}` : 'nel Veneto'
  const cityNear = city ? `vicino a ${city}` : 'nella tua zona'

  const pageTitle = useMemo(
    () =>
      city
        ? `Fabbro urgente ${city} — ${PHONE_DISPLAY} h24`
        : `${PHONE_DISPLAY} — Fabbro Pronto Intervento h24`,
    [city],
  )

  const pageDescription = useMemo(
    () =>
      city
        ? `Porta bloccata a ${city}? Fabbro h24 — arrivo rapido. Chiama ${PHONE_DISPLAY}, anche festivi.`
        : `${PHONE_DISPLAY} — Fabbro pronto intervento h24 nel Veneto. Total Service 24H. Anche festivi.`,
    [city],
  )

  useEffect(() => {
    document.title = pageTitle
    setMeta('description', pageDescription)
    setOg('og:title', pageTitle)
    setOg('og:description', pageDescription)
    setOg('og:url', `${SITE_URL}/fabbro.html${city ? `?city=${encodeURIComponent(city)}` : ''}`)
    setOg('og:site_name', BRAND_NAME)
  }, [city, pageTitle, pageDescription])

  return { city, cityLabel, cityIn, cityNear }
}
