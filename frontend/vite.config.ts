import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function syncResearchPdf(): Plugin {
  const syncFile = () => {
    try {
      const sourcePdf = path.resolve(__dirname, '../Final Research Paper/RESEARCH_PAPER.pdf')
      const targetPdf = path.resolve(__dirname, 'public/RESEARCH_PAPER.pdf')
      if (fs.existsSync(sourcePdf)) {
        fs.copyFileSync(sourcePdf, targetPdf)
        console.log('[sync-pdf] Synchronized RESEARCH_PAPER.pdf from Final Research Paper to public/')
      }
    } catch (err) {
      console.warn('[sync-pdf] Could not sync RESEARCH_PAPER.pdf:', err)
    }
  }

  return {
    name: 'sync-research-pdf',
    buildStart() {
      syncFile()
    },
    configureServer() {
      syncFile()
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), syncResearchPdf()],
  base: './',
})

