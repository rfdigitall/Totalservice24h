import CallButton from './CallButton'
import EtaDisclaimer from './EtaDisclaimer'
import PriorityBooking from './PriorityBooking'
import WhatsAppSection from './WhatsAppSection'
import SiteContainer from './SiteContainer'
import { PHONE_DISPLAY, PHONE_TEL } from '../constants/config'
import { trackCta } from '../utils/actions'
import { useLiveClock } from '../hooks/useLiveClock'

export default function Hero({
  service,
  etaLabel,
  etaMinutes,
  onCallClick,
  isNight,
  nearYou,
  zoneLabel,
  coverageLabel,
  badgeLine,
}) {
  const coverage = Math.min(92, Math.max(58, 100 - etaMinutes))
  const isIdraulico = service.id === 'idraulico'
  const { time, date } = useLiveClock()

  return (
    <section id="top" className="site-section pt-6 md:pt-10">
      <SiteContainer>
        <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-dim">
              <span className="live-dot" />
              {isNight ? 'Turno notturno' : 'Operatore attivo'} · {zoneLabel}
            </p>

            <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-tight tracking-tight">
              {service.serviceLabel} urgente<br />
              <span className="text-brand">{nearYou}</span>
            </h1>

            <p className="mt-4 max-w-lg text-base text-muted">
              {isIdraulico
                ? 'Perdite, tubi rotti, scarichi intasati.'
                : 'Porte bloccate, chiavi perse, serrature.'}
              {' '}h24 · da <strong className="text-white">{etaLabel}</strong>
            </p>

            <a
              href={PHONE_TEL}
              onClick={() => trackCta('phone', onCallClick)}
              className="phone-hero call-pulse mt-5 inline-block"
            >
              {PHONE_DISPLAY}
            </a>

            <div className="mt-5 max-w-md">
              <CallButton
                onCallClick={onCallClick}
                label={isNight ? 'Chiama — notte' : 'Chiama ora'}
              />
            </div>

            <p className="mt-3 text-xs font-medium text-live">
              Risposta immediata — nessun costo chiamata
            </p>
            <EtaDisclaimer className="mt-2 max-w-md" />
          </div>

          <div className="card-soft card-soft--urgent p-6 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand">
                  <span className="live-dot" />
                  Live ora
                </p>
                <p className="live-clock mt-2" aria-live="polite">
                  {time}
                </p>
                <p className="mt-1 text-xs capitalize text-muted">{date}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-brand">Arrivo</p>
                <p className="font-display text-3xl font-bold text-white md:text-4xl">{etaLabel}</p>
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-1.5 flex justify-between text-xs text-muted">
                <span>{coverageLabel}</span>
                <span className="font-semibold text-brand">{coverage}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light transition-all duration-700"
                  style={{ width: `${coverage}%` }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-muted">{badgeLine}</p>
            </div>

            <ul className="mt-4 space-y-1 text-sm text-dim">
              {service.heroBullets.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-brand">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div id="contatti" className="urgency-block mt-8 scroll-mt-20">
          <p className="urgency-block__title">
            Richiedi subito — operatore in linea alle {time.split(':').slice(0, 2).join(':')}
          </p>

          <div className="mt-4 grid items-stretch gap-4 lg:grid-cols-2">
            <PriorityBooking service={service} etaMinutes={etaMinutes} embedded />
            <WhatsAppSection service={service} etaMinutes={etaMinutes} embedded />
          </div>

          <a
            href={PHONE_TEL}
            onClick={() => trackCta('phone', onCallClick)}
            className="btn-call mt-4 lg:hidden"
          >
            Oppure chiama {PHONE_DISPLAY}
          </a>
        </div>
      </SiteContainer>
    </section>
  )
}
