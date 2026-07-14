import { fabbroService } from './fabbro'
import { idraulicoService } from './idraulico'

const SERVICES = {
  fabbro: fabbroService,
  idraulico: idraulicoService,
}

export function getServiceConfig(id = 'fabbro') {
  return SERVICES[id] || SERVICES.fabbro
}

export function readServiceIdFromDom() {
  const el = document.getElementById('root')
  return el?.dataset?.service || 'fabbro'
}
