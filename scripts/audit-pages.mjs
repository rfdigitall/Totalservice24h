import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const files = readdirSync(root).filter((f) => f.endsWith('.html')).sort()

const LANDING = /^(index|fabbro|idraulico|fabbro-.+|idraulico-.+)\.html$/
const LEGAL = /^(privacy|cookie)\.html$/
const THANKYOU = 'grazie.html'

const issues = {}

function add(file, msg) {
  if (!issues[file]) issues[file] = []
  issues[file].push(msg)
}

for (const file of files) {
  const html = readFileSync(join(root, file), 'utf8')

  if (file === THANKYOU) {
    if (!/noindex/.test(html)) add(file, 'grazie must be noindex')
    continue
  }

  if (!/meta name="robots" content="index, follow"/.test(html)) {
    add(file, 'missing robots index,follow')
  }

  if (!html.includes('rel="canonical"') && file !== 'index.html') {
    add(file, 'missing canonical')
  }

  if (LANDING.test(file) && !html.includes('application/ld+json')) {
    add(file, 'missing JSON-LD')
  }

  if (!html.includes('tracking-config.js')) add(file, 'missing tracking-config.js')
  if (!html.includes('site.js')) add(file, 'missing site.js')
  if (!html.includes('cookie-accept')) add(file, 'missing cookie banner')

  if (LANDING.test(file)) {
    if (!html.includes('call-fab')) add(file, 'missing call-fab')
    if (!html.includes('callback-modal') && file !== 'index.html') add(file, 'missing callback modal')
    if (!html.includes('LANDING_CONFIG') && file !== 'index.html') add(file, 'missing LANDING_CONFIG')
    if (!html.includes('sibling-service') && file !== 'index.html') add(file, 'missing sibling-service section')
  }

  if (/<picture><source[^>]+><picture>/.test(html)) add(file, 'double nested picture logo')
  if (!html.includes('tracking-config.js"></script>\n</head>')) add(file, 'tracking-config.js should load in head')

  if (LEGAL.test(file) && html.includes('noindex')) add(file, 'legal page should be indexable')
}

const count = Object.keys(issues).length
if (count === 0) {
  console.log(`OK — ${files.length} pagini HTML coerenti e pronte per Google.`)
  process.exit(0)
}

console.log(`Problemi su ${count} file:\n`)
for (const [file, msgs] of Object.entries(issues)) {
  console.log(`${file}:`)
  for (const m of msgs) console.log(`  - ${m}`)
}
process.exit(1)
