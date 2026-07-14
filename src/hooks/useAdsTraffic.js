import { useEffect, useState } from 'react'

function detectAdsTraffic() {
  try {
    const params = new URLSearchParams(window.location.search)
    return Boolean(
      params.get('gclid') ||
        params.get('gbraid') ||
        params.get('wbraid') ||
        params.get('utm_source') ||
        params.get('utm_medium') ||
        params.get('utm_campaign'),
    )
  } catch {
    return false
  }
}

export function useAdsTraffic() {
  const [isAdsTraffic, setIsAdsTraffic] = useState(false)

  useEffect(() => {
    const ads = detectAdsTraffic()
    setIsAdsTraffic(ads)
    if (ads) document.body.classList.add('ads-traffic')
    return () => document.body.classList.remove('ads-traffic')
  }, [])

  return { isAdsTraffic }
}
