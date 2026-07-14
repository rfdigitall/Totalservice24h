import { readdirSync } from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'

const cityPages = Object.fromEntries(
  readdirSync(__dirname)
    .filter((file) => /^(fabbro|idraulico)-.+\.html$/.test(file))
    .map((file) => [file.replace('.html', ''), resolve(__dirname, file)])
)

/** Landing pages = HTML/CSS/JS static. No React bundle on fabbro/idraulico. */
export default defineConfig({
  base: './',
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        fabbro: resolve(__dirname, 'fabbro.html'),
        idraulico: resolve(__dirname, 'idraulico.html'),
        grazie: resolve(__dirname, 'grazie.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        cookie: resolve(__dirname, 'cookie.html'),
        ...cityPages,
      },
    },
  },
})
