import Logo from './Logo'
import { PHONE_DISPLAY, PHONE_TEL, NAV_LINKS } from '../constants/config'
import { trackCta } from '../utils/actions'

export default function Header({ onCallClick }) {
  return (
    <header className="site-header sticky top-0 z-40">
      <div className="site-container flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Menu">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-muted transition-colors hover:text-brand">
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={PHONE_TEL}
          onClick={() => trackCta('phone', onCallClick)}
          className="btn-call btn-call--sm hidden w-auto px-4 md:inline-flex"
        >
          {PHONE_DISPLAY}
        </a>
        <a
          href={PHONE_TEL}
          onClick={() => trackCta('phone', onCallClick)}
          className="btn-call btn-call--sm w-auto px-3 sm:px-4 md:hidden"
        >
          Chiama
        </a>
      </div>
    </header>
  )
}
