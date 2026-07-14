import { useCallback, useEffect, useRef, useState } from 'react'
import { CALLBACK_WINDOW_MS } from '../constants/config'

const CALL_TS_KEY = 'fabbro_call_ts'
const CALLBACK_DONE_KEY = 'fabbro_callback_done'

export function useCallbackGuard() {
  const [open, setOpen] = useState(false)
  const armed = useRef(false)

  const dismiss = useCallback(() => setOpen(false), [])

  const markCallAttempt = useCallback(() => {
    if (sessionStorage.getItem(CALLBACK_DONE_KEY)) return
    sessionStorage.setItem(CALL_TS_KEY, String(Date.now()))
    armed.current = true
  }, [])

  const markCallbackSubmitted = useCallback(() => {
    sessionStorage.setItem(CALLBACK_DONE_KEY, '1')
    armed.current = false
    setOpen(false)
  }, [])

  useEffect(() => {
    const checkReturn = () => {
      if (!armed.current) return
      if (sessionStorage.getItem(CALLBACK_DONE_KEY)) return

      const raw = sessionStorage.getItem(CALL_TS_KEY)
      if (!raw) return

      const elapsed = Date.now() - Number(raw)
      if (elapsed > 0 && elapsed < CALLBACK_WINDOW_MS) {
        setOpen(true)
        armed.current = false
      }
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') checkReturn()
    }

    const onPageShow = (e) => {
      if (e.persisted) checkReturn()
    }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pageshow', onPageShow)
    window.addEventListener('focus', checkReturn)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pageshow', onPageShow)
      window.removeEventListener('focus', checkReturn)
    }
  }, [])

  const requestCallback = useCallback(() => {
    if (sessionStorage.getItem(CALLBACK_DONE_KEY)) return
    setOpen(true)
  }, [])

  return { open, dismiss, markCallAttempt, markCallbackSubmitted, requestCallback }
}
