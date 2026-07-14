import { useEffect, useMemo, useState } from 'react'
import { ETA_MAX_DAY, ETA_MAX_NIGHT, ETA_MIN, PROXIMITY_PHRASES } from '../constants/config'

const ETA_KEY = 'fabbro_eta'
const PHRASE_KEY = 'fabbro_phrase'

function readSession(key) {
  try { return sessionStorage.getItem(key) } catch { return null }
}

function writeSession(key, value) {
  try { sessionStorage.setItem(key, value) } catch { /* ignore */ }
}

function randomEta(isNight) {
  const max = isNight ? ETA_MAX_NIGHT : ETA_MAX_DAY
  return Math.floor(Math.random() * (max - ETA_MIN + 1)) + ETA_MIN
}

function pickPhrase() {
  return PROXIMITY_PHRASES[Math.floor(Math.random() * PROXIMITY_PHRASES.length)]
}

export function useProximity(isNight = false) {
  const [ready, setReady] = useState(false)

  const etaMinutes = useMemo(() => {
    const cached = readSession(ETA_KEY)
    const parsed = cached ? Number(cached) : null
    if (parsed && parsed >= ETA_MIN) return parsed
    const eta = randomEta(isNight)
    writeSession(ETA_KEY, String(eta))
    return eta
  }, [isNight])

  const proximityPhrase = useMemo(() => {
    const cached = readSession(PHRASE_KEY)
    if (cached) return cached
    const phrase = pickPhrase()
    writeSession(PHRASE_KEY, phrase)
    return phrase
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  return {
    ready,
    etaMinutes,
    etaLabel: `${etaMinutes} min`,
    proximityPhrase,
  }
}
