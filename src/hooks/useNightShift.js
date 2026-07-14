import { useEffect, useState } from 'react'
import { NIGHT_END_HOUR, NIGHT_START_HOUR } from '../constants/config'

function checkNightShift() {
  const hour = new Date().getHours()
  return hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR
}

export function useNightShift() {
  const [isNight, setIsNight] = useState(checkNightShift)

  useEffect(() => {
    setIsNight(checkNightShift())
    const id = setInterval(() => setIsNight(checkNightShift()), 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('night-shift', isNight)
    return () => document.documentElement.classList.remove('night-shift')
  }, [isNight])

  return { isNight }
}
