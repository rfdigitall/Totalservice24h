import { useState } from 'react'
import { buildWhatsAppUrl } from '../utils/phone'
import { trackLead } from '../utils/actions'
import { redirectToThankYou } from '../utils/tracking'

function validateCap(cap) {
  return /^\d{5}$/.test(cap)
}

export default function PriorityBooking({ service, etaMinutes, embedded = false }) {
  const [cap, setCap] = useState('')
  const [name, setName] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!validateCap(cap)) {
      setError('Inserisci un CAP valido (5 cifre).')
      return
    }
    if (!consent) {
      setError('Devi accettare l\'informativa privacy.')
      return
    }

    trackLead('priority_form')

    const greeting = name.trim() ? `Nome: ${name.trim()}` : ''
    const message = [
      service.priorityPrefix,
      `CAP: ${cap}`,
      greeting,
      `Arrivo stimato zona: da ${etaMinutes} min`,
      'Confermo richiesta intervento urgente.',
      'Consenso privacy: sì',
    ].filter(Boolean).join('\n')

    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
    redirectToThankYou(service.id)
  }

  const Wrapper = embedded ? 'div' : 'section'
  const wrapperProps = embedded
    ? { className: 'card-soft h-full p-6' }
    : { className: 'site-section', 'aria-labelledby': 'priority-title' }

  return (
    <Wrapper {...wrapperProps}>
      <h2 id={embedded ? undefined : 'priority-title'} className="section-title text-lg">
        Priorità intervento
      </h2>
      <p className="mt-1 text-sm text-muted">Inserisci CAP e invia su WhatsApp.</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="priority-cap" className="mb-1.5 block text-xs font-semibold text-dim">
              CAP *
            </label>
            <input
              id="priority-cap"
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="35100"
              value={cap}
              onChange={(e) => setCap(e.target.value.replace(/\D/g, '').slice(0, 5))}
              className="input-field font-display"
            />
          </div>
          <div>
            <label htmlFor="priority-name" className="mb-1.5 block text-xs font-semibold text-dim">
              Nome (opz.)
            </label>
            <input
              id="priority-name"
              type="text"
              autoComplete="given-name"
              placeholder="Mario"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        {cap.length === 5 && validateCap(cap) && (
          <p className="text-xs text-live">
            Zona coperta — arrivo stimato da {etaMinutes} min
          </p>
        )}

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-4 w-4 accent-brand"
          />
          <span className="text-xs leading-relaxed text-muted">
            Acconsento al trattamento dei dati per questa richiesta.{' '}
            <a href="./privacy.html" className="text-brand underline">Privacy</a>
          </span>
        </label>

        {error && <p className="text-xs text-red-400" role="alert">{error}</p>}

        <button type="submit" className="btn-whatsapp">
          Conferma su WhatsApp
        </button>
      </form>
    </Wrapper>
  )
}
