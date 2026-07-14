/**
 * Generate fabbro geo landing pages (Ads-only, no visible city nav) + sitemap.
 * Run: npm run generate:city-pages
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { CITIES, PHONE_DISPLAY, PHONE_TEL, SITE_BASE, cityPageUrl } from './cities.config.mjs'
import { buildLandingConfigScript } from './services.config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const SOURCE_FILE = join(root, 'fabbro.html')
const SITEMAP_FILE = join(root, 'public', 'sitemap.xml')
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

function buildCityJsonLd(city) {
  const pageUrl = cityPageUrl(city.slug)
  const zones = city.zones.map((z) => ({ '@type': 'Place', name: z }))
  return `  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Locksmith",
        "@id": "${pageUrl}#locksmith",
        "name": "Total Service 24H — Fabbro ${city.name}",
        "url": "${pageUrl}",
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
          "name": "Pronto intervento fabbro ${city.name}",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Apertura porte bloccate a ${city.name}" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Riparazione serrature ${city.name}" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Porte blindate e cilindri ${city.name}" } }
          ]
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "${SITE_BASE}/" },
          { "@type": "ListItem", "position": 2, "name": "Fabbro h24", "item": "${SITE_BASE}/fabbro.html" },
          { "@type": "ListItem", "position": 3, "name": "Fabbro ${city.name}", "item": "${pageUrl}" }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Il fabbro può aprire la porta senza danneggiarla a ${city.name}?", "acceptedAnswer": { "@type": "Answer", "text": "Quando possibile sì. Dipende dal tipo di serratura e dalla situazione. Al telefono descrivi il caso e il tecnico ti spiega le opzioni disponibili a ${city.name}." } },
          { "@type": "Question", "name": "Fate pronto intervento su porte blindate a ${city.name}?", "acceptedAnswer": { "@type": "Answer", "text": "Sì, interveniamo su blindati, multipunto e cilindri europei a ${city.name} e provincia. Indica al telefono la marca se la conosci." } },
          { "@type": "Question", "name": "Quanto tempo ci vuole per l'arrivo del fabbro a ${city.name}?", "acceptedAnswer": { "@type": "Answer", "text": "Dipende da zona e disponibilità dei tecnici a ${city.name}. Te lo confermiamo subito al telefono, prima di inviare il fabbro." } },
          { "@type": "Question", "name": "Il servizio fabbro h24 copre ${city.name}?", "acceptedAnswer": { "@type": "Answer", "text": "Sì, copriamo ${city.name} (${city.province}) e zone limitrofe. Indica via e numero civico al telefono per conferma immediata." } }
        ]
      }
    ]
  }
  </script>`
}

function buildSiblingServiceSection(city, service) {
  const { name, slug } = city
  if (service === 'fabbro') {
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

function buildZoneSection(city) {
  const zonesListHtml = city.zones.map((z) => `          <li>${z}</li>`).join('\n')
  return `
  <section class="home-section home-section--alt lp-section" id="zone-${city.slug}">
    <div class="home-wrap">
      <p class="home-section__label">Copertura locale</p>
      <h2>Zone servite a ${city.name}</h2>
      <p class="home-section__intro">Interveniamo rapidamente in tutta la zona di <strong>${city.name}</strong> (${city.province}) e provincia, incluse le seguenti aree:</p>
      <ul class="zone-list">
${zonesListHtml}
      </ul>
      <p>Chiama <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a> per un intervento urgente a ${city.name} — rispondiamo h24, festivi compresi.</p>
    </div>
  </section>
`
}

function buildCityPage(baseHtml, city) {
  const { name, slug, province, lat, lng } = city
  const pageUrl = cityPageUrl(slug)
  let html = baseHtml

  html = replaceOrWarn(html, /<title>[\s\S]*?<\/title>/, `<title>${PHONE_DISPLAY} — Fabbro Pronto Intervento h24 a ${name} | Total Service 24H</title>`, 'title')
  html = replaceOrWarn(html, /(<meta name="description" content=")[^"]*(")/, `$1${PHONE_DISPLAY} — Fabbro urgente h24 a ${name}. Porta bloccata, chiavi perse, serratura rotta? Pronto intervento a ${name} e provincia ${province}. Chiama subito.$2`, 'meta description')
  html = replaceOrWarn(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${pageUrl}$2`, 'canonical')
  html = replaceOrWarn(html, /(<link rel="alternate" hreflang="it-IT" href=")[^"]*(")/, `$1${pageUrl}$2`, 'hreflang')
  html = replaceOrWarn(html, /(<meta name="geo\.region" content=")[^"]*(")/, `$1IT-${province}$2`, 'geo.region')
  html = replaceOrWarn(html, /(<meta name="geo\.placename" content=")[^"]*(")/, `$1${name}$2`, 'geo.placename')
  if (!html.includes('geo.position')) {
    html = html.replace(/(<meta name="geo\.placename"[^>]*>)/, `$1\n  <meta name="geo.position" content="${lat};${lng}" />\n  <meta name="ICBM" content="${lat}, ${lng}" />`)
  } else {
    html = replaceOrWarn(html, /(<meta name="geo\.position" content=")[^"]*(")/, `$1${lat};${lng}$2`, 'geo.position')
    html = replaceOrWarn(html, /(<meta name="ICBM" content=")[^"]*(")/, `$1${lat}, ${lng}$2`, 'ICBM')
  }
  html = replaceOrWarn(html, /(<meta property="og:title" content=")[^"]*(")/, `$1Fabbro h24 a ${name} — Pronto intervento | Total Service 24H$2`, 'og:title')
  html = replaceOrWarn(html, /(<meta property="og:description" content=")[^"]*(")/, `$1Porta bloccata a ${name}? Fabbro urgente h24. Chiama ${PHONE_DISPLAY} — risposta immediata.$2`, 'og:description')
  html = replaceOrWarn(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${pageUrl}$2`, 'og:url')
  html = replaceOrWarn(html, /(<meta property="og:image" content=")[^"]*(")/, `$1${SITE_BASE}/img/logo-transparent.png$2`, 'og:image')
  html = replaceOrWarn(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1Fabbro h24 a ${name} — Total Service 24H$2`, 'twitter:title')
  html = replaceOrWarn(html, /(<meta name="twitter:description" content=")[^"]*(")/, `$1Pronto intervento fabbro h24 a ${name}. Chiama ${PHONE_DISPLAY}.$2`, 'twitter:description')
  html = replaceOrWarn(html, /<script type="application\/ld\+json">[\s\S]*?<\/script>/, buildCityJsonLd(city), 'JSON-LD')
  html = replaceOrWarn(html, /<h1>[\s\S]*?<\/h1>/, `<h1>Fabbro urgente a ${name}<br><em>Pronto intervento h24</em></h1>`, 'H1 hero')
  html = replaceOrWarn(html, /(<p class="eyebrow"[^>]*>)[^<]*(<\/p>)/, `$1Pronto intervento · Fabbro h24 a ${name}$2`, 'eyebrow')
  html = replaceOrWarn(html, /(<p class="lead">)[^<]*(<\/p>)/, `$1Porta bloccata, chiavi perse o serratura rotta a ${name}? Un operatore risponde subito e verifica un tecnico disponibile a ${name} e provincia ${province}.$2`, 'lead')
  html = replaceOrWarn(html, /(<p class="call-band__text">)[^<]*(<\/p>)/, `$1Emergenza fabbro a ${name}? Una chiamata e partiamo.$2`, 'call-band')
  html = replaceOrWarn(html, /(<summary>Il servizio fabbro h24 copre la mia zona\?<\/summary>\s*<p>)[^<]*(<\/p>)/, `$1Sì, copriamo ${name} (${province}) e zone limitrofe. Indica via e numero civico al telefono per conferma immediata.$2`, 'FAQ zona')

  html = stripVisibleCityNav(html)
  const beforeFooter = buildZoneSection(city) + buildSiblingServiceSection(city, 'fabbro')
  if (html.includes('<footer')) html = html.replace('<footer', beforeFooter + '\n\n  <footer')

  html = replaceOrWarn(
    html,
    /<script>\s*window\.LANDING_CONFIG = [\s\S]*?<\/script>/,
    buildLandingConfigScript({
      id: `fabbro-${slug}`,
      city: name,
      service: 'fabbro',
      whatsappPrefix: `Richiesta Fabbro h24 a ${name} — Total Service 24H`,
    }),
    'LANDING_CONFIG',
  )
  html = html.replace('class="page-landing page-landing--fabbro"', `class="page-landing page-landing--fabbro page-landing--city page-landing--${slug}"`)
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
console.log(`Generez ${CITIES.length} pagini fabbro geo (Ads-only)...\n`)
for (const city of CITIES) {
  console.log(`-> fabbro-${city.slug}.html  (${city.name})`)
  writeFileSync(join(root, `fabbro-${city.slug}.html`), buildCityPage(baseHtml, city), 'utf8')
}
updateSitemap()
console.log('\nGata.')
