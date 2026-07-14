import { useCountdown } from '../hooks/useCountdown'

export default function EmergencyTicker({ isNight }) {
  const { formatted, expired, urgent } = useCountdown()

  return (
    <div
      className={`
        inline-flex items-center gap-2.5 border px-3 py-1.5
        ${isNight
          ? 'border-amber-500/35 bg-amber-500/8'
          : expired
            ? 'border-urgent/50 bg-urgent/12'
            : urgent
              ? 'border-urgent/35 bg-urgent/8'
              : 'border-urgent/20 bg-urgent/5'
        }
      `}
      aria-live="polite"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isNight ? 'bg-amber-400' : 'bg-urgent'}`} aria-hidden />
      <div>
        <p className={`text-[9px] font-semibold uppercase tracking-[0.12em] ${isNight ? 'text-amber-400/90' : 'text-urgent/90'}`}>
          {expired ? 'Priorità in scadenza' : 'Finestra intervento'}
        </p>
        <p className="font-mono text-sm font-bold leading-none text-white tabular-nums">
          {expired ? '0:00' : formatted}
        </p>
      </div>
    </div>
  )
}
