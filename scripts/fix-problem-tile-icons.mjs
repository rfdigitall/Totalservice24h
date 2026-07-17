import fs from 'fs'

const files = fs.readdirSync('.').filter((f) => f.endsWith('.html'))
const criticalSnippet =
  '.problem-tile__icon{width:2.35rem;height:2.35rem;display:grid;place-items:center;flex-shrink:0}.problem-tile__icon svg{width:1.15rem;height:1.15rem}'

let changed = 0

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8')
  const before = html

  html = html.replaceAll('./assets/site-BcsyR53j.css', './assets/site-BcsyR53j.css?v=2')
  html = html.replaceAll('./assets/site-BcsyR53j.css?v=2?v=2', './assets/site-BcsyR53j.css?v=2')

  html = html.replace(
    /(<span class="problem-tile__icon"[^>]*>\s*<svg viewBox="0 0 24 24" fill="currentColor")(?![^>]*\bwidth=)/g,
    '$1 width="18" height="18"'
  )

  if (html.includes('id="critical-lp"') && !html.includes('.problem-tile__icon svg{width:1.15rem')) {
    html = html.replace(
      /(<style id="critical-lp">[\s\S]*?)(<\/style>)/,
      `$1${criticalSnippet}$2`
    )
  }

  if (html !== before) {
    fs.writeFileSync(file, html)
    changed += 1
  }
}

const fab = fs.readFileSync('fabbro.html', 'utf8')
console.log('files_changed=' + changed)
console.log('fabbro_css=' + (fab.match(/site-BcsyR53j\.css[^"']*/)?.[0] || 'none'))
console.log('fabbro_svg_w18=' + /problem-tile__icon[\s\S]{0,80}<svg[^>]*width="18"/.test(fab))
console.log('fabbro_critical=' + fab.includes('.problem-tile__icon svg{width:1.15rem'))
