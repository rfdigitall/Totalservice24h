import { useEffect, useState } from 'react'
import { getConsent, hasAnalyticsConsent, loadTracking, setConsent } from '../utils/tracking'

export function useCookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const existing = getConsent()
    if (existing) {
      if (existing.analytics) loadTracking()
      return
    }
    setVisible(true)
  }, [])

  const accept = () => {
    setConsent(true)
    loadTracking()
    setVisible(false)
  }

  const reject = () => {
    setConsent(false)
    setVisible(false)
  }

  return { visible, accept, reject, hasConsent: hasAnalyticsConsent() }
}
