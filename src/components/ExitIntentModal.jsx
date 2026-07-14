import { AnimatePresence, motion } from 'framer-motion'
import CallButton from './CallButton'

export default function ExitIntentModal({ open, onClose, onCallClick }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="card-soft relative w-full max-w-sm p-6"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-brand">Attenzione</p>
            <p className="mt-3 font-display text-xl font-bold text-white">Tecnico disponibile in zona</p>
            <p className="mt-2 text-sm text-muted">Chiama ora per priorità intervento — risposta immediata.</p>
            <div className="mt-5">
              <CallButton label="CHIAMA ORA" onCallClick={onCallClick} />
            </div>
            <button type="button" onClick={onClose} className="mt-4 w-full text-xs text-muted hover:text-white">
              Chiudi
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
