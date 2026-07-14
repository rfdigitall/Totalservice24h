/** Generate idraulico geo landing pages (Ads-only, no visible city nav) + sitemap. Run: npm run generate:city-pages:idraulico */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { CITIES, PHONE_DISPLAY, PHONE_TEL, SITE_BASE } from './cities.config.mjs'
import { buildLandingConfigScript } from './services.config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const SOURCE_FILE = join(root, 'idraulico.html')
const SITEMAP_FILE = join(root, 'public', 'sitemap.xml')
const FILE_PREFIX = 'idraulico'
const TODAY = new Date().toISOString().slice(0, 10)

function replaceOrWarn(html, pattern, replacement, label) {
  const next = html.replace(pattern, replacement)
  if (next === html) console.warn(`  [!] Marker negasit: ${label}`)
  return next
}

function stripVisibleCityNav(html) {
  return html
    .replace(/<section class="home-section home-section--alt lp-section" id="zone-servite">[\s\S]*?<\/section>\s*/g, '')
    .replace(/<section class="home-section home-section--alt lp-section sibling-service" id="altro-servizio">[\s\S]*?<\/section>\s*/g, '')
    .replace(/<section class="home-section home-section--alt lp-section" id="zone-[^"]+">[\s\S]*?<\/section>\s*/g, '')
    .replace(/        <div class="footer__col">\s*<h3 class="footer__heading">Zone servite<\/h3>[\s\S]*?        <\/div>\s*\n/g, '')
    .replace(/      <div class="city-links-wrap">[\s\S]*?      <\/div>\s*\n/g, '')
}

function pageUrl(slug) {
  return `${SITE_BASE}/${FILE_PREFIX}-${slug}.html`
}

function buildCityJsonLd(city) {
  const url = pageUrl(city.slug)
  const zones = city.zones.map((z) => ({ '@type': 'Place', name: z }))
  return `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Plumber",
        "@id": "${url}#plumber",
        "name": "Total Service 24H — Idraulico ${city.name}",
        "url": "${url}",
        "telephone": "${PHONE_TEL}",
        "image": "${SITE_BASE}/img/logo-transparent.png",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "${city.name}",
          "addressRegion": "${city.province}",
          "addressCountry": "IT"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": ${city.lat},
          "longitude": ${city.lng}
        },
        "areaServed": [
          { "@type": "City", "name": "${city.name}", "containedInPlace": { "@type": "AdministrativeArea", "name": "${city.province}" } },
          ${zones.map((z) => JSON.stringify(z)).join(',\n          ')}
        ],
        "availableLanguage": "it",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "00:00",
          "closes": "23:59"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Pronto intervento idraulico ${city.name}",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Perdite d'acqua e allagamenti ${city.name}" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Tubi rotti e rubinetti ${city.name}" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Scarichi intasati ${city.name}" } }
          ]
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE_BASE}/" },
          { "@type": "ListItem", "position": 2, "name": "Idraulico h24", "item": "${SITE_BASE}/idraulico.html" },
          { "@type": "ListItem", "position": 3, "name": "Idraulico ${city.name}", "item": "${url}" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Cosa fare mentre aspetto l'idraulico a ${city.name}?", "acceptedAnswer": { "@type": "Answer", "text": "Se possibile chiudi la valvola dell'acqua principale o quella del rubinetto interessato. Poi chiama subito il numero h24." } },
          { "@type": "Question", "name": "Intervenite su perdite d'acqua urgenti a ${city.name}?", "acceptedAnswer": { "@type": "Answer", "text": "Sì, su perdite visibili e accessibili a ${city.name} e provincia. Per ricerche più complesse il tecnico valuta la situazione sul posto." } },
          { "@type": "Question", "name": "Quanto tempo ci vuole per l'arrivo dell'idraulico a ${city.name}?", "acceptedAnswer": { "@type": "Answer", "text": "Dipende da zona e disponibilità a ${city.name}. Te lo confermiamo al telefono prima di inviare il tecnico." } },
          { "@type": "Question", "name": "Il servizio idraulico h24 copre ${city.name}?", "acceptedAnswer": { "@type": "Answer", "text": "Sì, copriamo ${city.name} (${city.province}) e zone limitrofe. Indica via e numero civico al telefono per conferma immediata." } }
        ]
      }
    ]
  }
  </script>`
}

function buildSiblingServiceSection(city, service) {
  const { name, slug } = city
  if (service === 'idraulico') {
    return `
  <section class="home-section home-section--alt lp-section sibling-service" id="altro-servizio">
    <div class="home-wrap">
      <p class="home-section__label">Anche a ${name}</p>
      <h2>Fabbro h24</h2>
      <p class="home-section__intro">Porta bloccata, serratura rotta o chiavi perse a ${name}? Pronto intervento fabbro urgente h24 — stesso numero.</p>
      <a href="./fabbro-${slug}.html" class="btn-mech sibling-service__link">Fabbro h24 a ${name}</a>
    </div>
  </section>`
  }
  return `
  <section class="home-section home-section--alt lp-section sibling-service" id="altro-servizio">
    <div class="home-wrap">
      <p class="home-section__label">Anche a ${name}</p>
      <h2>Idraulico h24</h2>
      <p class="home-section__intro">Perdite d'acqua, tubi rotti, scarichi intasati o caldaia a ${name}? Pronto intervento idraulico urgente h24 — stesso numero.</p>
      <a href="./idraulico-${slug}.html" class="btn-mech sibling-service__link">Idraulico h24 a ${name}</a>
    </div>
  </section>`
}

function buildZoneSection(city) {
  const zonesListHtml = city.zones.map((z) => `          <li>${z}</li>`).join('\n')
  return `
  <section class="home-section home-section--alt lp-section" id="zone-${city.slug}">
    <div class="home-wrap">
      <p class="home-section__label">Copertura locale</p>
      <h2>Zone servite a ${city.name}</h2>
      <p class="home-section__intro">Interveniamo rapidamente in tutta la zona di <strong>${city.name}</strong> (${city.province}) su perdite d'acqua, tubi rotti, caldaie e allagamenti, incluse le seguenti aree:</p>
      <ul class="zone-list">
${zonesListHtml}
      </ul>
      <p>Chiama <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a> per un idraulico urgente a ${city.name} — rispondiamo h24, festivi compresi.</p>
    </div>
  </section>
`
}

function buildCityPage(baseHtml, city) {
  const { name, slug, province, lat, lng } = city
  const url = pageUrl(slug)
  let html = baseHtml

  html = replaceOrWarn(html, /<title>[\s\S]*?<\/title>/, `<title>${PHONE_DISPLAY} — Idraulico Pronto Intervento h24 a ${name} | Total Service 24H</title>`, 'title')
  html = replaceOrWarn(html, /(<meta name="description" content=")[^"]*(")/, `$1${PHONE_DISPLAY} — Idraulico urgente h24 a ${name}. Perdite d'acqua, tubi rotti, caldaia, allagamenti? Interveniamo subito a ${name} e zone limitrofe.$2`, 'meta description')
  html = replaceOrWarn(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`, 'canonical')
  html = replaceOrWarn(html, /(<link rel="alternate" hreflang="it-IT" href=")[^"]*(")/, `$1${url}$2`, 'hreflang')
  html = replaceOrWarn(html, /(<meta name="geo\.region" content=")[^"]*(")/, `$1IT-${province}$2`, 'geo.region')
  html = replaceOrWarn(html, /(<meta name="geo\.placename" content=")[^"]*(")/, `$1${name}$2`, 'geo.placename')
  if (!html.includes('geo.position')) {
    html = html.replace(/(<meta name="geo\.placename"[^>]*>)/, `$1\n  <meta name="geo.position" content="${lat};${lng}" />\n  <meta name="ICBM" content="${lat}, ${lng}" />`)
  } else {
    html = replaceOrWarn(html, /(<meta name="geo\.position" content=")[^"]*(")/, `$1${lat};${lng}$2`, 'geo.position')
    html = replaceOrWarn(html, /(<meta name="ICBM" content=")[^"]*(")/, `$1${lat}, ${lng}$2`, 'ICBM')
  }
  html = replaceOrWarn(html, /(<meta property="og:title" content=")[^"]*(")/, `$1Idraulico h24 a ${name} — Pronto intervento | Total Service 24H$2`, 'og:title')
  html = replaceOrWarn(html, /(<meta property="og:description" content=")[^"]*(")/, `$1Perdita d'acqua a ${name}? Idraulico urgente h24. Chiama ${PHONE_DISPLAY}.$2`, 'og:description')
  html = replaceOrWarn(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`, 'og:url')
  html = replaceOrWarn(html, /(<meta property="og:image" content=")[^"]*(")/, `$1${SITE_BASE}/img/logo-transparent.png$2`, 'og:image')
  html = replaceOrWarn(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1Idraulico h24 a ${name} — Total Service 24H$2`, 'twitter:title')
  html = replaceOrWarn(html, /(<meta name="twitter:description" content=")[^"]*(")/, `$1Pronto intervento idraulico h24 a ${name}. Chiama ${PHONE_DISPLAY}.$2`, 'twitter:description')
  html = replaceOrWarn(html, /<script type="application\/ld\+json">[\s\S]*?<\/script>/, buildCityJsonLd(city), 'JSON-LD')
  html = replaceOrWarn(html, /<h1>[\s\S]*?<\/h1>/, `<h1>Idraulico pronto intervento a ${name}<br><em>h24, festivi compresi</em></h1>`, 'H1 hero')
  html = replaceOrWarn(html, /(<p class="eyebrow"[^>]*>)[^<]*(<\/p>)/, `$1Pronto intervento · Idraulico h24 a ${name}$2`, 'eyebrow')
  html = replaceOrWarn(html, /(<p class="lead">)[^<]*(<\/p>)/, `$1Perdite d'acqua, tubi rotti, caldaia o allagamento a ${name}? Un operatore risponde subito e verifica un idraulico disponibile a ${name} e provincia ${province}.$2`, 'lead')
  html = replaceOrWarn(html, /(<p class="call-band__text">)[^<]*(<\/p>)/, `$1Emergenza idraulico a ${name}? Una chiamata e partiamo.$2`, 'call-band')
  html = replaceOrWarn(html, /(<summary>Il servizio idraulico h24 copre la mia zona\?<\/summary>\s*<p>)[^<]*(<\/p>)/, `$1Sì, copriamo ${name} (${province}) e zone limitrofe. Indica via e numero civico al telefono per conferma immediata.$2`, 'FAQ zona')

  html = stripVisibleCityNav(html)
  const beforeFooter = buildZoneSection(city) + buildSiblingServiceSection(city, 'idraulico')
  if (html.includes('<footer')) html = html.replace('<footer', beforeFooter + '\n\n  <footer')

  html = replaceOrWarn(
    html,
    /<script>\s*window\.LANDING_CONFIG = [\s\S]*?<\/script>/,
    buildLandingConfigScript({
      id: `idraulico-${slug}`,
      city: name,
      service: 'idraulico',
      whatsappPrefix: `Richiesta Idraulico h24 a ${name} — Total Service 24H`,
    }),
    'LANDING_CONFIG',
  )
  html = html.replace(
    'class="page-landing page-landing--idraulico theme-idraulico"',
    `class="page-landing page-landing--idraulico page-landing--city page-landing--${slug} theme-idraulico"`,
  )
  return html
}

function updateSitemap() {
  const staticUrls = [
    [`${SITE_BASE}/`, 'weekly', '1.0'],
    [`${SITE_BASE}/fabbro.html`, 'weekly', '0.9'],
    [`${SITE_BASE}/idraulico.html`, 'weekly', '0.9'],
    [`${SITE_BASE}/privacy.html`, 'yearly', '0.3'],
    [`${SITE_BASE}/cookie.html`, 'yearly', '0.3'],
  ]
  const geoUrls = readdirSync(root)
    .filter((f) => /^(fabbro|idraulico)-.+\.html$/.test(f))
    .sort()
    .map((f) => [`${SITE_BASE}/${f}`, 'weekly', '0.88'])

  const allUrls = [...staticUrls, ...geoUrls]
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
  for (const [loc, changefreq, priority] of allUrls) {
    lines.push('  <url>', `    <loc>${loc}</loc>`, `    <lastmod>${TODAY}</lastmod>`, `    <changefreq>${changefreq}</changefreq>`, `    <priority>${priority}</priority>`, '  </url>')
  }
  lines.push('</urlset>', '')
  mkdirSync(dirname(SITEMAP_FILE), { recursive: true })
  writeFileSync(SITEMAP_FILE, lines.join('\n'), 'utf8')
  console.log(`Sitemap: ${allUrls.length} URL (geo pages indexate, fara link vizibile)`)
}

const baseHtml = readFileSync(SOURCE_FILE, 'utf8')
console.log(`Generez ${CITIES.length} pagini idraulico geo (Ads-only)...\n`)
for (const city of CITIES) {
  console.log(`-> ${FILE_PREFIX}-${city.slug}.html  (${city.name})`)
  writeFileSync(join(root, `${FILE_PREFIX}-${city.slug}.html`), buildCityPage(baseHtml, city), 'utf8')
}
updateSitemap()
console.log('\nGata.')
