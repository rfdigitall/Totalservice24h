import PriorityBooking from './PriorityBooking'
import WhatsAppSection from './WhatsAppSection'
import SiteContainer from './SiteContainer'
import { PHONE_DISPLAY, PHONE_TEL } from '../constants/config'
import { trackCta } from '../utils/actions'

export default function ContactSection({ service, etaMinutes, onCallClick }) {
  return (
    <section id="contatti" className="site-section border-t border-white/[0.05]">
      <SiteContainer>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="section-title">Richiedi intervento</h2>
          <a
            href={PHONE_TEL}
            onClick={() => trackCta('phone', onCallClick)}
            className="btn-call max-w-xs shrink-0"
          >
            Chiama {PHONE_DISPLAY}
          </a>
        </div>

        <div className="grid items-stretch gap-5 lg:grid-cols-2">
          <PriorityBooking service={service} etaMinutes={etaMinutes} embedded />
          <WhatsAppSection service={service} etaMinutes={etaMinutes} embedded />
        </div>
      </SiteContainer>
    </section>
  )
}
