/** City config — fabbro + idraulico geo pages (Google Ads Final URL) */
export const CITIES = [
  {
    slug: 'venezia',
    name: 'Venezia',
    province: 'VE',
    lat: 45.4408,
    lng: 12.3155,
    zones: ['Cannaregio', 'Dorsoduro', 'San Marco', 'Castello', 'Giudecca', 'Lido di Venezia'],
    priority: 1,
  },
  {
    slug: 'padova',
    name: 'Padova',
    province: 'PD',
    lat: 45.4064,
    lng: 11.8768,
    zones: ['Arcella', 'Portello', 'Voltabarozzo', 'Mortise', 'Brentella', 'Centro Storico'],
    priority: 1,
  },
  {
    slug: 'mestre',
    name: 'Mestre',
    province: 'VE',
    lat: 45.4907,
    lng: 12.2388,
    zones: ['Carpenedo', 'Marghera', 'Chirignago', 'Zelarino', 'Terraglio', 'Piazza Ferretto'],
    priority: 1,
  },
  {
    slug: 'verona',
    name: 'Verona',
    province: 'VR',
    lat: 45.4384,
    lng: 10.9916,
    zones: ['Centro Storico', 'Borgo Roma', 'San Michele Extra', 'Golosine', 'Borgo Venezia', 'Veronetta'],
    priority: 1,
  },
  {
    slug: 'vicenza',
    name: 'Vicenza',
    province: 'VI',
    lat: 45.5455,
    lng: 11.5353,
    zones: ['Centro Storico', 'Ferrovieri', 'San Pio X', 'Anconetta', 'Laghetto'],
    priority: 1,
  },
  {
    slug: 'treviso',
    name: 'Treviso',
    province: 'TV',
    lat: 45.6669,
    lng: 12.243,
    zones: ['Centro', 'San Giuseppe', 'Fiera', 'Selvana', 'Santa Bona'],
    priority: 2,
  },
  {
    slug: 'udine',
    name: 'Udine',
    province: 'UD',
    lat: 46.0718,
    lng: 13.2348,
    zones: ['Centro', 'Rizzi', 'Cussignacco', 'San Rocco', 'Aurora', 'Paderno'],
    priority: 2,
  },
  {
    slug: 'trieste',
    name: 'Trieste',
    province: 'TS',
    lat: 45.6495,
    lng: 13.7768,
    zones: ['Barcola', 'Opicina', 'Servola', 'Roiano', 'San Giacomo'],
    priority: 2,
  },
  {
    slug: 'pordenone',
    name: 'Pordenone',
    province: 'PN',
    lat: 45.9564,
    lng: 12.6601,
    zones: ['Centro', 'Vallenoncello', 'Rorai Grande', 'Torre'],
    priority: 2,
  },
  {
    slug: 'rovigo',
    name: 'Rovigo',
    province: 'RO',
    lat: 45.0703,
    lng: 11.7904,
    zones: ['Centro', 'Boara', 'Grignano', "Sant'Apollinare", 'Borsea'],
    priority: 2,
  },
  {
    slug: 'belluno',
    name: 'Belluno',
    province: 'BL',
    lat: 46.1383,
    lng: 12.2173,
    zones: ['Centro', 'Cavarzano', 'Sois', 'Giamosa', 'Ponte Feltrina'],
    priority: 2,
  },
  {
    slug: 'gorizia',
    name: 'Gorizia',
    province: 'GO',
    lat: 45.9411,
    lng: 13.6217,
    zones: ['Centro', 'Piazzutta', 'Straccis', 'Lucinico'],
    priority: 3,
  },
  {
    slug: 'codroipo',
    name: 'Codroipo',
    province: 'UD',
    lat: 45.9642,
    lng: 12.9768,
    zones: ['Centro', 'Zompicchia', 'Lonca', 'Beano'],
    priority: 3,
  },
]

export const PHONE_DISPLAY = '392 739 8625'
export const PHONE_TEL = '+393927398625'
export const SITE_BASE = 'https://totalservice24h.it'

export function cityPageUrl(slug, service = 'fabbro') {
  return `${SITE_BASE}/${service}-${slug}.html`
}

export function cityPagePath(slug, service = 'fabbro') {
  return `./${service}-${slug}.html`
}
