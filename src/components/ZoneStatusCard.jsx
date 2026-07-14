import { useLiveStatus } from '../hooks/useLiveStatus'
import SiteContainer from './SiteContainer'

export default function ZoneStatusCard({ etaMinutes, isNight }) {
  const { coverage, label, distanceLabel } = useLiveStatus(etaMinutes)

  return (
    <div className="form-panel h-full">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
        {isNight ? 'Turno notturno' : 'Copertura zona'}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{label}</p>
      <p className="mt-1 text-sm text-dim">{distanceLabel}</p>

      <div className="mt-5">
        <div className="flex justify-between text-[10px] text-muted">
          <span>Disponibilità stimata</span>
          <span className="font-mono text-white">{etaMinutes} min</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden bg-white/[0.06]">
          <div
            className="status-bar h-full"
            style={{ width: `${coverage}%` }}
          />
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-muted">
        Indicatore di copertura nel Veneto. Non rappresenta la posizione GPS
        di un singolo tecnico.
      </p>
    </div>
  )
}

export function ZoneStatusStrip({ etaMinutes, isNight }) {
  return (
    <section className="border-y border-white/[0.06] bg-steel/15 py-4 md:hidden">
      <SiteContainer>
        <ZoneStatusCard etaMinutes={etaMinutes} isNight={isNight} />
      </SiteContainer>
    </section>
  )
}
