import CallButton from './CallButton'
import SiteContainer from './SiteContainer'

const BADGES = ['Senza danni', 'Prezzo chiaro', 'Fattura', 'h24 / 365']

export default function TrustSection({ onCallClick }) {
  return (
    <section className="site-section border-t border-white/[0.06]">
      <SiteContainer>
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
              Garanzia
            </p>
            <h2 className="mt-2 section-title">Servizio professionale nel Veneto</h2>
            <p className="mt-3 text-sm leading-relaxed text-dim md:text-base">
              Tecnici qualificati, attrezzatura professionale, intervento rapido
              senza sorprese sul prezzo — ovunque tu sia in regione.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {BADGES.map((badge) => (
                <li
                  key={badge}
                  className="border border-white/[0.08] px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-dim"
                >
                  {badge}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 lg:mt-0">
            <CallButton onCallClick={onCallClick} label="CHIAMA ORA" />
          </div>
        </div>
      </SiteContainer>
    </section>
  )
}
