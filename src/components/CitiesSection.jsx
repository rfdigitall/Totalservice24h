import { CITIES, PHONE_TEL } from '../constants/config'
import { trackCta } from '../utils/actions'
import SiteContainer from './SiteContainer'

export default function CitiesSection({ city, onCallClick }) {
  return (
    <section id="zone" className="site-section border-t border-white/[0.05]">
      <SiteContainer>
        <p className="section-eyebrow">Zone</p>
        <h2 className="section-title">Copertura in tutto il Veneto</h2>
        <p className="mt-3 max-w-2xl text-dim">
          Pronto intervento fabbro h24 — anche festivi e notturni.
          {city ? ` Priorità interventi a ${city}.` : ''}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {CITIES.map((name) => (
            <li key={name}>
              <span className={`city-chip ${city === name ? 'city-chip--active' : ''}`}>{name}</span>
            </li>
          ))}
        </ul>

        <a
          href={PHONE_TEL}
          onClick={() => trackCta('phone', onCallClick)}
          className="btn-call mt-8 max-w-md"
        >
          Verifica disponibilità nella tua zona
        </a>
      </SiteContainer>
    </section>
  )
}
