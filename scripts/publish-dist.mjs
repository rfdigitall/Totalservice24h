import { cpSync, existsSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

if (!existsSync(dist)) {
  console.error('dist/ missing — run npm run build first')
  process.exit(1)
}

for (const name of readdirSync(dist)) {
  cpSync(join(dist, name), join(root, name), { recursive: true })
}

console.log('Published dist/ → root (GitHub Pages ready).')
