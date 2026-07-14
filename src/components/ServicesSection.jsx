import { PHONE_TEL } from '../constants/config'
import { trackCta } from '../utils/actions'
import SiteContainer from './SiteContainer'

export default function ServicesSection({ service, onCallClick }) {
  return (
    <section id="servizi" className="site-section">
      <SiteContainer>
        <h2 className="section-title">{service.servicesHeading}</h2>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {service.services.map((s) => (
            <li key={s.id} className="card-soft card-soft--lift p-4">
              <p className="text-sm font-semibold text-white">{s.title}</p>
              <p className="mt-1 text-xs text-muted">{s.desc}</p>
            </li>
          ))}
        </ul>

        <a
          href={PHONE_TEL}
          onClick={() => trackCta('phone', onCallClick)}
          className="btn-call mt-6 max-w-sm"
        >
          Chiama ora
        </a>
      </SiteContainer>
    </section>
  )
}
