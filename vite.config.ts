import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import type { Plugin, ViteDevServer } from 'vite'

// Prefer real files under /games/* over the SPA fallback
function gamesStaticPlugin(): Plugin {
  return {
    name: 'games-static',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] ?? ''
        if (!url.startsWith('/games/')) return next()

        const rel = decodeURIComponent(url.replace(/^\//, ''))
        const filePath = path.resolve(server.config.root, 'public', rel)
        const candidate = fs.existsSync(filePath)
          ? filePath
          : fs.existsSync(path.join(filePath, 'index.html'))
            ? path.join(filePath, 'index.html')
            : null

        if (!candidate || !fs.statSync(candidate).isFile()) return next()

        if (candidate.endsWith('.html')) {
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          fs.createReadStream(candidate).pipe(res)
          return
        }
        return next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), gamesStaticPlugin()],
})
