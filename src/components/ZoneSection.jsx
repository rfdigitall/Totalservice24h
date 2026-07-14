import { PHONE_TEL } from '../constants/config'
import { trackCta } from '../utils/actions'
import SiteContainer from './SiteContainer'

const TRUST_POINTS = [
  'Squadra in zona',
  'h24, festivi e notti',
  'Risposta al telefono',
]

export default function ZoneSection({ service, onCallClick, nearYou }) {
  return (
    <section id="zona" className="site-section border-t border-white/[0.05]">
      <SiteContainer>
        <h2 className="section-title">Interveniamo {nearYou}</h2>
        <p className="mt-2 max-w-lg text-sm text-muted">
          {service.serviceLabel} urgente — chiama per i tempi nella tua area.
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {TRUST_POINTS.map((point) => (
            <li
              key={point}
              className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-sm text-dim"
            >
              {point}
            </li>
          ))}
        </ul>

        <a
          href={PHONE_TEL}
          onClick={() => trackCta('phone', onCallClick)}
          className="btn-call mt-6 max-w-sm"
        >
          Verifica disponibilità
        </a>
      </SiteContainer>
    </section>
  )
}
