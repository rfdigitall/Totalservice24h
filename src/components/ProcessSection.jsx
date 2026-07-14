import { STEPS } from '../constants/config'
import SiteContainer from './SiteContainer'

export default function ProcessSection() {
  return (
    <section className="site-section border-t border-white/[0.06]">
      <SiteContainer>
        <h2 className="section-title">Come funziona</h2>

        <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-10">
          {STEPS.map((step) => (
            <li key={step.n} className="border-l-2 border-accent/30 pl-5 md:border-l-0 md:border-t-2 md:pt-5 md:pl-0">
              <span className="font-mono text-sm font-bold text-accent">{step.n}</span>
              <h3 className="mt-2 font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-dim">{step.desc}</p>
            </li>
          ))}
        </ol>
      </SiteContainer>
    </section>
  )
}
