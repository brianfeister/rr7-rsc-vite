import rsc from '@vitejs/plugin-rsc'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
// import inspect from 'vite-plugin-inspect'

export default defineConfig({
  clearScreen: false,
  build: {
    minify: false,
  },
  plugins: [
    // inspect(),
    tailwindcss(),
    react(),
    rsc({
      entries: {
        client: './react-router-vite/entry.browser.tsx',
        ssr: './react-router-vite/entry.ssr.tsx',
        rsc: './react-router-vite/entry.rsc.single.tsx',
      },
    }),
    simpleCfPlugin(),
  ],
  optimizeDeps: {
    include: ['react-router', 'react-router/internal/react-server-client'],
  },
}) as any

function simpleCfPlugin(): Plugin[] {
  return [
        {
      name: 'cf-build',
      enforce: 'post',
      apply: () => !!process.env.SIMPLE_CF,
      configEnvironment() {
        return {
          keepProcessEnv: false,
          resolve: {
            noExternal: true,
          },
        }
      },
      generateBundle() {
        if (this.environment.name === 'rsc') {
          this.emitFile({
            type: 'asset',
            fileName: 'cloudflare.js',
            source: `\
import handler from './index.js';
export default { fetch: handler };
`,
          })
        }
        if (this.environment.name === 'client') {
          // https://developers.cloudflare.com/workers/static-assets/headers/#custom-headers
          this.emitFile({
            type: 'asset',
            fileName: '_headers',
            source: `\
/favicon.ico
  Cache-Control: public, max-age=3600, s-maxage=3600
/assets/*
  Cache-Control: public, max-age=31536000, immutable
`,
          })
        }
      },
    }
  ]
}
