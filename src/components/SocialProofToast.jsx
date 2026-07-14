import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function SocialProofToast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return
    const id = setTimeout(onDismiss, 5000)
    return () => clearTimeout(id)
  }, [toast, onDismiss])

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          className="fixed bottom-24 left-4 z-40 max-w-[calc(100vw-2rem)] lg:bottom-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="card-soft flex items-start gap-3 px-4 py-3">
            <span className="live-dot mt-1.5 shrink-0" aria-hidden />
            <p className="flex-1 text-xs leading-snug text-dim">{toast.message}</p>
            <button type="button" onClick={onDismiss} className="shrink-0 text-muted" aria-label="Chiudi">
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
