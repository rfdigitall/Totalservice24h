import SiteContainer from './SiteContainer'

export default function StatsBar({ etaMinutes }) {
  const stats = [
    { value: 'h24', suffix: '', label: 'Attivi' },
    { value: String(etaMinutes), suffix: ' min', label: 'Arrivo' },
    { value: '365', suffix: '', label: 'Giorni' },
    { value: 'Live', suffix: '', label: 'In zona' },
  ]

  return (
    <section className="border-y border-white/[0.05] py-5">
      <SiteContainer>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label} className="stat-pill">
              <p className="font-display text-2xl font-bold text-white">
                {s.value}
                <span className="text-brand">{s.suffix}</span>
              </p>
              <p className="mt-0.5 text-[11px] text-muted">{s.label}</p>
            </li>
          ))}
        </ul>
      </SiteContainer>
    </section>
  )
}
