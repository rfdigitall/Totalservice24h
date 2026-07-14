import { useEffect, useState } from 'react'
import { CALLBACK_PROMISE_MIN } from '../constants/config'
import { buildWhatsAppUrl } from '../utils/phone'
import { trackLead } from '../utils/actions'
import { redirectToThankYou } from '../utils/tracking'

export default function CallbackGuardModal({ open, service, onClose, onSubmitted, etaMinutes }) {
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) setError('')
  }, [open])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const digits = phone.replace(/\D/g, '')
    if (digits.length < 9) {
      setError('Inserisci un numero di cellulare valido.')
      return
    }
    if (!consent) {
      setError('Devi accettare l\'informativa privacy per procedere.')
      return
    }

    trackLead('callback_form')

    const normalized = digits.startsWith('39') ? `+${digits}` : `+39${digits}`
    const message = [
      service.callbackPrefix,
      `Numero cliente: ${normalized}`,
      `Richiesta: richiamata entro ${CALLBACK_PROMISE_MIN} min`,
      `Arrivo stimato intervento: da ${etaMinutes} min`,
      'Consenso privacy: sì',
    ].join('\n')

    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer')
    onSubmitted()
    redirectToThankYou(service.id)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} aria-hidden />

      <div role="dialog" aria-labelledby="callback-title" aria-modal="true" className="card-soft relative w-full max-w-md p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-brand">Squadra in chiamata</p>
        <h2 id="callback-title" className="mt-2 font-display text-xl font-bold text-white">
          Lascia il numero — ti richiamiamo
        </h2>
        <p className="mt-2 text-sm text-muted">
          Entro {CALLBACK_PROMISE_MIN} minuti. Arrivo stimato da {etaMinutes} min.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="callback-phone" className="mb-1.5 block text-xs font-semibold text-dim">
              Cellulare
            </label>
            <input
              id="callback-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="333 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-field"
              autoFocus
            />
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

          <button type="submit" className="btn-whatsapp w-full">
            Richiedi richiamata
          </button>
          <button type="button" onClick={onClose} className="w-full py-2 text-xs text-muted">
            Riprovo a chiamare
          </button>
        </form>
      </div>
    </div>
  )
}
