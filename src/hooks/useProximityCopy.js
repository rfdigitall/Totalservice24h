import { PROXIMITY_PHRASES } from '../constants/config'
import { useMemo } from 'react'

/** Copy de proximitate — senza nomi di città o regioni */
export function useProximityCopy() {
  const phrase = useMemo(() => {
    try {
      const key = 'ts_proximity_phrase'
      const cached = sessionStorage.getItem(key)
      if (cached) return cached
      const picked = PROXIMITY_PHRASES[Math.floor(Math.random() * PROXIMITY_PHRASES.length)]
      sessionStorage.setItem(key, picked)
      return picked
    } catch {
      return PROXIMITY_PHRASES[0]
    }
  }, [])

  return {
    nearYou: phrase,
    zoneLabel: 'nella tua zona',
    coverageLabel: 'Zona attiva',
    badgeLine: 'Squadra operativa in zona',
  }
}
