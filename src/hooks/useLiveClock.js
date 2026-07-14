import { useEffect, useState } from 'react'

const TZ = 'Europe/Rome'

function formatRomeTime(date) {
  return new Intl.DateTimeFormat('it-IT', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

function formatRomeDate(date) {
  return new Intl.DateTimeFormat('it-IT', {
    timeZone: TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date)
}

export function useLiveClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return {
    time: formatRomeTime(now),
    date: formatRomeDate(now),
  }
}
