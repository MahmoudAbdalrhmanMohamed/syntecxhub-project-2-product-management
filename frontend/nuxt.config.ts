import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExports } from 'unimport';

const currentDir = path.dirname(fileURLToPath(import.meta.url));

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  hooks: {
    async 'imports:extend'(imports) {
      for (const dirName of ['composables', 'stores']) {
        const dir = path.resolve(currentDir, 'app', dirName);
        if (!fs.existsSync(dir)) continue;
        const files = fs.readdirSync(dir).filter((f) => f.endsWith('.ts') && !f.endsWith('.d.ts'));
        for (const f of files) {
          const filePath = path.join(dir, f);
          const scanned = await scanExports(filePath, false);
          for (const exp of scanned) {
            if (!imports.some((i) => i.name === exp.name)) {
              imports.push({
                name: exp.name,
                as: exp.as,
                from: `~/${dirName}/${f.replace(/\.ts$/, '')}`,
              });
            }
          }
        }
      }
    },
  },

  ssr: true,

  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
  ],

  css: ['~/assets/css/main.css'],

  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
    storageKey: 'syntecxhub-color-mode',
  },

  runtimeConfig: {
    internalApiSecret: process.env.NUXT_INTERNAL_API_SECRET || 'syntecxhub-internal-ssr-key',
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api',
      backendOrigin: process.env.NUXT_PUBLIC_BACKEND_ORIGIN || 'http://localhost:4000',
      appName: 'Syntecxhub Inventory',
      appVersion: '1.0.0',
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      titleTemplate: '%s — Syntecxhub Inventory',
      title: 'Hardware Catalog & Global SKU Telemetry',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Syntecxhub Inventory — High-Tech Hardware Inventory, SKU Telemetry, and Cloud Appliance Management.',
        },
        { name: 'keywords', content: 'SKU Nexus, Hardware Inventory, Stock Management, Asset Tracking, Telemetry Catalog, Enterprise Stock Valuation, NestJS Inventory, Nuxt 4' },
        { name: 'author', content: 'Syntecxhub Enterprise' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'theme-color', content: '#070D14' },

        // Google Search Console & Webmaster Verification
        { name: 'google-site-verification', content: process.env.NUXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'syntecxhub-inventory-gsc-verification-token' },
        { name: 'msvalidate.01', content: process.env.NUXT_PUBLIC_BING_SITE_VERIFICATION || 'syntecxhub-inventory-bing-verification-token' },
        { name: 'yandex-verification', content: process.env.NUXT_PUBLIC_YANDEX_SITE_VERIFICATION || 'syntecxhub-inventory-yandex-verification-token' },

        // Geographic (GEO) Meta Tags
        { name: 'geo.region', content: 'US-CA' },
        { name: 'geo.placename', content: 'San Francisco' },
        { name: 'geo.position', content: '37.7749;-122.4194' },
        { name: 'ICBM', content: '37.7749, -122.4194' },

        // OpenGraph (SEO / Social)
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Syntecxhub Inventory' },
        { property: 'og:title', content: 'Syntecxhub Inventory — Hardware Catalog & Global SKU Telemetry' },
        { property: 'og:description', content: 'Real-time hardware inventory, stock valuation matrices, warehouse telemetry, and OpenAPI integration.' },
        { property: 'og:url', content: 'https://inventory.syntecxhub.com/' },
        { property: 'og:image', content: 'https://inventory.syntecxhub.com/favicon.svg' },
        { property: 'og:locale', content: 'en_US' },

        // Twitter Card (SEO / Social)
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@syntecxhub' },
        { name: 'twitter:creator', content: '@syntecxhub' },
        { name: 'twitter:title', content: 'Syntecxhub Inventory — Hardware & SKU Telemetry' },
        { name: 'twitter:description', content: 'Enterprise hardware inventory, stock valuation, and warehouse telemetry.' },
        { name: 'twitter:image', content: 'https://inventory.syntecxhub.com/favicon.svg' },
      ],
      link: [
        { rel: 'canonical', href: 'https://inventory.syntecxhub.com/' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'alternate icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap',
        },
      ],
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  routeRules: {
    '/': { ssr: true },
    '/users': { ssr: true },
    '/products': { ssr: true },
    '/media': { ssr: true },
    '/settings': { ssr: true },
    '/api-docs': { ssr: true },
  },
});
