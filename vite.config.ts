import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Retirement Planner',
                short_name: 'Retire',
                start_url: '/taxcalc/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#0b5fff',
                icons: [
                    {
                        src: 'pwa-192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-maskable.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                navigateFallback: 'index.html',
            },
        }),
    ],
    base: '/taxcalc/',
    server: {
        port: 62532,
    },
});
