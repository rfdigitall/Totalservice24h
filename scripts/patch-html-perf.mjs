import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const FONT_URL =
  'https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@700&family=IBM+Plex+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Roboto+Slab:wght@700&display=swap'

const fontsBlock = `  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" as="style" href="${FONT_URL}" />
  <link href="${FONT_URL}" rel="stylesheet" media="print" onload="this.media='all'" />
  <noscript><link href="${FONT_URL}" rel="stylesheet" /></noscript>`

const oldFonts =
  /  <link rel="preconnect" href="https:\/\/fonts\.googleapis\.com" \/>\r?\n  <link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin \/>\r?\n  <link href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]+" rel="stylesheet" \/>/g

const oldTrackingHead = '  <script src="./js/tracking-config.js" defer></script>\r\n</head>'
const newTrackingHead = '</head>'
const oldSiteJs = '  <script src="./js/site.js" defer></script>'
const newSiteJs = '  <script src="./js/tracking-config.js"></script>\n  <script src="./js/site.js" defer></script>'

const blockingCss =
  /  <link rel="preload" href="\.\/css\/site\.css" as="style" \/>\r?\n  <link rel="stylesheet" href="\.\/css\/site\.css" \/>/
const asyncCss =
  `  <link rel="preload" href="./css/site.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />\n  <noscript><link rel="stylesheet" href="./css/site.css" /></noscript>`

const plainCss = '  <link rel="stylesheet" href="./css/site.css" />'

const logoImg =
  /<img src="\.\/img\/logo-transparent\.png"([^>]*class="logo__img"[^>]*)>/g
const logoPicture =
  '<picture><source srcset="./img/logo-transparent-200.webp 200w, ./img/logo-transparent.webp 400w" sizes="(max-width:480px) 200px, 400px" type="image/webp" /><img src="./img/logo-transparent.png"$1></picture>'

const nestedLogoPicture =
  /<picture><source srcset="\.\/img\/logo-transparent-200\.webp 200w, \.\/img\/logo-transparent\.webp 400w" sizes="\(max-width:480px\) 200px, 400px" type="image\/webp" \/><picture><source srcset="\.\/img\/logo-transparent-200\.webp 200w, \.\/img\/logo-transparent\.webp 400w" sizes="\(max-width:480px\) 200px, 400px" type="image\/webp" \/><img([^>]*)><\/picture><\/picture>/g
const singleLogoPicture =
  '<picture><source srcset="./img/logo-transparent-200.webp 200w, ./img/logo-transparent.webp 400w" sizes="(max-width:480px) 200px, 400px" type="image/webp" /><img$1></picture>'

const footerLogo =
  /<img src="\.\/img\/logo-transparent\.png" alt="Total Service 24H" class="footer__logo" width="180" height="60" \/>/g
const footerPicture =
  '<picture><source srcset="./img/logo-transparent-200.webp" type="image/webp" /><img src="./img/logo-transparent.png" alt="Total Service 24H" class="footer__logo" width="180" height="60" loading="lazy" decoding="async" /></picture>'

const homeBg =
  /(<a href="\.\/fabbro\.html" class="home-panel home-panel--fabbro">\r?\n\s*)<div class="home-panel__bg" aria-hidden="true"><\/div>/
const homeBgNew =
  '$1<img class="home-panel__bg" src="./img/bg-lock.webp" alt="" width="960" height="640" fetchpriority="high" decoding="async" />'

const homeBg2 =
  /(<a href="\.\/idraulico\.html" class="home-panel home-panel--idraulico">\r?\n\s*)<div class="home-panel__bg" aria-hidden="true"><\/div>/
const homeBg2New =
  '$1<img class="home-panel__bg" src="./img/idraulico-bg.webp" alt="" width="960" height="640" loading="lazy" decoding="async" />'

const files = readdirSync(root).filter((f) => f.endsWith('.html'))

for (const file of files) {
  let html = readFileSync(join(root, file), 'utf8')
  let changed = false

  if (oldFonts.test(html)) {
    html = html.replace(oldFonts, fontsBlock)
    changed = true
  }
  if (html.includes(oldTrackingHead)) {
    html = html.replace(oldTrackingHead, newTrackingHead)
    changed = true
  } else if (html.includes('  <script src="./js/tracking-config.js"></script>\n</head>')) {
    html = html.replace('  <script src="./js/tracking-config.js"></script>\n</head>', '</head>')
    changed = true
  }
  if (html.includes(oldSiteJs) && !html.includes('tracking-config.js"></script>\n  <script src="./js/site.js"')) {
    html = html.replace(oldSiteJs, newSiteJs)
    changed = true
  }

  const beforeDedupe = html
  html = html.replace(/(<script src="\.\/js\/tracking-config\.js"><\/script>\s*){2,}/g, '<script src="./js/tracking-config.js"></script>\n  ')
  if (html !== beforeDedupe) changed = true
  if (!html.includes('tracking-config.js') && html.includes('site.js')) {
    html = html.replace('  <script src="./js/site.js" defer></script>', newSiteJs)
    changed = true
  }
  if (file !== 'index.html') {
    if (blockingCss.test(html)) {
      html = html.replace(blockingCss, asyncCss)
      changed = true
    } else if (html.includes(plainCss) && !html.includes("onload=\"this.onload=null;this.rel='stylesheet'\"")) {
      html = html.replace(plainCss, asyncCss)
      changed = true
    }
  }
  if (nestedLogoPicture.test(html)) {
    html = html.replace(nestedLogoPicture, singleLogoPicture)
    changed = true
  }
  if (!html.includes('class="logo__img"') || !html.match(/<picture[^>]*>[\s\S]*?class="logo__img"/)) {
    if (logoImg.test(html)) {
      html = html.replace(logoImg, logoPicture)
      changed = true
    }
  }
  if (footerLogo.test(html)) {
    html = html.replace(footerLogo, footerPicture)
    changed = true
  }
  if (file === 'index.html') {
    if (homeBg.test(html)) {
      html = html.replace(homeBg, homeBgNew)
      changed = true
    }
    if (homeBg2.test(html)) {
      html = html.replace(homeBg2, homeBg2New)
      changed = true
    }
  }

  if (changed) {
    writeFileSync(join(root, file), html)
    console.log('patched', file)
  }
}

console.log('HTML perf patch done.')
