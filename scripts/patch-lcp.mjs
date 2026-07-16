/**
 * LCP fixes across all landing HTML pages:
 * - tiny favicon (not 211KB logo PNG)
 * - fewer Google Fonts (Plus Jakarta + Roboto Slab only)
 * - preload hero WebP + replace CSS bg div with <img fetchpriority=high>
 * - async CSS (with critical hero CSS inline on landings)
 * - restore ./css/site.css path for Vite
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Roboto+Slab:wght@700&display=swap'

const ROBOTO_SLAB_700_LATIN =
  'https://fonts.gstatic.com/s/robotoslab/v36/BngbUXZYTXPIvIBgJJSb6s3BzlRRfKOFbvjoa4Omb2RjV9Ku1Q.woff2'

const fontsBlock = `  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" href="${ROBOTO_SLAB_700_LATIN}" as="font" type="font/woff2" crossorigin />
  <link rel="preload" as="style" href="${FONT_URL}" />
  <link href="${FONT_URL}" rel="stylesheet" media="print" onload="this.media='all'" />
  <noscript><link href="${FONT_URL}" rel="stylesheet" /></noscript>`

const criticalLanding = `  <style id="critical-lp">
.header{position:sticky;top:0;z-index:40;background:rgba(20,23,27,.94);border-bottom:1px solid rgba(237,230,217,.12)}
.header__inner{display:flex;align-items:center;justify-content:space-between;gap:.65rem;min-height:4.75rem;max-width:34rem;margin:0 auto;padding:.55rem 1.25rem}
.logo__img{display:block;width:clamp(8.5rem,40vw,12rem);height:auto;max-height:4rem;object-fit:contain}
.btn-tel-small{display:inline-flex;align-items:center;gap:.4rem;padding:.55rem .9rem;border-radius:6px;background:#4A90A4;color:#081418;font-weight:600;font-size:.85rem;text-decoration:none}
.lp-hero{position:relative;min-height:92svh;display:flex;align-items:flex-end;padding:0 0 2.5rem;overflow:hidden;color:#EDE6D9}
.lp-hero__bg-img,.lp-hero__bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.42);pointer-events:none}
.lp-hero__shade{position:absolute;inset:0;background:linear-gradient(175deg,rgba(20,23,27,.55) 0%,rgba(20,23,27,.82) 45%,#14171B 92%)}
.lp-hero__content{position:relative;z-index:1;width:100%;max-width:34rem;margin:0 auto;padding:0 1.25rem}
.lp-hero h1{font-family:Georgia,serif;font-size:clamp(2rem,7vw,2.75rem);max-width:14ch;line-height:1.1;margin:.35rem 0}
.number-panel{margin:1rem 0;padding:1rem 1.1rem;border:2px solid rgba(237,230,217,.18);border-radius:12px;background:rgba(27,31,36,.72)}
.number-panel__phone{display:block;font-size:clamp(1.6rem,7vw,2.1rem);font-weight:700;color:#8BC4D6;text-decoration:none}
.btn-mech{display:inline-flex;align-items:center;justify-content:center;gap:.55rem;width:100%;max-width:22rem;margin-top:.75rem;padding:.85rem 1rem;background:#4A90A4;color:#081418;font-weight:700;border-radius:8px;text-decoration:none}
body.page-landing{margin:0;background:#14171B;font-family:system-ui,sans-serif}
</style>`

const oldFonts =
  /  <link rel="preconnect" href="https:\/\/fonts\.googleapis\.com" \/>\r?\n  <link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin \/>\r?\n  <link rel="preload" as="style" href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" \/>\r?\n  <link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" rel="stylesheet" media="print" onload="this\.media='all'" \/>\r?\n  <noscript><link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" rel="stylesheet" \/><\/noscript>/g

const oldFontsSimple =
  /  <link rel="preconnect" href="https:\/\/fonts\.googleapis\.com" \/>\r?\n  <link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin \/>\r?\n  <link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" rel="stylesheet"[^>]*\/>\r?\n(?:  <noscript><link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" rel="stylesheet" \/><\/noscript>\r?\n)?/g

function isFabbro(file) {
  return file === 'fabbro.html' || /^fabbro-/.test(file)
}
function isIdraulico(file) {
  return file === 'idraulico.html' || /^idraulico-/.test(file)
}
function isLanding(file) {
  return isFabbro(file) || isIdraulico(file)
}

function heroPreload(file) {
  if (isFabbro(file)) {
    return `  <link rel="preload" as="image" href="./img/bg-lock-720.webp" type="image/webp" imagesrcset="./img/bg-lock-720.webp 720w, ./img/bg-lock.webp 1200w" imagesizes="100vw" fetchpriority="high" />`
  }
  if (isIdraulico(file)) {
    return `  <link rel="preload" as="image" href="./img/idraulico-bg-720.webp" type="image/webp" imagesrcset="./img/idraulico-bg-720.webp 720w, ./img/idraulico-bg.webp 1200w" imagesizes="100vw" fetchpriority="high" />`
  }
  return ''
}

function heroImg(file) {
  if (isFabbro(file)) {
    return `<img class="lp-hero__bg-img" src="./img/bg-lock.webp" srcset="./img/bg-lock-720.webp 720w, ./img/bg-lock.webp 1200w" sizes="100vw" width="1200" height="800" alt="" fetchpriority="high" decoding="async" />`
  }
  if (isIdraulico(file)) {
    return `<img class="lp-hero__bg-img" src="./img/idraulico-bg.webp" srcset="./img/idraulico-bg-720.webp 720w, ./img/idraulico-bg.webp 1200w" sizes="100vw" width="1200" height="800" alt="" fetchpriority="high" decoding="async" />`
  }
  return ''
}

const files = readdirSync(root).filter((f) => f.endsWith('.html'))

for (const file of files) {
  let html = readFileSync(join(root, file), 'utf8')
  let changed = false

  // Favicon → tiny PNG
  const favNew = '  <link rel="icon" href="./img/favicon-32.png" type="image/png" sizes="32x32" />\n  <link rel="icon" href="./img/favicon-48.png" type="image/png" sizes="48x48" />'
  if (/<link rel="icon"[^>]*>/.test(html)) {
    const next = html.replace(/  <link rel="icon"[^>]*>\r?\n(?:  <link rel="icon"[^>]*>\r?\n)?/, favNew + '\n')
    if (next !== html) {
      html = next
      changed = true
    }
  }

  if (isLanding(file)) {
    // Fonts reduced
    if (oldFonts.test(html)) {
      html = html.replace(oldFonts, fontsBlock)
      changed = true
    } else if (oldFontsSimple.test(html)) {
      html = html.replace(oldFontsSimple, fontsBlock + '\n')
      changed = true
    } else if (html.includes('Barlow+Semi+Condensed')) {
      html = html.replace(
        /https:\/\/fonts\.googleapis\.com\/css2\?[^"]+/g,
        FONT_URL
      )
      changed = true
    }

    // Remove hashed CSS, use source path + async
    html = html.replace(
      /\s*<link rel="stylesheet"[^>]*href="\.\/assets\/site-[^"]+\.css"[^>]*>/g,
      ''
    )
    html = html.replace(
      /\s*<link rel="preload"[^>]*href="\.\/css\/site\.css"[^>]*>\s*<noscript><link rel="stylesheet" href="\.\/css\/site\.css" \/><\/noscript>/g,
      ''
    )
    html = html.replace(/\s*<link rel="stylesheet" href="\.\/css\/site\.css" \/>/g, '')

    if (!html.includes('id="critical-lp"')) {
      html = html.replace('</head>', `${criticalLanding}\n</head>`)
      changed = true
    }

    const asyncCss = `  <link rel="preload" href="./css/site.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />\n  <noscript><link rel="stylesheet" href="./css/site.css" /></noscript>`
    if (!html.includes('href="./css/site.css"')) {
      html = html.replace('</head>', `${asyncCss}\n</head>`)
      changed = true
    }

    // Hero preload
    const pre = heroPreload(file)
    if (pre && !html.includes('bg-lock-720.webp') && !html.includes('idraulico-bg-720.webp')) {
      html = html.replace('</head>', `${pre}\n</head>`)
      changed = true
    }

    // Replace empty bg div with img (keep shade)
    const img = heroImg(file)
    if (img && html.includes('lp-hero__bg') && !html.includes('lp-hero__bg-img')) {
      html = html.replace(
        /<div class="lp-hero__bg" aria-hidden="true"><\/div>/,
        img
      )
      changed = true
    } else if (img && html.includes('lp-hero__bg') && html.includes('lp-hero__bg-img') === false) {
      // already might be self-closing variants
    }

    // tracking: keep in head but ensure it's not before preload hero — move after preloads is fine
    changed = true
  }

  if (file === 'index.html') {
    // homepage: async full CSS already has critical; fix favicon done; preload mobile hero
    if (!html.includes('bg-lock-720.webp')) {
      html = html.replace(
        /<link rel="preload" as="image" href="\.\/assets\/bg-lock[^"]+"[^>]*>/,
        `<link rel="preload" as="image" href="./img/bg-lock-720.webp" type="image/webp" imagesrcset="./img/bg-lock-720.webp 720w, ./img/bg-lock.webp 1200w" imagesizes="100vw" fetchpriority="high" />`
      )
      changed = true
    }
    // hero img use srcset
    if (html.includes('home-panel__bg') && !html.includes('bg-lock-720.webp" srcset') && !html.includes('srcset="./img/bg-lock-720')) {
      html = html.replace(
        /<img class="home-panel__bg" src="[^"]*bg-lock[^"]*"([^>]*)>/,
        `<img class="home-panel__bg" src="./img/bg-lock.webp" srcset="./img/bg-lock-720.webp 720w, ./img/bg-lock.webp 1200w" sizes="100vw" width="1200" height="800" alt="" fetchpriority="high" decoding="async" />`
      )
      html = html.replace(
        /<img class="home-panel__bg" src="[^"]*idraulico-bg[^"]*"([^>]*)>/,
        `<img class="home-panel__bg" src="./img/idraulico-bg.webp" srcset="./img/idraulico-bg-720.webp 720w, ./img/idraulico-bg.webp 1200w" sizes="100vw" width="1200" height="800" alt="" loading="lazy" decoding="async" />`
      )
      changed = true
    }
    // async site.css on homepage if blocking hashed
    if (html.includes('assets/site-') && html.includes('stylesheet')) {
      html = html.replace(
        /\s*<link rel="stylesheet"[^>]*href="\.\/assets\/site-[^"]+\.css"[^>]*>/,
        `\n  <link rel="preload" href="./css/site.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />\n  <noscript><link rel="stylesheet" href="./css/site.css" /></noscript>`
      )
      changed = true
    }
  }

  if (changed) {
    writeFileSync(join(root, file), html)
    console.log('patched', file)
  }
}

console.log('LCP HTML patch done.')
