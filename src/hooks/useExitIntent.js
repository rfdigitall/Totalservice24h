import { useCallback, useEffect, useRef, useState } from 'react'

const SESSION_KEY = 'fabbro_exit_shown'

export function useExitIntent() {
  const [open, setOpen] = useState(false)
  const shown = useRef(false)

  const dismiss = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      shown.current = true
    }

    const show = () => {
      if (shown.current) return
      shown.current = true
      sessionStorage.setItem(SESSION_KEY, '1')
      setOpen(true)
    }

    const onMouseLeave = (e) => {
      if (e.clientY <= 0 && e.relatedTarget == null) show()
    }

    const onPopState = () => show()

    history.pushState({ exitIntent: true }, '')
    document.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('popstate', onPopState)

    return () => {
      document.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  return { open, dismiss }
}
