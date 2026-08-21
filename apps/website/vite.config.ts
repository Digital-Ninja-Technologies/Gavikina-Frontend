import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    nitro({
      preset: 'vercel',
      rollupConfig: { external: [/^@sentry\//] },
      routeRules: {
        '/dashboard': { proxy: 'https://gavikina-admin.vercel.app/dashboard' },
        '/dashboard/**': { proxy: 'https://gavikina-admin.vercel.app/dashboard/**' },
      },
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
