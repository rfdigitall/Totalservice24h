import { PHONE_DISPLAY, PHONE_TEL } from '../constants/config'
import { trackCta } from '../utils/actions'

export default function AdsUrgencyBanner({ isAdsTraffic, zoneLabel, onCallClick }) {
  if (!isAdsTraffic) return null

  return (
    <div className="ads-strip">
      <a
        href={PHONE_TEL}
        onClick={() => trackCta('phone', onCallClick)}
        className="inline-flex items-center gap-2 text-brand"
      >
        <span className="live-dot" />
        Tecnico disponibile {zoneLabel} — chiama {PHONE_DISPLAY}
      </a>
    </div>
  )
}
