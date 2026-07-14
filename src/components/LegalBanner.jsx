import { ETA_MIN } from '../constants/config'

export default function LegalBanner() {
  return (
    <aside
      className="mt-6 border border-white/[0.06] bg-steel/30 px-4 py-3 text-xs leading-relaxed text-muted"
      role="note"
    >
      <strong className="text-dim">Nota informativa:</strong>{' '}
      I tempi indicati (minimo {ETA_MIN} minuti) sono stime indicative di copertura
      nel Veneto, non impegni contrattuali. L&apos;orario effettivo viene confermato
      telefonicamente o su WhatsApp al momento della richiesta.
    </aside>
  )
}
