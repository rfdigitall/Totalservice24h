import { useLiveStatus } from '../hooks/useLiveStatus'

export default function LiveStatusTracker({ etaMinutes, techName, isNight }) {
  const { progress, phaseLabel, distanceLabel } = useLiveStatus(etaMinutes)

  return (
    <section
      className="border-y border-white/[0.06] bg-steel/20 px-5 py-6"
      aria-labelledby="status-title"
    >
      <div className="mx-auto max-w-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
              {isNight ? 'Turno notturno · Stato zona' : 'Stato intervento · Zona'}
            </p>
            <h2 id="status-title" className="mt-1 text-base font-semibold text-white">
              {phaseLabel}
            </h2>
            <p className="mt-1 text-sm text-dim">{distanceLabel}</p>
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl font-bold tabular-nums text-white">{etaMinutes}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted">min stimati</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-1.5 w-full overflow-hidden bg-white/[0.06]">
            <div
              className="status-bar h-full bg-accent transition-all duration-[4s] ease-out"
              style={{ width: `${100 - progress}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted">
            <span>Tecnico: {techName}</span>
            <span>Copertura attiva · Veneto</span>
          </div>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-muted/80">
          Stima basata sulla disponibilità nella tua zona. Tempo effettivo confermato al momento
          della chiamata o richiesta WhatsApp.
        </p>
      </div>
    </section>
  )
}
