import { ETA_MIN, PHONE_DISPLAY, PHONE_TEL, PRIVACY } from '../constants/config'
import SiteContainer from './SiteContainer'

export default function PrivacyFooter() {
  return (
    <section id="privacy" className="border-t border-white/[0.06] py-10 pb-24 md:pb-12">
      <SiteContainer>
        <h2 className="text-base font-semibold text-white md:text-lg">
          Informativa privacy (sintesi GDPR)
        </h2>
        <div className="mt-4 grid gap-6 text-xs leading-relaxed text-muted md:grid-cols-2 md:text-sm">
          <div className="space-y-2">
            <p><strong className="text-dim">Titolare:</strong> {PRIVACY.controller}</p>
            <p><strong className="text-dim">Finalità:</strong> {PRIVACY.purposes.join('; ')}.</p>
            <p>
              <strong className="text-dim">Dati:</strong> telefono, CAP, indirizzo — solo se
              inseriti volontariamente. Nessuna memorizzazione su server del sito.
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <strong className="text-dim">Base giuridica:</strong> art. 6.1.b e 6.1.a GDPR
              (richiesta dell&apos;interessato e consenso esplicito).
            </p>
            <p>
              <strong className="text-dim">Diritti:</strong> accesso, rettifica, cancellazione —{' '}
              {PRIVACY.email} o <a href={PHONE_TEL} className="text-accent">{PHONE_DISPLAY}</a>.
            </p>
            <p>
              <strong className="text-dim">Tempi di arrivo:</strong> stime da {ETA_MIN} min,
              non vincolanti. Conferma al momento del contatto.
            </p>
          </div>
        </div>
      </SiteContainer>
    </section>
  )
}
