import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { createRequire } from 'module'

const root = path.resolve('.')
const require = createRequire(import.meta.url)

const svg = fs.readFileSync(path.join(root, 'favicon.svg'))

const outDir = path.join(root, 'img')
const sizes = [16, 32, 48, 180]
for (const size of sizes) {
  const dest = path.join(outDir, `favicon-${size}.png`)
  if (!fs.existsSync(dest)) {
    await sharp(svg).resize(size, size).png().toFile(dest)
  }
  fs.copyFileSync(dest, path.join(root, 'public', 'img', `favicon-${size}.png`))
}

await sharp(svg).resize(32, 32).png().toFile(path.join(root, 'assets', 'favicon-32-COruhizN.png'))
await sharp(svg).resize(48, 48).png().toFile(path.join(root, 'assets', 'favicon-48-4ua-gBaB.png'))

let pngToIco = require('png-to-ico')
if (pngToIco && typeof pngToIco !== 'function' && typeof pngToIco.default === 'function') {
  pngToIco = pngToIco.default
}
const icoBuf = await pngToIco([
  path.join(outDir, 'favicon-16.png'),
  path.join(outDir, 'favicon-32.png'),
  path.join(outDir, 'favicon-48.png'),
])
fs.writeFileSync(path.join(root, 'favicon.ico'), icoBuf)
fs.writeFileSync(path.join(root, 'public', 'favicon.ico'), icoBuf)
fs.copyFileSync(path.join(root, 'favicon.svg'), path.join(root, 'public', 'favicon.svg'))
console.log('favicon.ico bytes', icoBuf.length)

const ICON_BLOCK = `  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="icon" href="/img/favicon-32.png" type="image/png" sizes="32x32" />
  <link rel="icon" href="/img/favicon-48.png" type="image/png" sizes="48x48" />
  <link rel="apple-touch-icon" href="/img/favicon-180.png" sizes="180x180" />`

const files = fs.readdirSync(root).filter((f) => f.endsWith('.html'))
let n = 0
for (const file of files) {
  let html = fs.readFileSync(path.join(root, file), 'utf8')
  const before = html
  html = html.replace(/\s*<link[^>]+rel="(?:shortcut )?icon"[^>]*>/gi, '')
  html = html.replace(/\s*<link[^>]+rel="apple-touch-icon"[^>]*>/gi, '')
  if (!/<\/title>/i.test(html)) continue
  html = html.replace(/<\/title>/i, `</title>\n${ICON_BLOCK}`)
  if (html !== before) {
    fs.writeFileSync(path.join(root, file), html)
    n += 1
  }
}
console.log('html_updated=' + n)
console.log('sample', fs.readFileSync('fabbro.html', 'utf8').match(/favicon[^"]+|apple-touch[^"]+/g))
