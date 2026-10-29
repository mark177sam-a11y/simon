import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    base: '/simon/',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'sw.js', 'custom-sw.js', 'firebase-messaging-sw.js'],
        manifest: {
          id: '/simon/',
          name: 'Webstudios Mobile',
          short_name: 'Webstudios',
          description: 'Official Android app for webstudios.world: book custom websites, discovery calls, and manage builds.',
          theme_color: '#0f172a',
          background_color: '#020617',
          display: 'standalone',
          start_url: '/simon/',
          scope: '/simon/',
          icons: [
            {
              src: '/simon/icon.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any',
            },
            {
              src: '/simon/icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
