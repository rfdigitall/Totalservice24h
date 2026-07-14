import { useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import ServicesSection from './components/ServicesSection'
import ZoneSection from './components/ZoneSection'
import ReviewsSection from './components/ReviewsSection'
import Footer from './components/Footer'
import StickyCallBar from './components/StickyCallBar'
import FloatingCallFab from './components/FloatingCallFab'
import AdsUrgencyBanner from './components/AdsUrgencyBanner'
import ExitIntentModal from './components/ExitIntentModal'
import CallbackGuardModal from './components/CallbackGuardModal'
import SocialProofToast from './components/SocialProofToast'
import CookieBanner from './components/CookieBanner'
import SiteBackdrop from './components/SiteBackdrop'
import { useProximity } from './hooks/useProximity'
import { useNightShift } from './hooks/useNightShift'
import { useExitIntent } from './hooks/useExitIntent'
import { useCallbackGuard } from './hooks/useCallbackGuard'
import { useSocialProof } from './hooks/useSocialProof'
import { useServiceMeta } from './hooks/usePageMeta'
import { useProximityCopy } from './hooks/useProximityCopy'
import { useAdsTraffic } from './hooks/useAdsTraffic'
import { useCookieConsent } from './hooks/useCookieConsent'
import { BRAND_NAME, PHONE_TEL, SITE_URL } from './constants/config'

export default function App({ serviceId }) {
  const service = useServiceMeta(serviceId)
  const { isNight } = useNightShift()
  const proximity = useProximityCopy()
  const { isAdsTraffic } = useAdsTraffic()
  const { etaMinutes, etaLabel } = useProximity(isNight)
  const { open: exitOpen, dismiss: dismissExit } = useExitIntent()
  const {
    open: callbackOpen,
    dismiss: dismissCallback,
    markCallAttempt,
    markCallbackSubmitted,
    requestCallback,
  } = useCallbackGuard()
  const { toast, dismiss: dismissToast } = useSocialProof()
  const { visible: cookieVisible, accept: acceptCookies, reject: rejectCookies } = useCookieConsent()

  useEffect(() => {
    document.body.classList.add('has-mobile-cta')
    return () => document.body.classList.remove('has-mobile-cta')
  }, [])

  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': service.id === 'idraulico' ? 'Plumber' : 'Locksmith',
      name: BRAND_NAME,
      url: `${SITE_URL}/${service.pageFile}`,
      telephone: PHONE_TEL.replace('tel:', ''),
      areaServed: 'IT',
      openingHours: 'Mo-Su 00:00-24:00',
    }

    let el = document.getElementById('ld-json-local')
    if (!el) {
      el = document.createElement('script')
      el.id = 'ld-json-local'
      el.type = 'application/ld+json'
      document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(schema)
  }, [service])

  return (
    <>
      <SiteBackdrop />

      <div className="site-content">
        <AdsUrgencyBanner
          isAdsTraffic={isAdsTraffic}
          zoneLabel={proximity.zoneLabel}
          onCallClick={markCallAttempt}
        />
        <Header onCallClick={markCallAttempt} />
        <main>
          <Hero
            service={service}
            etaLabel={etaLabel}
            etaMinutes={etaMinutes}
            onCallClick={markCallAttempt}
            isNight={isNight}
            nearYou={proximity.nearYou}
            zoneLabel={proximity.zoneLabel}
            coverageLabel={proximity.coverageLabel}
            badgeLine={proximity.badgeLine}
          />
          <StatsBar etaMinutes={etaMinutes} />
          <ServicesSection service={service} onCallClick={markCallAttempt} />
          <ZoneSection service={service} onCallClick={markCallAttempt} nearYou={proximity.nearYou} />
          <ReviewsSection />
          <Footer
            service={service}
            etaMinutes={etaMinutes}
            onCallClick={markCallAttempt}
            onRequestCallback={requestCallback}
          />
        </main>

        <StickyCallBar onCallClick={markCallAttempt} isNight={isNight} />
        <FloatingCallFab onCallClick={markCallAttempt} />
        <ExitIntentModal open={exitOpen} onClose={dismissExit} onCallClick={markCallAttempt} />
        <CallbackGuardModal
          open={callbackOpen}
          service={service}
          onClose={dismissCallback}
          onSubmitted={markCallbackSubmitted}
          etaMinutes={etaMinutes}
        />
        <SocialProofToast toast={toast} onDismiss={dismissToast} />
        <CookieBanner visible={cookieVisible} onAccept={acceptCookies} onReject={rejectCookies} />
      </div>
    </>
  )
}
