import { useEffect } from 'react'
import { BRAND_NAME, PHONE_DISPLAY, SITE_URL } from '../constants/config'
import { getServiceConfig } from '../constants/services'

function setMeta(name, content) {
  if (!content) return
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setOg(property, content) {
  if (!content) return
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function usePageMeta(service) {
  useEffect(() => {
    const pageTitle = `${service.metaTitle} | ${BRAND_NAME}`
    document.title = pageTitle
    setMeta('description', service.metaDescription)
    setOg('og:title', service.metaTitle)
    setOg('og:description', service.metaDescription)
    setOg('og:url', `${SITE_URL}/${service.pageFile}`)
    setOg('og:site_name', BRAND_NAME)

    document.documentElement.style.setProperty('--hero-bg', `url("${service.backdropImage}")`)
  }, [service])
}

export function useServiceMeta(serviceId) {
  const service = getServiceConfig(serviceId)
  usePageMeta(service)
  return service
}
