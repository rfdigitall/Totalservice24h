import { useState } from 'react'
import { buildWhatsAppUrl } from '../utils/phone'
import { trackLead, triggerHaptic } from '../utils/actions'
import { redirectToThankYou } from '../utils/tracking'

export default function WhatsAppSection({ service, etaMinutes, embedded = false }) {
  const urgencyKeys = Object.keys(service.urgencies)
  const [street, setStreet] = useState('')
  const [number, setNumber] = useState('')
  const [problem, setProblem] = useState(urgencyKeys[0] || 'altro')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!street.trim()) {
      setError('Inserisci via o strada.')
      return
    }
    if (!number.trim()) {
      setError('Inserisci il numero civico.')
      return
    }
    if (!consent) {
      setError('Devi accettare l\'informativa privacy.')
      return
    }

    triggerHaptic([8])
    trackLead('whatsapp_form')

    const address = `${street.trim()}, ${number.trim()}`
    const lines = [
      service.whatsappPrefix,
      `Emergenza: ${service.urgencies[problem]}`,
      `Indirizzo: ${address}`,
      `Arrivo stimato: da ${etaMinutes} min`,
      'Consenso privacy: sì',
    ]

    window.open(buildWhatsAppUrl(lines.join('\n')), '_blank', 'noopener,noreferrer')
    redirectToThankYou(service.id)
  }

  const Wrapper = embedded ? 'div' : 'section'
  const wrapperProps = embedded
    ? { className: 'card-soft h-full p-6' }
    : { className: 'site-section', 'aria-labelledby': 'wa-title' }

  return (
    <Wrapper {...wrapperProps}>
      <h2 id={embedded ? undefined : 'wa-title'} className="section-title text-lg">
        WhatsApp
      </h2>
      <p className="mt-1 text-sm text-muted">Problema e indirizzo — risposta rapida.</p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="wa-problem" className="mb-1.5 block text-xs font-semibold text-dim">
            Tipo di emergenza *
          </label>
          <select
            id="wa-problem"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="input-field"
          >
            {Object.entries(service.urgencies).map(([key, label]) => (
              <option key={key} value={key} className="bg-navy">{label}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label htmlFor="wa-street" className="mb-1.5 block text-xs font-semibold text-dim">
              Via / Strada *
            </label>
            <input
              id="wa-street"
              type="text"
              placeholder="Via Roma"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="wa-number" className="mb-1.5 block text-xs font-semibold text-dim">
              N. civico *
            </label>
            <input
              id="wa-number"
              type="text"
              inputMode="numeric"
              placeholder="12"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

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
          Invia su WhatsApp
        </button>
      </form>
    </Wrapper>
  )
}
