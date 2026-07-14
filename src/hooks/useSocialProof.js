import { useEffect, useState } from 'react'

const MESSAGES = [
  'Una persona nelle vicinanze ha chiamato 5 min fa',
  'Intervento completato in zona — 12 min fa',
  'Richiesta urgente ricevuta — 3 min fa',
  'Tecnico arrivato sul posto — 8 min fa',
]

export function useSocialProof(intervalMs = 15000) {
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const show = () => {
      const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
      setToast({ id: Date.now(), message })
    }

    const initial = setTimeout(show, intervalMs)
    const interval = setInterval(show, intervalMs)

    return () => {
      clearTimeout(initial)
      clearInterval(interval)
    }
  }, [intervalMs])

  const dismiss = () => setToast(null)

  return { toast, dismiss }
}
