import { REVIEWS } from '../constants/reviews'
import SiteContainer from './SiteContainer'

function Stars({ n }) {
  return <span className="tracking-wider text-brand" aria-hidden>{'★'.repeat(n)}</span>
}

export default function ReviewsSection() {
  return (
    <section id="recensioni" className="site-section border-t border-white/[0.05]">
      <SiteContainer>
        <h2 className="section-title">Feedback clienti</h2>
        <p className="mt-2 text-sm text-muted">Esempi reali — non recensioni da piattaforme esterne.</p>

        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <li key={r.name} className="review-card">
              <Stars n={r.stars} />
              <p className="mt-3 text-sm leading-relaxed text-dim">&ldquo;{r.text}&rdquo;</p>
              <p className="mt-3 text-xs text-white/60">{r.name}</p>
            </li>
          ))}
        </ul>
      </SiteContainer>
    </section>
  )
}
