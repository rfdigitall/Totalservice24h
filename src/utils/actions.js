export function triggerHaptic(pattern = [12, 8, 12]) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern)
  }
}

export function trackCallClick() {
  if (typeof window !== 'undefined' && window.trackGoogleAdsTelClick) {
    window.trackGoogleAdsTelClick()
  }
}

export function trackLead(source = 'cta') {
  if (typeof window !== 'undefined' && window.trackGoogleAdsLead) {
    window.trackGoogleAdsLead(source)
  }
}

export function trackCta(source, onCallClick) {
  triggerHaptic()
  if (source === 'phone') trackCallClick()
  else trackLead(source)
  onCallClick?.()
}
