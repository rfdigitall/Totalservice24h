import Logo from './Logo'
import {
  BRAND_NAME,
  BRAND_TAGLINE,
  SITE_DOMAIN,
  PHONE_DISPLAY,
  PHONE_TEL,
  LEGAL,
  PRIVACY,
  FOOTER_MENU,
} from '../constants/config'
import { buildWhatsAppUrl } from '../utils/phone'
import { trackCta } from '../utils/actions'
import SiteContainer from './SiteContainer'

export default function Footer({ service, etaMinutes, onCallClick, onRequestCallback }) {
  const waUrl = buildWhatsAppUrl(`${service.whatsappPrefix}\nRichiesta urgente`)

  return (
    <footer className="footer-main">
      <SiteContainer className="py-10 md:py-14">
        <div className="footer-actions">
          <a
            href={PHONE_TEL}
            onClick={() => trackCta('phone', onCallClick)}
            className="footer-phone"
          >
            {PHONE_DISPLAY}
          </a>
          <div className="footer-actions__row">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCta('whatsapp', onCallClick)}
              className="footer-btn footer-btn--wa"
            >
              WhatsApp
            </a>
            <button type="button" onClick={onRequestCallback} className="footer-btn footer-btn--ghost">
              Richiamata
            </button>
          </div>
          <p className="footer-trust">h24 · In zona · ~{etaMinutes} min</p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo variant="footer" />
            <p className="mt-3 text-sm text-muted">{service.footerIntro}</p>
            <p className="mt-2 text-xs text-white/40">{BRAND_TAGLINE}</p>
          </div>

          <div>
            <p className="footer-col-title">Menu</p>
            <ul className="space-y-2">
              {FOOTER_MENU.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="footer-link">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer-col-title">Servizi</p>
            <ul className="space-y-2">
              {service.footerServices.map((s) => (
                <li key={s} className="text-sm text-muted">{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="footer-col-title">Contatti</p>
            <ul className="space-y-2">
              <li>
                <a
                  href={PHONE_TEL}
                  onClick={() => trackCta('phone', onCallClick)}
                  className="font-bold text-brand"
                >
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="footer-link">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${LEGAL.pec}`} className="footer-link break-all text-xs">
                  {LEGAL.pec}
                </a>
              </li>
              <li className="text-sm text-muted">{LEGAL.hours}</li>
            </ul>
          </div>
        </div>
      </SiteContainer>

      <div className="footer-bar">
        <SiteContainer className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} {BRAND_NAME} · P.IVA {LEGAL.piva} · {SITE_DOMAIN}</p>
          <div className="flex gap-4">
            <a href="./privacy.html" className="hover:text-brand">Privacy</a>
            <a href="./cookie.html" className="hover:text-brand">Cookie</a>
            <a href="./index.html" className="hover:text-brand">Home</a>
          </div>
        </SiteContainer>
        <SiteContainer>
          <p className="mt-2 text-center text-[10px] text-muted sm:text-left">
            {PRIVACY.controller} · PEC{' '}
            <a href={`mailto:${PRIVACY.pec}`} className="text-brand">{PRIVACY.pec}</a>
          </p>
          <p className="mt-1 text-center text-[10px] text-muted sm:text-left">
            Sito realizzato da{' '}
            <a href={LEGAL.agency.url} target="_blank" rel="noopener noreferrer" className="text-brand">
              RF DIGITAL
            </a>
          </p>
        </SiteContainer>
      </div>
    </footer>
  )
}
