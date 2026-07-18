import fs from 'fs'

const files = fs.readdirSync('.').filter((f) => f.endsWith('.html'))
let n = 0
for (const f of files) {
  let h = fs.readFileSync(f, 'utf8')
  const b = h
  h = h.replaceAll('./js/tracking-config.js', './js/tracking-config.js?v=3')
  h = h.replaceAll('./js/tracking-config.js?v=3?v=3', './js/tracking-config.js?v=3')
  h = h.replaceAll('./js/site.js', './js/site.js?v=3')
  h = h.replaceAll('./js/site.js?v=3?v=3', './js/site.js?v=3')
  if (h !== b) {
    fs.writeFileSync(f, h)
    n += 1
  }
}
console.log('html_updated=' + n)
const fab = fs.readFileSync('fabbro.html', 'utf8')
console.log(fab.match(/tracking-config\.js[^"']*|site\.js[^"']*/g))
