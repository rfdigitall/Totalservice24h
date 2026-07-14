import { useEffect, useState } from 'react'
import { CITY_ALIASES, VENETO_CITIES } from '../constants/config'

const CACHE_KEY = 'fabbro_city'
const CACHE_TTL = 1000 * 60 * 60 * 6

function normalizeCity(raw) {
  if (!raw) return null
  const trimmed = raw.trim()
  const lower = trimmed.toLowerCase()
  if (CITY_ALIASES[lower]) return CITY_ALIASES[lower]
  const match = VENETO_CITIES.find(
    (c) => c.toLowerCase() === lower || lower.includes(c.toLowerCase())
  )
  return match || null
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { city, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return normalizeCity(city)
  } catch {
    return null
  }
}

function writeCache(city) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ city, ts: Date.now() }))
  } catch {
    // ignore
  }
}

function cityFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return normalizeCity(params.get('city'))
}

function fallbackCity() {
  return VENETO_CITIES[Math.floor(Math.random() * VENETO_CITIES.length)]
}

async function detectFromIp() {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 2500)

  try {
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal })
    if (!res.ok) return null
    const data = await res.json()
    return normalizeCity(data.city) || normalizeCity(data.region)
  } catch {
    return null
  } finally {
    clearTimeout(timeout)
  }
}

export function useGeoCity() {
  const [city, setCity] = useState(() => cityFromUrl() || readCache() || 'Veneto')
  const [loading, setLoading] = useState(!cityFromUrl() && !readCache())

  useEffect(() => {
    const fromUrl = cityFromUrl()
    if (fromUrl) {
      setCity(fromUrl)
      writeCache(fromUrl)
      setLoading(false)
      return
    }

    const cached = readCache()
    if (cached) {
      setCity(cached)
      setLoading(false)
      return
    }

    let active = true
    detectFromIp().then((detected) => {
      if (!active) return
      const resolved = detected || fallbackCity()
      setCity(resolved)
      writeCache(resolved)
      setLoading(false)
    })

    return () => { active = false }
  }, [])

  return { city, loading }
}
