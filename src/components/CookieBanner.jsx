export default function CookieBanner({ visible, onAccept, onReject }) {
  if (!visible) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[200] border-t border-white/10 bg-[#12161c]/98 p-4 backdrop-blur-md md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-xl md:border"
      role="dialog"
      aria-labelledby="cookie-title"
      aria-modal="true"
    >
      <p id="cookie-title" className="text-sm font-semibold text-white">
        Cookie e privacy
      </p>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        Usiamo cookie tecnici e, solo con il tuo consenso, strumenti di analisi
        (Google Analytics / Google Ads) per misurare le richieste di contatto.
        Puoi accettare o rifiutare i cookie analitici.{' '}
        <a href="./cookie.html" className="text-brand underline">
          Cookie Policy
        </a>
        {' · '}
        <a href="./privacy.html" className="text-brand underline">
          Privacy Policy
        </a>
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={onAccept} className="btn-call btn-call--sm">
          Accetta
        </button>
        <button type="button" onClick={onReject} className="btn-outline py-2.5 text-xs">
          Solo necessari
        </button>
      </div>
    </div>
  )
}
