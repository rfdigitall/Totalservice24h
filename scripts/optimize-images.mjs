import sharp from 'sharp'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const imgDir = join(dirname(fileURLToPath(import.meta.url)), '../public/img')

const jobs = [
  { src: 'logo-transparent.png', out: 'logo-transparent.webp', w: 400, q: 82 },
  { src: 'logo-transparent.png', out: 'logo-transparent-200.webp', w: 200, q: 80 },
  { src: 'bg-lock.jpg', out: 'bg-lock.webp', w: 960, q: 78 },
  { src: 'idraulico-bg.jpg', out: 'idraulico-bg.webp', w: 800, q: 68 },
]

for (const job of jobs) {
  const input = join(imgDir, job.src)
  if (!existsSync(input)) {
    console.warn('Skip (missing):', job.src)
    continue
  }
  const output = join(imgDir, job.out)
  await sharp(input)
    .resize({ width: job.w, withoutEnlargement: true })
    .webp({ quality: job.q })
    .toFile(output)
  const inKb = (await sharp(input).metadata()).size || 0
  const { size } = await sharp(output).metadata()
  console.log(`${job.out} ← ${job.src} (${Math.round(size / 1024)} KiB)`)
}

console.log('Done.')
