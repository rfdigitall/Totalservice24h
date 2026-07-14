import { useEffect, useState } from 'react'

const INITIAL_SECONDS = 180

function formatTime(total) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function useCountdown(startSeconds = INITIAL_SECONDS) {
  const [seconds, setSeconds] = useState(startSeconds)

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return {
    seconds,
    formatted: formatTime(seconds),
    expired: seconds === 0,
    urgent: seconds <= 60,
  }
}
