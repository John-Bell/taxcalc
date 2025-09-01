import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        plugin(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Retirement Planner',
                short_name: 'Retire',
                start_url: '/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#0b5fff',
                icons: [
                    {
                        src: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'%3e%3crect width='192' height='192' fill='%230b5fff'/%3e%3c/svg%3e",
                        sizes: '192x192',
                        type: 'image/svg+xml',
                    },
                    {
                        src: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e%3crect width='512' height='512' fill='%230b5fff'/%3e%3c/svg%3e",
                        sizes: '512x512',
                        type: 'image/svg+xml',
                    },
                    {
                        src: "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3e%3crect width='512' height='512' fill='%230b5fff'/%3e%3c/svg%3e",
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'maskable',
                    },
                ],
            },
            workbox: {
                navigateFallback: '/index.html',
            },
        }),
    ],
    server: {
        port: 62532,
    },
});
